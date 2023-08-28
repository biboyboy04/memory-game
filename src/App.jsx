import React, { useEffect, useState } from "react";
import "./App.scss";
import Card from "./components/Card.jsx";
import monstersData from "./monsters.js";

function App() {
  const [monsters, setMonsters] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);

  const numberOfMonsters = 3;

  const handleLose = () => {
    alert("You lose!");
    setIsNewGame(true);
  };

  const handleWin = () => {
    alert("You win!");
    setIsNewGame(true);
  };

  const handleCardClick = (e, currentMonster) => {
    e.preventDefault();

    // set to true  to ensure that the card is isFlipped
    // because !isFlipped makes repeated clicks on the same card not flip
    setIsFlipped(true);

    if (currentMonster.clicked) {
      handleLose();
    }

    const newMonsters = monsters.map((monster) => {
      if (monster.name === currentMonster.name) {
        return { ...monster, clicked: true };
      }
      return monster;
    });
    setMonsters(newMonsters);
  };

  // Shuffle monsters and flip them back
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, 1300);
    if (!isFlipped) {
      const newMonsters = shuffleArray([...monsters]);
      setMonsters(newMonsters);
    }
    return () => clearTimeout(timer);
  }, [isFlipped]);

  /* 
    ! Added a timer to delay the randomizing of the monsters, because when the user lose/win, 
    ! the monsters will be randomized immediately and the user will see the monsters change
    ! before the animation of flippiong the cards back is finished.

    ? 1 option is to wait for the animation to finish before randomizing the monsters
  */
  useEffect(() => {
    if (isNewGame) {
      const timer = setTimeout(() => {
        const randomMonsters = [];
        const availableMonsters = [...monstersData];

        while (
          randomMonsters.length < numberOfMonsters &&
          availableMonsters.length > 0
        ) {
          const randomIndex = Math.floor(
            Math.random() * availableMonsters.length
          );
          randomMonsters.push(availableMonsters.splice(randomIndex, 1)[0]);
        }

        setMonsters(randomMonsters);
        setIsNewGame(false); // Reset isNewGame here
      }, 800); // 800 here is the anuimation o

      return () => clearTimeout(timer);
    }
  }, [isNewGame]);

  //Fisher-Yates algorithm
  // swap element starting from last to a random element
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  return (
    <div className="game">
      {/* <div className="modal">
        <div className="modal-content">
          <img src="/public/images/quest_failed.png"></img>
          <button className="button">Restart</button>
        </div>
      </div> */}
      <div className="title">Monster Matcher</div>
      <div className="card-container">
        {monsters.map((monster, index) => (
          <Card
            key={index}
            name={monster.name}
            src={`/public/images/monsters/${monster.imageUrl}`}
            flipped={isFlipped}
            handleCardClick={(e) => {
              handleCardClick(e, monster);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
