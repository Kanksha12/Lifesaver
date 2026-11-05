import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function SOSHistory() {
  const { authHeader } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/sos/history', authHeader()).then(res => setHistory(res.data));
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <h2>SOS Alert History</h2>
      {history.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', marginTop: '60px' }}>No SOS alerts triggered yet.</p>
      ) : (
        history.map(s => (
          <div key={s._id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: s.status === 'active' ? '#fdecea' : '#d5f5e3', color: s.status === 'active' ? '#c0392b' : '#1e8449', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '500' }}>
                {s.status === 'active' ? 'Active' : 'Resolved'}
              </span>
              <span style={{ fontSize: '13px', color: '#999' }}>{new Date(s.createdAt).toLocaleString()}</span>
            </div>
            <p style={{ margin: '10px 0 4px', fontWeight: '500' }}>{s.message}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Location: {s.latitude.toFixed(5)}, {s.longitude.toFixed(5)}</p>
            <a href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}`} target="_blank" rel="noreferrer"
              style={{ fontSize: '13px', color: '#c0392b' }}>View on Google Maps →</a>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#666' }}>Notified: {s.notifiedContacts.join(', ')}</p>
          </div>
        ))
      )}
    </div>
  );
}
