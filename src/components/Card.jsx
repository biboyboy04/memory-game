const Card = ({ name, src }) => {
  return (
    <div className="card">
      <img src={src}></img>
      <div className="title">{name}</div>
    </div>
  );
};

export default Card;
