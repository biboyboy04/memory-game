import { useState } from "react";
import Tilt from "react-parallax-tilt";
import ReactCardFlip from "react-card-flip";

const Card = ({ name, src, flipped, handleCardClick }) => {
  return (
    <Tilt>
      <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
        {/* Front Card */}
        <div
          className="card"
          onClick={handleCardClick}
          style={{ visibility: flipped ? "hidden" : "visible" }}
        >
          <img className="front" src={src}></img>
          <div className="title">{name}</div>
        </div>

        {/* Back Card */}
        <div className="card" onClick={handleCardClick}>
          <img
            src={"../../public/monsters/mh_symbol.png"}
            onClick={handleCardClick}
          ></img>
        </div>
      </ReactCardFlip>
    </Tilt>
  );
};

export default Card;
