import Card from "./Card.jsx";

const CardContainer = ({ monsters, isFlipped, handleCardClick }) => {
  return (
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
  );
};

export default CardContainer;
