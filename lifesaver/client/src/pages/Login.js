import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const inp = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '12px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdecea' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ textAlign: 'center', color: '#c0392b', marginTop: 0 }}>🆘 LifeSaver</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h2>
        {error && <p style={{ color: '#c0392b', background: '#fdecea', padding: '10px', borderRadius: '6px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={inp} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={inp} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" style={{ width: '100%', background: '#c0392b', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>Don't have an account? <Link to="/register" style={{ color: '#c0392b' }}>Sign up</Link></p>
      </div>
    </div>
  );
}
