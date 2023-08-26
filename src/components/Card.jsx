import { useState } from "react";
import Tilt from "react-parallax-tilt";
import ReactCardFlip from "react-card-flip";

const Card = ({ name, src }) => {
  const [flipped, setFlipped] = useState(false);
  function handleClick(e) {
    e.preventDefault();
    setFlipped(!flipped);
  }
  return (
    <Tilt>
      <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
        {/* Front Card */}
        <div
          className="card"
          onClick={handleClick}
          style={{ visibility: flipped ? "hidden" : "visible" }}
        >
          <img className="front" src={src}></img>
          <div className="title">{name}</div>
        </div>

        {/* Back Card */}
        <div className="card" onClick={handleClick}>
          <img
            src={"../../public/monsters/mh_symbol.png"}
            onClick={handleClick}
          ></img>
        </div>
      </ReactCardFlip>
    </Tilt>
  );
};

export default Card;
