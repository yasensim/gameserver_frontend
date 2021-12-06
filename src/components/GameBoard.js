import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import CardsList from "./CardsList.js";
import GameStore from "../stores/GameStore";
import PlayersList from "./PlayersList";
import * as GameActions from "../actions/gameActions";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useNavigate } from "react-router-dom"
import * as UserApi from "../api/userApi"
import * as GameSocket from "../components/GameSocket"
import Websocket from 'react-websocket';
import { array } from "prop-types";

let currentOpenCard = null;
let status = 0;
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerContainer: {
    overflow: "auto"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

function GameBoard(props) {

  let history = useNavigate();
  let refWebSocket

  const [invitedUsersStatus, setUsersOnline] = useState({ isOnline: false })
  const [session, setSessionId] = useState({ id: props.sessionId });
  const [board, setBoard] = useState(GameStore.getGame());

  const classes = useStyles();

  useEffect(
    () => {
      GameStore.addChangeListener(onChange);
      //if (GameStore.getGame().cards.length === 0) GameActions.SetupGame(2, props.inviteUsers);
      return () => GameStore.removeChangeListener(onChange); // cleanup on unmount
    },
    board,
    session,
    invitedUsersStatus,
    currentOpenCard
  );

  function onChange() {
    const theGame = GameStore.getGame();
    console.log("onchange called")
    console.log({ theGame })
    if (!session.id) {
      setBoard(theGame);
    }
  }



  function updateBoardGame(board) {
    setBoard(board);
    currentOpenCard = null;
    status = 0;
  }

  function changeTurn(updatedBoard) {
    if (updatedBoard.currentPlayer + 1 === updatedBoard.players.length)
      updatedBoard.currentPlayer = 0;
    else updatedBoard.currentPlayer = updatedBoard.currentPlayer + 1;
  }


  function handleCardClicked(card, fromOther) {

    if (invitedUsersStatus.isOnline == false)
      return
    //check if this is the player turn 
    var usr = UserApi.GetCurrentUser()
    if (usr.email != board.players[board.currentPlayer].email &&
      (fromOther == false))
      return

    if (card.isOpen || status === 1) {
      return;
    }

    //send the click to the other users
    if (refWebSocket && fromOther == false) {
      var str = JSON.stringify(card);
      var objToSend = { action: GameSocket.GameMsg.GAME_PLAY, data: str }
      var data = JSON.stringify(objToSend);
      refWebSocket.sendMessage(data)
    }
    let updatedBoard = { ...board };
    //if there is an open card already
    if (currentOpenCard) {
      if (currentOpenCard.name === card.name) {
        updatedBoard.cards[card.id].isOpen = true;
        setBoard(updatedBoard);

        status = 1;
        let updatedBoard2 = JSON.parse(JSON.stringify(updatedBoard));
        updatedBoard2.cards[currentOpenCard.id].isOpen = false;
        updatedBoard2.cards[card.id].isOpen = false;
        setTimeout(updateBoardGame, 3000, { ...updatedBoard2 });

        updatedBoard2 = JSON.parse(JSON.stringify(updatedBoard2));
        updatedBoard2.cards[currentOpenCard.id].visible = false;
        updatedBoard2.cards[card.id].visible = false;

        status = 1;
        updatedBoard2.players[updatedBoard2.currentPlayer].score += 1;
        setTimeout(updateBoardGame, 3000, { ...updatedBoard2 });

        setTimeout(checkGameOver, 3500, { ...updatedBoard2 });

        updateServerWithState(updatedBoard2)


      } else {
        updatedBoard.cards[card.id].isOpen = true;
        setBoard(updatedBoard);

        let updatedBoard2 = JSON.parse(JSON.stringify(updatedBoard));
        updatedBoard2.cards[currentOpenCard.id].isOpen = false;
        updatedBoard2.cards[card.id].isOpen = false;
        status = 1;
        //change turn
        changeTurn(updatedBoard2);
        setTimeout(updateBoardGame, 3000, { ...updatedBoard2 });
        updateServerWithState(updatedBoard2)
      }
    } else {
      currentOpenCard = { ...card };
      updatedBoard.cards[card.id].isOpen = true;
      status = 0;
      setBoard(updatedBoard);
      updateServerWithState(updatedBoard)
    }
  }

  function updateServerWithState(updatedBoard2){
      //send update state to the server
      var str = JSON.stringify({game:updatedBoard2,status:status,opencard:currentOpenCard});
      var objToSend = { action: GameSocket.GameMsg.UPDATE_GAME_STATE, data: str }
      var data = JSON.stringify(objToSend);
      refWebSocket.sendMessage(data)
  }
  //this function will be bounded to a component that will present the winner
  function checkForWinner(gameboard) {
    //filter
    let isGameOver = true;
    for (let i = 0; i < gameboard.cards.length; i++) {
      if (gameboard.cards[i].visible == true) {
        isGameOver = false;
        break;
      }
    }
    return isGameOver;
  }

  function checkGameOver(gameboard) {

    if (checkForWinner(gameboard) == true) {

      var maxScore = 0
      var winplayer = null
      gameboard.players.forEach(function (player) {
        if (player.score > maxScore) {
          maxScore = player.score;
          winplayer = player;
        }
      });
      clearBoard();
      alert(winplayer.name + " " + "wins !")
      history.push("/")

    }
  }
  function clearBoard() {
    board.cards.length = 0
    GameActions.UpdateGame(board)
  }
  function handleLogoutClick(event) {

    clearBoard();
    setSessionId({ id: "" })
    history.push("/login")

    UserApi.ResetToken()
  }

  function getCurrentPlayerId() {
    if (board.players.length > 0) {
      return board.players[board.currentPlayer].id;
    }
    return 0;
  }

  function GetUrlForWebSocket() {

    var stringToken = "?x-access-token=" + UserApi.GetToken()
    var stringTokenAndGameId = "?gameid=pokemoncards&x-access-token=" + UserApi.GetToken()
    var ws = ""
    const baseUrl = GameActions.GetGameServerWebsocketURL() + "games/";
    if (!session.id)
      ws = baseUrl + "startnewgame" + stringTokenAndGameId
    else
      ws = baseUrl + "joingame/" + session.id + stringToken

    return ws
  }

  function handleData(evt) {

    const msg = JSON.parse(evt)
    const gameMsg = JSON.parse(msg.data)

    switch (msg.action) {
      case GameSocket.GameMsg.ON_GAME_SESSION_CREATED:
        //compare with the email the user loged in with
        var webSock = refWebSocket
        try {
          if (GameStore.getGame().cards.length === 0)
            GameActions.SetupGame(window.cards ? window.cards : 2, props.inviteUsers).then(function () {
              console.log("ON_GAME_SESSION_CREATED called")

              var str = JSON.stringify({ players: props.inviteUsers, gamedata: JSON.stringify({game:GameStore.getGame(),status:status,opencard:currentOpenCard}) });
              var objToSend = { action: GameSocket.GameMsg.START_GAME, data: str }
              var data = JSON.stringify(objToSend);
              webSock.sendMessage(data)

              setSessionId({ id: gameMsg.id })
            });

          //send data to the server
        } catch (error) {
          console.log(error) // catch error
        }
        break;
      case GameSocket.GameMsg.GAME_PLAY:
        handleCardClicked(gameMsg, true)
        break;
      case GameSocket.GameMsg.ON_GAME_INIT:
        updateUserStatus(gameMsg.game, true)
        setUsersOnline({ isOnline: checkIfCanStartGame() })
        currentOpenCard = gameMsg.opencard
        setBoard(gameMsg.game)
        var usr = UserApi.GetCurrentUser()
        if (usr.email != board.players[board.currentPlayer].email)
          status = 0
        else
          status = gameMsg.status
        break
      case GameSocket.GameMsg.ON_USER_CONNECTED:
        updateUserStatus(gameMsg, true)
        setUsersOnline({ isOnline: checkIfCanStartGame() })
        break;
      case GameSocket.GameMsg.ON_USER_DISCONNECTED:
        updateUserStatus(gameMsg, false)
        pauseGame()
        break;
      case GameSocket.GameMsg.ON_GAME_OVER:
        clearBoard();
        alert(gameMsg.message)
        history.push("/")
        break;
      default:
        break;
    }
  }
  function updateUserStatus(user, userStatus) {
    for (var i = 0; i < board.players.length; i++) {
      if (board.players[i].email == user.email) {
        board.players[i].status = userStatus
        return
      }
    }
  }
  function pauseGame() {
    setUsersOnline({ isOnline: false })
  }

  function checkIfCanStartGame(users) {
    for (var i = 0; i < board.players.length; i++) {
      if (board.players[i].status == 0)
        return false
    }
    return true
  }
  try {

    return (
      <div >
        <div className="row" style={{ align: "left" }}>
          <div className="col-2 " style={{ padding: "0px" }}>
            <AppBar className={classes.appBar} position="fixed">
              <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>

                <Typography style={{ display: "table", align: "right", width: "100%", marginRight: 0, position: "relative" }}>
                  {UserApi.GetCurrentUser() ? UserApi.GetCurrentUser().name : "Welcome"}
                </Typography>

                <Typography style={{ justifyContent: "center", alignItems: "center", display: "table", width: "100%" }}>
                  Game ID: {session.id}
                </Typography>


                <div style={{ display: "table", align: "right", width: "100%", marginRight: 0, position: "relative" }}>
                  <Button color="inherit" style={{ verticalAlign: "center", position: "relative", float: "right", marginLeft: 40, display: "table", align: "right" }} onClick={handleLogoutClick}>  {!UserApi.GetToken() ? "Login" : "Logout"}</Button>
                </div>

              </Toolbar>
            </AppBar>

            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper
              }}
            >
              <Toolbar />
              <div className={classes.drawerContainer}>
                <PlayersList
                  players={board.players}
                  currentPlayerId={getCurrentPlayerId()}
                />
              </div>
            </Drawer>

          </div>

          <div className="col-9" style={{ padding: "0px", marginTop: "10px" }}>
            <div style={{ display: "table", align: "right", width: "100%", marginTop: "10px", marginBottom: "0", position: "relative", textAlign: "center" }}>
              <h2>
                {invitedUsersStatus.isOnline ? "Game Started !" : "Waiting for users to connect..."}
              </h2>
            </div>
            <Toolbar />
            <CardsList cards={board.cards} cardClick={handleCardClicked} />
          </div>
        </div>
        <Websocket url={GetUrlForWebSocket()} onMessage={handleData}
          reconnect={true} debug={true}
          ref={Websocket => { refWebSocket = Websocket }} />
      </div>
    );
  } catch (e) {
    alert("game id is not supported")
  }
}

export default GameBoard;
