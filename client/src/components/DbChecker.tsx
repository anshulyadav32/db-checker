import { useState } from 'react';
import axios from 'axios';

export default function DbChecker() {
  const [form, setForm] = useState({
    type: 'mysql',
    host: '',
    port: '',
    user: '',
    password: '',
    database: ''
  });
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/check-db', form);
      setResult(res.data);
    } catch (err: any) {
      setResult({ success: false, error: err.response?.data?.error || 'Connection failed' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>DB Connect Checker</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Type:</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="mysql">MySQL</option>
            <option value="postgres">PostgreSQL</option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Host:</label>
          <input
            name="host"
            value={form.host}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Port:</label>
          <input
            name="port"
            value={form.port}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>User:</label>
          <input
            name="user"
            value={form.user}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block' }}>Database:</label>
          <input
            name="database"
            value={form.database}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check Connection'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {result.success ? (
            <span style={{ color: 'green' }}>Connection successful!</span>
          ) : (
            <span style={{ color: 'red' }}>Error: {result.error}</span>
          )}
        </div>
      )}
    </div>
  );
}
