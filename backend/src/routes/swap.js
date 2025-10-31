const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /api/swappable-slots
 * Return all slots that are SWAPPABLE and not owned by the current user.
 */
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    console.log('GET /swappable-slots called by', userId);
    const slots = await Event.find({ status: 'SWAPPABLE', owner: { $ne: userId } })
      .populate('owner', 'name email'); // return owner name/email so frontend can show it
    return res.json({ slots });
  } catch (err) {
    console.error('GET /swappable-slots error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/swap-requests
 * Return incoming and outgoing swap requests for the logged-in user.
 */
router.get('/swap-requests', auth, async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    console.log('GET /swap-requests called by', userId);

    const incoming = await SwapRequest.find({ responder: userId })
      .populate('requester', 'name email')
      .populate('mySlot', 'title startTime endTime status owner')
      .populate('theirSlot', 'title startTime endTime status owner')
      .sort({ createdAt: -1 });

    const outgoing = await SwapRequest.find({ requester: userId })
      .populate('responder', 'name email')
      .populate('mySlot', 'title startTime endTime status owner')
      .populate('theirSlot', 'title startTime endTime status owner')
      .sort({ createdAt: -1 });

    return res.json({ incoming, outgoing });
  } catch (err) {
    console.error('GET /swap-requests error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* ---------------- existing POST handlers (swap-request & swap-response) ---------------- */

router.post('/swap-request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const requesterId = req.user && (req.user._id || req.user.id);

  if (!mySlotId || !theirSlotId) return res.status(400).json({ error: 'mySlotId and theirSlotId required' });
  if (!isValidId(mySlotId) || !isValidId(theirSlotId)) return res.status(400).json({ error: 'Invalid id format' });
  if (mySlotId === theirSlotId) return res.status(400).json({ error: 'Cannot swap same slot' });

  try {
    // Load events
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) return res.status(404).json({ error: 'One or both slots not found' });

    // Ownership checks
    if (String(mySlot.owner) !== String(requesterId)) return res.status(403).json({ error: 'You do not own the offered slot' });
    if (String(theirSlot.owner) === String(requesterId)) return res.status(400).json({ error: 'Their slot belongs to you' });

    // Must be SWAPPABLE
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(409).json({ error: 'Both slots must be SWAPPABLE' });
    }

    // Atomically set both slots to SWAP_PENDING only if they are still SWAPPABLE
    const updatedMy = await Event.findOneAndUpdate(
      { _id: mySlotId, status: 'SWAPPABLE' },
      { $set: { status: 'SWAP_PENDING' } },
      { new: true }
    );

    if (!updatedMy) {
      return res.status(409).json({ error: 'Failed to reserve your slot; try again' });
    }

    const updatedTheir = await Event.findOneAndUpdate(
      { _id: theirSlotId, status: 'SWAPPABLE' },
      { $set: { status: 'SWAP_PENDING' } },
      { new: true }
    );

    if (!updatedTheir) {
      // rollback my change
      await Event.findByIdAndUpdate(mySlotId, { $set: { status: 'SWAPPABLE' } });
      return res.status(409).json({ error: 'Failed to reserve their slot; it may have been taken' });
    }

    // Create swap request
    const newSwap = await SwapRequest.create({
      requester: requesterId,
      responder: theirSlot.owner,
      mySlot: mySlotId,
      theirSlot: theirSlotId,
      status: 'PENDING',
      createdAt: new Date()
    });

    return res.status(201).json({ request: newSwap });
  } catch (err) {
    console.error('swap-request error:', err);
    return res.status(500).json({ error: 'Server error during swap-request', detail: err.message });
  }
});

router.post('/swap-response/:requestId', auth, async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body;
  const userId = req.user && (req.user._id || req.user.id);

  if (!isValidId(requestId)) return res.status(400).json({ error: 'Invalid requestId' });

  try {
    const request = await SwapRequest.findById(requestId).populate('mySlot theirSlot');
    if (!request) return res.status(404).json({ error: 'Swap request not found' });

    if (String(request.responder) !== String(userId)) return res.status(403).json({ error: 'Only the responder can answer' });
    if (request.status !== 'PENDING') return res.status(409).json({ error: 'Swap request already processed' });

    if (!accept) {
      // Reject: set swap status and revert events to SWAPPABLE
      request.status = 'REJECTED';
      await request.save();
      await Event.findByIdAndUpdate(request.mySlot, { status: 'SWAPPABLE' });
      await Event.findByIdAndUpdate(request.theirSlot, { status: 'SWAPPABLE' });
      return res.json({ ok: true, request });
    }

    // Accept: swap owners (no transactions) — do them sequentially
    const mySlot = await Event.findById(request.mySlot);
    const theirSlot = await Event.findById(request.theirSlot);

    const ownerA = mySlot.owner;
    mySlot.owner = theirSlot.owner;
    theirSlot.owner = ownerA;
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    await mySlot.save();
    await theirSlot.save();

    request.status = 'ACCEPTED';
    await request.save();

    return res.json({ ok: true, request });
  } catch (err) {
    console.error('swap-response error:', err);
    return res.status(500).json({ error: 'Server error during swap-response', detail: err.message });
  }
});

module.exports = router;