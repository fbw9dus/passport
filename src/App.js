import React from 'react';

function App() {
  return (
    <div className="App">
      <a href="http://localhost:3001/auth/github">
        Login mit GitHub
      </a>

      <a href="http://localhost:3001/auth/local/callback?username=anx&password=passwort1">
        Login mit Local
      </a>
    </div>
  );
}

export default App;
