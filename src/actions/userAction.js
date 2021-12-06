import dispatcher from "../AppDispatcher";
import actionTypes from "./actionTypes";
import * as userApi from "../api/userApi";


export function registerNewUser(user) {
    return userApi.registerAsNewUser().then((data) => {
        dispatcher.dispatch({
            actionType: actionTypes.REGISTER_NEW_USER,
            user,
          });
    })
}

export function loginuser(user) {
    return userApi.loginuser().then((data) => {
        dispatcher.dispatch({
            actionType: actionTypes.LOGIN_USER,
            user,
          });
    })
}