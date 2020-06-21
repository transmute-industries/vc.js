import React from 'react';
import { testLd } from './test-ld'
import { testJwt } from './test-jwt'
function App() {
  return (
    <div className="App">
      <h4>See Developer Console...</h4>
     <button onClick={testLd}>Test Linked Data Proof</button>
     <br/>
     <br/>
     <button onClick={testJwt}>Test JSON Web Token</button>
    </div>
  );
}

export default App;
