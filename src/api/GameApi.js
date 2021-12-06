import { handleResponse, handleError , getGameServerURL} from "./apiUtils";

const baseUrl =  window.frontendUrl ? (window.frontendUrl + "/game") : "/game"


export function getGameData() {
  return fetch(baseUrl).then(handleResponse).catch(handleError);
}


export function deleteGame(gameId) {
  return fetch(baseUrl + gameId, { method: "DELETE" })
    .then(handleResponse)
    .catch(handleError);
}

