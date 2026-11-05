import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ background: '#c0392b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
        🆘 LifeSaver
      </Link>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/contacts" style={{ color: 'white', textDecoration: 'none' }}>Contacts</Link>
        <Link to="/history" style={{ color: 'white', textDecoration: 'none' }}>History</Link>
        <span style={{ opacity: 0.8 }}>Hi, {user?.name}</span>
        <button onClick={logout} style={{ background: 'white', color: '#c0392b', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
