import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DbFormData {
  type: 'mysql' | 'postgres';
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
}

export default function DbChecker() {
  const [form, setForm] = useState<DbFormData>({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post<ApiResponse>(`${API_URL}/api/check-db`, form, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      setResult(res.data);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string; code?: string };
        const errorMessage = axiosError.response?.data?.error || axiosError.message;
        setResult({
          success: false,
          error: axiosError.code === 'ECONNABORTED'
            ? 'Connection timed out. Please try again.'
            : errorMessage || 'Connection failed'
        });
      } else {
        console.error('Unexpected error:', error);
        setResult({ success: false, error: 'An unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
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
