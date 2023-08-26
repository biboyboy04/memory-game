import React from "react";
import { useEffect } from "react";
import "./App.scss";
import Card from "./components/Card.jsx";
import monsters from "./monsters.json";
function App() {
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
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
