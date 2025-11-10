import { useState } from 'react';
import Request from '../lib/request';

export default function TestAPI() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Request.Get('/hello');
      setResponse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const handlePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Request.Post('/hello', { name, message });
      setResponse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>API Test</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleGet}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Test GET
        </button>
        <button
          onClick={handlePost}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Test POST
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          Error: {error}
        </div>
      )}

      {response && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginTop: '20px',
          }}
        >
          <h3>Response:</h3>
          <pre style={{ overflow: 'auto' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
