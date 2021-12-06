import React from "react";
import PlayerPanel from "./PlayerPanel";

function PlayersList(props) {
  return (
    <>
      {props.players.map((player) => {
        return (
          <div key={player.id} style={{ textAlign: "left" }}>
            <div className="panel-group">
              <PlayerPanel
                player={player}
                currentPlayerId={props.currentPlayerId}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default PlayersList;
