import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard(){
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [startTime,setStartTime] = useState('');
  const [endTime,setEndTime] = useState('');
  const { user, logout } = useContext(AuthContext);

  async function load(){
    setLoading(true);
    const { data } = await API.get('/events');
    setEvents(data.events);
    setLoading(false);
  }
  useEffect(()=> { load(); }, []);

  async function create(e){
    e.preventDefault();
    await API.post('/events', { title, startTime, endTime });
    setTitle(''); setStartTime(''); setEndTime('');
    load();
  }

  async function toggle(ev){
    const newStatus = ev.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
    await API.put(`/events/${ev._id}`, { status: newStatus });
    load();
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>Welcome, {user?.name || 'User'}</div>
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h3>Create Event</h3>
      <form onSubmit={create} style={{maxWidth:640}}>
        <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="start ISO (e.g. 2025-11-04T10:00:00.000Z)" value={startTime} onChange={e=>setStartTime(e.target.value)} />
        <input placeholder="end ISO" value={endTime} onChange={e=>setEndTime(e.target.value)} />
        <button type="submit">Create</button>
      </form>

      <h3>My Events</h3>
      {loading ? 'Loading...' : events.map(ev => (
        <div key={ev._id} style={{border:'1px solid #eee', padding:8, margin:6}}>
          <div><strong>{ev.title}</strong></div>
          <div>{new Date(ev.startTime).toLocaleString()} - {new Date(ev.endTime).toLocaleString()}</div>
          <div>Status: {ev.status}</div>
          <button onClick={()=>toggle(ev)}>{ev.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}</button>
        </div>
      ))}
    </div>
  );
}
