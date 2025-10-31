const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get my events
router.get('/', auth, async (req,res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json({ events });
});

// Create event
router.post('/', auth, async (req,res) => {
  const { title, startTime, endTime, status } = req.body;
  const ev = await Event.create({ title, startTime, endTime, status: status || 'BUSY', owner: req.user._id });
  res.status(201).json({ event: ev });
});

// Update event (owner only)
router.put('/:id', auth, async (req,res) => {
  const ev = await Event.findById(req.params.id);
  if(!ev) return res.status(404).json({ error: 'Not found' });
  if(String(ev.owner) !== String(req.user._id)) return res.status(403).json({ error: 'Not allowed' });
  Object.assign(ev, req.body);
  await ev.save();
  res.json({ event: ev });
});

// Delete
router.delete('/:id', auth, async (req,res) => {
  const ev = await Event.findById(req.params.id);
  if(!ev) return res.status(404).json({ error: 'Not found' });
  if(String(ev.owner) !== String(req.user._id)) return res.status(403).json({ error: 'Not allowed' });
  await ev.deleteOne();
  res.json({ ok: true });
});

module.exports = router;
