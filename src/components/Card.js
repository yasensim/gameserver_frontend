import React from "react";

function Card(props) {
  let cardCss = "card flipped";
  if (props.card.isOpen) cardCss = "card";
  return (
    <div
      className={
        props.card.visible === true ? "container" : "container fade-out"
      }
    >
      <div className={cardCss} id="card">
        <div className="back">
          <div onClick={props.onClick} className="cleanImage">
            <img
              className="cleanImage"
              src={"/public/images/pokback.jpeg"}
              alt="Avatar"
            ></img>
          </div>
        </div>
        <div>
          <img
            src={"/public/images/" + props.card.img}
            alt="Avatar"
            className="cleanImage"
            onClick={props.onClick}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Card;
