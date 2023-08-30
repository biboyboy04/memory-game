import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
  }, [gameStatus]);

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
    if (isNewGame) {
      setScore(0);
      setGameStatus("playing");
      const randomMonsters = getRandomMonsters();
      setMonsters(randomMonsters);
    }
  }, [isNewGame]);

  const getRandomMonsters = () => {
    const availableMonsters = [...monstersData];
    const randomMonsters = [];

    while (
      randomMonsters.length < numberOfMonsters &&
      availableMonsters.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availableMonsters.length);
      randomMonsters.push(availableMonsters.splice(randomIndex, 1)[0]);
    }

    return randomMonsters;
  };

  const handleCardClick = (e, currentMonster) => {
    e.preventDefault();

    // set to true to ensure that the card is isFlipped
    // because !isFlipped makes repeated clicks on the same card not flip
    setIsFlipped(true);

    if (currentMonster.clicked) {
      setGameStatus("lose");
    } else {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore === numberOfMonsters) {
        setGameStatus("win");
      }
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

  const handleRestart = () => {
    setIsNewGame(true);
    setGameStatus("playing");
  };

  return (
    <div className="game">
      {gameStatus === "lose" && (
        <Modal
          imageSource="/public/images/quest_failed.png"
          buttonText="Play again"
          onClick={handleRestart}
        />
      )}
      {gameStatus === "win" && (
        <Modal
          imageSource="/public/images/quest_complete.png"
          buttonText="Play again"
          onClick={handleRestart}
        />
      )}
      <div className="top-content">
        <div className="title">Monster Matcher</div>
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
      <div className="bottom-content">
        <div className="scores">
          <div className="score">
            <img src="/public/images/MHRise_Item_Icon-Head_Red.png"></img>
            <div className="score-number">{highScore}</div>
            High Score
          </div>
          <div className="score">
            <img src="/public/images/MHRise_Item_Icon-Head_White.png"></img>
            <div className="score-number">{score}</div>
            Score
          </div>
        </div>
        <div className="restart">
          <button
            className="restart-button"
            onClick={() => {
              setIsNewGame(true);
            }}
          >
            <FontAwesomeIcon
              icon={faRotate}
              size="2xl"
              style={{ color: "#f3a300" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
