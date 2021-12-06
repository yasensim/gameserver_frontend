import dispatcher from "../AppDispatcher";
import actionTypes from "./actionTypes";
import * as GameApi from "../api/GameApi";
import * as UserApi from "../api/userApi";
import * as apiUtils from "../api/apiUtils"
import { handleResponse, handleError ,getGameServerURL } from "../api/apiUtils";

export function SetupGame(numberOfCards,invitedUsers) {
  
  return GameApi.getGameData().then((data) => {
    var game

    var usr = UserApi.GetCurrentUser()
    if(usr == null)
      return

    if(data)
      game = data.game;

    if (game) {
      var _cards = [];
      //duplicate the cards
      for (let i = 0; i < numberOfCards; i++) {
        _cards.push({ ...game.cards[i] });
        _cards.push({ ...game.cards[i] });
      }
      //reshaffle the cards
      for (let i = 0; i < _cards.length; i++) {
        const rand = Math.floor(Math.random() * _cards.length );
        const card = _cards[i];
        _cards[i] = _cards[rand];
        _cards[rand] = card;
      }
      //set the id for the cards
      for (let j = 0; j < _cards.length; j++) {
        _cards[j].id = j;
      }
      game.cards = _cards;

      
      //add score property for users
      var _players = []

      //start by adding the host of the same as a user off course 
      
      usr["id"] = 0
      usr["score"] = 0
      usr["status"] = 1
      _players.push({...UserApi.GetCurrentUser()})  
      for (let i = 0; i < invitedUsers.length; i++)
      {
        invitedUsers[i]["score"] = 0
        invitedUsers[i]["id"] = i + 1
        invitedUsers[i]["status"] = 0
        _players.push({...invitedUsers[i]})
      }
      game.players = _players
    }
    dispatcher.dispatch({
      actionType: actionTypes.CREATE_GAME,
      game,
    });
  });
}

export function UpdateGame(game) {
  dispatcher.dispatch({
    actionType:actionTypes.UPDATE_GAME,
    game,
  });
}

export function GetGameServerURL(){
  return apiUtils.getGameServerURL()
}

export function GetGameServerWebsocketURL(){
  return apiUtils.getGameServerWebsocketURL()
}

export function deleteGame(id) {
  return GameApi.deleteGame(id).then(() => {
    dispatcher.dispatch({
      actionType: actionTypes.DELETE_GAME,
      actionId: id,
    });
  });
}
export function GetGameInfo(gameId,accessToken) {
  return fetch(getGameServerURL()+ "games/gameinfo?x-access-token=" + accessToken + "&gameid="+ gameId)
    .then(handleResponse)
    .catch(handleError);
}
