import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // DB credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('');
  
  // Connection and query states
  const [connected, setConnected] = useState(false);
  const [dbSummary, setDbSummary] = useState(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState(null);

  // Handle DB connect and fetch summary
  const handleConnect = async () => {
    setConnectLoading(true);
    setConnectError(null);
    setDbSummary(null);
    setConnected(false);
    try {
      const res = await axios.post('http://localhost:5000/connect', {
        username,
        password,
        database,
      });
      setDbSummary(res.data);
      setConnected(true);
    } catch (err) {
      setConnectError(err.response?.data?.error || 'Failed to connect');
    }
    setConnectLoading(false);
  };

  // Handle NL query send
  const handleAsk = async () => {
    const riskyCommands = ['DROP', 'DELETE', 'ALTER', 'TRUNCATE', 'CREATE'];
    const isRiskyQuery = riskyCommands.some(cmd =>
      query.toUpperCase().includes(cmd)
    );

    if (isRiskyQuery) {
      const confirmed = window.confirm(
        "Warning: This query may modify or delete data.\nAre you sure you want to continue?"
      );
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/query', {
        username,
        password,
        database,
        query,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({ error: 'Error talking to backend' });
    }
    setLoading(false);
  };

  return (
    <div className="App" style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h1>Talk to Your Database</h1>

      {!connected && (
        <div style={{ marginBottom: 20 }}>
          <h3>Connect to your database</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="Database name"
            value={database}
            onChange={e => setDatabase(e.target.value)}
          />
          <button onClick={handleConnect} disabled={connectLoading || !username || !database} style={{ marginLeft: 10 }}>
            {connectLoading ? 'Connecting...' : 'Connect'}
          </button>
          {connectError && (
            <p style={{ color: 'red', marginTop: 10 }}>{connectError}</p>
          )}
        </div>
      )}

      {connected && dbSummary && (
  <div style={{ marginBottom: 20 }}>
    <h3>Database Summary</h3>
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>Table Name</th>
          <th>Columns</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(dbSummary).map(([table, columns]) => (
          <tr key={table}>
            <td><b>{table}</b></td>
            <td>{columns.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <hr />
  </div>
)}


      {connected && (
        <>
          <input
            type="text"
            placeholder="Ask something like: Show all students in CSE"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={handleAsk} disabled={loading || !query}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </>
      )}

      {response && (
        <div className="result" style={{ marginTop: 20 }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
