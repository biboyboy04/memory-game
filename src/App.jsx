import React from "react";
import { useEffect } from "react";
import "./App.scss";
import Card from "./components/Card.jsx";
import monsters from "./monsters.js";

function App() {
  return (
    <>
      <div className="card-container">
        {monsters.map((monster) => {
          return (
            <Card
              key={monster.name}
              name={monster.name}
              src={"../../public/monsters/" + monster.imageUrl}
            />
          );
        })}
      </div>
    </>
  );
}
export default App;
