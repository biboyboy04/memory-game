import React, { useEffect, useState } from "react";
import "./App.scss";
import Card from "./components/Card.jsx";
import monstersData from "./monsters.js";
import Modal from "./components/Modal.jsx";

function App() {
  const [monsters, setMonsters] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const numberOfMonsters = 3; // also the max score

  // Restoring the high score from local storage when the component mounts
  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore));
    }
  }, []);

  // Shuffle monsters and flip them back
  useEffect(() => {
    if (gameStatus === "playing") {
      const timer = setTimeout(
        () => {
          setIsFlipped(false);
        },
        isNewGame ? 0 : 1300
      ); // No delay if isNewGame is true
      // Only shuffle when the cards are flipped and not on restart
      if (!isFlipped && !isNewGame) {
        const newMonsters = shuffleArray([...monsters]);
        setMonsters(newMonsters);
      }
      return () => clearTimeout(timer);
    }
  }, [isFlipped, gameStatus]);

  useEffect(() => {
    // Placed here so that theres no delay
    setScore(0);

    const randomMonsters = [];
    const availableMonsters = [...monstersData];

    while (
      randomMonsters.length < numberOfMonsters &&
      availableMonsters.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availableMonsters.length);
      randomMonsters.push(availableMonsters.splice(randomIndex, 1)[0]);
    }

    setMonsters(randomMonsters);
    setGameStatus("playing");
    setIsNewGame(false);
  }, [isNewGame]);

  const handleLose = () => {
    alert("You lose!");
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
    setGameStatus("lose");
  };

  const handleWin = () => {
    alert("You win!");
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
    setGameStatus("win");
  };

  const handleCardClick = (e, currentMonster) => {
    e.preventDefault();

    // set to true  to ensure that the card is isFlipped
    // because !isFlipped makes repeated clicks on the same card not flip
    setIsFlipped(true);

    if (currentMonster.clicked) {
      handleLose();
    } else {
      setScore((score) => score + 1);
    }

    if (score === numberOfMonsters - 1) {
      handleWin();
    }

    const newMonsters = monsters.map((monster) => {
      if (monster.name === currentMonster.name) {
        return { ...monster, clicked: true };
      }
      return monster;
    });
    setMonsters(newMonsters);
  };

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
      {gameStatus === "lose" && (
        <Modal
          imageSource="/public/images/quest_failed.png"
          buttonText="Play again"
          onClick={() => {
            setIsNewGame(true);
            setGameStatus("playing");
          }}
        />
      )}
      {gameStatus === "win" && (
        <Modal
          imageSource="/public/images/quest_complete.png"
          buttonText="Play again"
          onClick={() => {
            setIsNewGame(true);
            setGameStatus("playing");
          }}
        />
      )}
      <div className="title">Monster Matcher</div>
      <div className="score">
        <div className="score-title">Score</div>
        <div className="score-number">{score}</div>
      </div>
      <div className="high-score">
        <div className="high-score-title">High Score</div>
        <div className="high-score-number">{highScore}</div>
      </div>
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
