import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, authHeader } = useAuth();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const triggerSOS = () => {
    setLoading(true);
    setStatus('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setStatus('Sending alerts to your contacts...');
          const res = await axios.post('/api/sos/trigger', {
            latitude, longitude,
            message: `${user.name} needs emergency help!`
          }, authHeader());
          setTriggered(true);
          setStatus(`Alerts sent to ${res.data.notified.length} contact(s)!`);
        } catch (err) {
          setStatus(err.response?.data?.message || 'Failed to send SOS');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setStatus('Location access denied. Please enable location.');
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Emergency Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '48px' }}>Press the SOS button in an emergency. Your contacts will be alerted instantly.</p>

      <button
        onClick={triggerSOS}
        disabled={loading}
        style={{
          width: '200px', height: '200px', borderRadius: '50%',
          background: triggered ? '#27ae60' : '#c0392b',
          color: 'white', border: '8px solid',
          borderColor: triggered ? '#1e8449' : '#922b21',
          fontSize: '32px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s', boxShadow: '0 8px 32px rgba(192,57,43,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', margin: '0 auto'
        }}
      >
        <span style={{ fontSize: '48px' }}>{triggered ? '✓' : '🆘'}</span>
        <span>{loading ? 'Sending...' : triggered ? 'Sent!' : 'SOS'}</span>
      </button>

      {status && (
        <p style={{
          marginTop: '32px', padding: '12px 20px', borderRadius: '8px',
          background: triggered ? '#d5f5e3' : '#fdecea',
          color: triggered ? '#1e8449' : '#c0392b', fontWeight: '500'
        }}>
          {status}
        </p>
      )}

      {triggered && (
        <button onClick={() => { setTriggered(false); setStatus(''); }}
          style={{ marginTop: '16px', padding: '10px 24px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Reset
        </button>
      )}
    </div>
  );
}
