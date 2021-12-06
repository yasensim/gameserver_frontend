import React from "react";
import Card from "./Card";

function CardsList(props) {
  return (
    <div>
      {props.cards.map((_card) => {
        return (
          <Card
            key={_card.id}
            card={_card}
            onClick={() => props.cardClick(_card,false)}
          />
        );
      })}
    </div>
  );
}

export default CardsList;
