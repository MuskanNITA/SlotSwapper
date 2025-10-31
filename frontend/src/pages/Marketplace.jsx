import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Marketplace(){
  const [slots, setSlots] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [selectedTheir, setSelectedTheir] = useState(null);
  const [selectedMy, setSelectedMy] = useState(null);

  async function load(){
    const a = await API.get('/swappable-slots');
    setSlots(a.data.slots);
    const b = await API.get('/events');
    setMySwappables(b.data.events.filter(e => e.status === 'SWAPPABLE'));
  }

  useEffect(()=> { load(); }, []);

  async function requestSwap(){
    if(!selectedTheir || !selectedMy) return alert('Choose both slots');
    await API.post('/swap-request', { mySlotId: selectedMy, theirSlotId: selectedTheir });
    alert('Requested');
    load();
  }

  return (
    <div style={{display:'flex', gap:20}}>
      <div style={{flex:1}}>
        <h3>Available slots</h3>
        {slots.map(s => (
          <div key={s._id} style={{border:'1px solid #eee', padding:8, margin:6}}>
            <div>{s.title}</div>
            <div>{new Date(s.startTime).toLocaleString()}</div>
            <div>Owner: {s.owner?.name}</div>
            <button onClick={()=>setSelectedTheir(s._id)}>{selectedTheir===s._id?'Selected':'Choose'}</button>
          </div>
        ))}
      </div>

      <div style={{flex:1}}>
        <h3>My swappable slots</h3>
        {mySwappables.map(s => (
          <div key={s._id} style={{border:'1px solid #eee', padding:8, margin:6}}>
            <div>{s.title}</div>
            <div>{new Date(s.startTime).toLocaleString()}</div>
            <button onClick={()=>setSelectedMy(s._id)}>{selectedMy===s._id?'Selected':'Choose'}</button>
          </div>
        ))}
        <div style={{marginTop:12}}>
          <button onClick={requestSwap}>Request Swap</button>
        </div>
      </div>
    </div>
  );
}
