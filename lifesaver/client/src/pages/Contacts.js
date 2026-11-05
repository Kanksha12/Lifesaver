import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Contacts() {
  const { authHeader } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', relation: '' });
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await axios.get('/api/contacts', authHeader());
    setContacts(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contacts', form, authHeader());
      setForm({ name: '', phone: '', email: '', relation: '' });
      setMessage('Contact added!');
      load();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding contact');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    await axios.delete(`/api/contacts/${id}`, authHeader());
    load();
  };

  const inp = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '100%' };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <h2>Emergency Contacts</h2>

      <form onSubmit={handleAdd} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>Add New Contact</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <input style={inp} placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={inp} placeholder="Phone Number *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <input style={inp} placeholder="Email (optional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input style={inp} placeholder="Relation (e.g. Mom)" value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })} />
        </div>
        {message && <p style={{ color: '#27ae60', margin: '0 0 12px' }}>{message}</p>}
        <button type="submit" style={{ background: '#c0392b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Contact
        </button>
      </form>

      <div>
        {contacts.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>No contacts yet. Add your emergency contacts above.</p>
        ) : (
          contacts.map(c => (
            <div key={c._id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#c0392b' }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{c.relation || 'Contact'} • {c.phone}</p>
                    {c.email && <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{c.email}</p>}
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(c._id)} style={{ background: '#fdecea', color: '#c0392b', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
