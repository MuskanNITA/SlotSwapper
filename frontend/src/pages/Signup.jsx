import React, { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const { setUser, setToken } = useContext(AuthContext);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', { name, email, password });
      setToken(data.token); setUser(data.user);
      nav('/');
    } catch(err) { alert(err.response?.data?.error || 'Signup failed'); }
  }

  return (
    <div style={{maxWidth:480, margin:'0 auto'}}>
      <h2>Sign up</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Sign up</button>
      </form>
      <p>Already have account? <Link to="/login">Login</Link></p>
    </div>
  );
}
