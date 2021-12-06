import { handleResponse, handleError ,getGameServerURL } from "./apiUtils";
import { NavLink } from 'react-router-dom';
const userBaseUrl = getGameServerURL();

let userAuthToken = ""
let currentUser = null

export function GetToken(){
  return userAuthToken
}
export function ResetToken(){
  userAuthToken =""
}

export function GetCurrentUser(){
  return currentUser
}

export function registerAsNewUser(data) {

     var requestOptions = {
        method: 'POST',
        body: JSON.stringify(data)
      };
      return fetch(userBaseUrl+"register", requestOptions).then(handleResponse).
          catch(handleError).then((data)=>{
            if(data.status == true)
            {
                currentUser = data["user"]
                currentUser["access-token"] = userAuthToken
                userAuthToken=data["access-token"]
            }
            return data;
          });
      
}

export function loginUser(data) {
    var requestOptions = {
        method: 'POST',
        body: JSON.stringify(data)
      };
      return fetch(userBaseUrl+"login", requestOptions).then(handleResponse).
          catch(handleError).then((data)=>{
            if(data.status == true)
            {
                currentUser = data["user"]
                currentUser["access-token"] = userAuthToken
                userAuthToken=data["access-token"]
            }
            return data;
          });
    
}

export function GetAllUsers() {
  var myHeaders = new Headers();
  myHeaders.append("x-access-token", userAuthToken);

  return fetch(userBaseUrl+"auth/user",{
    headers: myHeaders
  }).then(handleResponse).catch(handleError);
  
}

