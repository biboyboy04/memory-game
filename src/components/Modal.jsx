const Modal = ({ imageSource, buttonText, onClick }) => (
  <div className="modal">
    <div className="modal-content">
      <img className="modal-img" src={imageSource} alt="" />
      <button className="button" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </div>
);

export default Modal;
