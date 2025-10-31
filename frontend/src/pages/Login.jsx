import React, { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const { setUser, setToken } = useContext(AuthContext);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setToken(data.token); setUser(data.user);
      nav('/');
    } catch(err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div style={{maxWidth:480, margin:'0 auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>Don't have account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
