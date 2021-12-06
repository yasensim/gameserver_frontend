
import React, { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import InvitePlayers from "../components/InvitePlayers"
import * as UserApi from "../api/userApi"
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

    
function GamePage(props) {
  
  let history = useNavigate();
  if ( UserApi.GetToken () === "")
    {
      if (props.match.params.id)
          history.push("/login/" + props.match.params.id)
      else
        history.push("/login")
    }
  const [selectedUsers, setSelectedUsers] = useState([]);
  var bInvite = true;
  if ( props.match &&  props.match.params.id )
    bInvite = false
  const [invite, setInvite] = useState({ current: bInvite });

  function handleInvitationChanged(rows) {
  var  su = []
    for (var i = 0; i < rows.length; i++) {
      su.push({ "id": rows[i].id, "name": rows[i].name, "email": rows[i].email })
    }
    setSelectedUsers(su)
  }

  useEffect(
    () => {
      console.log("mount")
      return function(){console.log("unmount")}
    } 
  );
  console.log(invite.current)
  
  function handleInvitationSent(event) {
    event.preventDefault();
    setInvite({ current: false })
   
    
  }
  return (
    <div>
       <Header sessionId={props.match ? props.match.params.id : ""}/>
       {invite.current && <InvitePlayers onInvitationSent={handleInvitationSent} onInvitationChanged={handleInvitationChanged}></InvitePlayers>}
       {invite.current == false && <GameBoard inviteUsers={selectedUsers} sessionId={props.match ? props.match.params.id : ""} />}
    </div>
  );
}
export default GamePage  