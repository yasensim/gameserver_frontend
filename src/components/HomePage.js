import React from "react";
import { useNavigate } from "react-router-dom";
import * as UserApi from "../api/userApi";
import Button from '@material-ui/core/Button';
import Header from "../components/common/Header";
import * as GameActions from "../actions/gameActions"

function HomePage() {
  
  let history = useNavigate();

  if ( UserApi.GetToken () === "")
    {
        history.push("/login")
    }

  function handleStartGame(event){
      event.preventDefault();
      GameActions.GetGameInfo("pokemoncards", UserApi.GetToken ()).
      then(()=>{ history.push("/gamepage") }).
      catch((data)=>{alert(data.message)})

     
  }

  return (
    <>
    <Header/>
    <div  style={{ justifyContent: "center", alignItems: "center", display: "flex" ,marginTop:"50px"}}>
    <h2>Welcome to Pokemon Memory Game</h2>  
    </div>
    <div  style={{ justifyContent: "center", alignItems: "center", display: "flex" ,marginTop:"30px"}}>
    <img src="/public/images/pica.png" width="400px" height="400px"></img>
    </div>
    <div style={{ justifyContent: "center", alignItems: "center", display: "flex" ,marginTop:"50px"}}>
      
        <Button  size="large" type="submit" onClick={handleStartGame} variant="contained" color="primary" width="800px" height="200px">Start game</Button>
    </div>

</>
  );
}

export default HomePage;
