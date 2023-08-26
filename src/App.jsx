import React, { useEffect, useState } from "react";
import "./App.scss";
import Card from "./components/Card.jsx";
import monstersData from "./monsters.js";

function App() {
  const [monsters, setMonsters] = useState([]);
  const numberOfMonsters = 3; // Set the desired number of monsters

  useEffect(() => {
    const randomMonsters = [];
    const availableMonsters = [...monstersData]; // Create a copy of monstersData

    while (
      randomMonsters.length < numberOfMonsters &&
      availableMonsters.length > 0
    ) {
      // Get a random index from availableMonsters
      const randomIndex = Math.floor(Math.random() * availableMonsters.length);

      // Remove the monster at the random index from availableMonsters
      //and add it to randomMonsters
      randomMonsters.push(availableMonsters.splice(randomIndex, 1)[0]);
    }

    setMonsters(randomMonsters);
  }, [numberOfMonsters]);

  return (
    <div className="card-container">
      {monsters.map((monster) => (
        <Card
          key={monster.name}
          name={monster.name}
          src={`/monsters/${monster.imageUrl}`}
        />
      ))}
    </div>
  );
}

export default App;
