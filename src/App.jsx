import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faVolumeHigh,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";

import bgMusic from "../public/audios/MH_bg_music.mp3";
import monsterFoundSfx from "../public/audios/monster_click_found.mp3";
import monsterAlreadyFoundSfx from "../public/audios/monster_click_already_found.mp3";
import menuClick from "../public/audios/menu_click.mp3";

import "./App.scss";
import CardContainer from "./components/CardContainer.jsx";
import monstersData from "./monsters.js";
import Modal from "./components/Modal.jsx";

function App() {
  const [monsters, setMonsters] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [isBgMusicOn, setIsBgMusicOn] = useState(false);
  const numberOfMonsters = 12; // also the max score

  const menuClickAudio = new Audio(menuClick);
  menuClickAudio.volume = 0.2;

  useEffect(() => {
    const bgAudio = new Audio(bgMusic);
    bgAudio.loop = true;

    bgAudio.volume = 0.1;

    if (isBgMusicOn) {
      bgAudio.play();
    } else {
      bgAudio.pause();
    }

    return () => {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
  }, [isBgMusicOn]);

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
      setIsNewGame(false);
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

    const sfx = currentMonster.clicked
      ? monsterAlreadyFoundSfx
      : monsterFoundSfx;
    const sfxAudio = new Audio(sfx);
    sfxAudio.volume = 0.2;
    sfxAudio.play();

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
    menuClickAudio.play();
  };

  return (
    <div className="game">
      <div className="top-content">
        <div className="title">Monster Matcher</div>

        <div className="scores">
          <div className="score">
            <img src="/public/images/MHRise_Item_Icon-Head_Red.png"></img>
            <div className="score-number"> High Score: {highScore}</div>
          </div>
          <div className="score">
            <img src="/public/images/MHRise_Item_Icon-Head_White.png"></img>
            <div className="score-number">Score: {score}</div>
          </div>
        </div>
      </div>

      <CardContainer
        monsters={monsters}
        isFlipped={isFlipped}
        handleCardClick={handleCardClick}
      />

      <div className="bottom-content">
        <button
          className="music-button"
          onClick={() => {
            menuClickAudio.play();
            setIsBgMusicOn(!isBgMusicOn);
          }}
        >
          <div className="icon-container">
            <FontAwesomeIcon
              icon={isBgMusicOn ? faVolumeHigh : faVolumeOff}
              style={{ color: "white" }}
            />
          </div>
        </button>

        <button
          className="restart-button"
          onClick={() => {
            menuClickAudio.play();
            setIsNewGame(true);
          }}
        >
          <div className="icon-container">
            <FontAwesomeIcon icon={faRotate} style={{ color: "white" }} />
          </div>
        </button>
      </div>

      {/* Modals */}
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
    </div>
  );
}

export default App;
