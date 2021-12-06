import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function PlayerPanel(props) {
  let headerColor = "card-header bg-primary";
  let blinkText = "";
  if (props.currentPlayerId === props.player.id) {
    headerColor = "card-header bg-warning ";
    blinkText = "blink_me";
  }

  return (
    <div className="panel" style={{ padding: "20px", margin: "20px" }}>
      <div
        className={headerColor}
        style={{
          textAlign: "center",
          height: "30px",
          verticalAlign: "center",
          padding: "5px",
          color: "white",
        }}
      >
        <label className={blinkText}>{props.player.name}</label>
      </div>
      <div
        className="card-body bg-info"
        style={{
          height: "90px",
          verticalAlign: "top",

          color: "white",
        }}
      >
        <img
          src="/public/images/pokcards.jpg"
          width="50px"
          height="50px"
          style={{ marginRight: "10px", verticalAlign: "top" }}
        ></img>
        <label style={{ fontSize: "40px", textAlign: "center" }}>
          {props.player.score}
        </label>
      </div>
    </div>
  );
}

export default PlayerPanel;
