import React, { useEffect, useContext } from "react";
// import './App.css';
import Home from "./components/home";
import { UserContext } from "./context";

function App() {
  
  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
