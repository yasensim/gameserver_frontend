import React, { useState, useEffect } from "react";
import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import * as userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";


function UserLoginPage(props) {
    let history = useNavigate();
    const [register, setRegister] = useState({ isRegistering: props.register })

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    

    function cleanFields(){
        setUser({
            name: "",
            email: "",
            password: ""
        })
    }
    useEffect(() => {
        cleanFields()
        if (props.register === false) {
            setRegister({ isRegistering: false })
        }
        else {
            setRegister({ isRegistering: true })
        }
    }, [props]);

    function handleRegisterClicked(event) {
        event.preventDefault();
        setRegister({ isRegistering: true })
        cleanFields()
    }

    function handleRegisterNewUser(event) {
        event.preventDefault();
        userApi.registerAsNewUser(user).then((data) => {
            if (props.match.params.id)
          history.push("/gamepage/" + props.match.params.id)
          else
            history.push("/");
        }).catch((data)=>{ alert("couldnt register please try again later")})
    }

    function handleUserLogin(event) {
        event.preventDefault();
        userApi.loginUser(user).then((data) => {
            debugger;
            if (props.match.params.id)
            history.push("/gamepage/" + props.match.params.id)
            else
              history.push("/");
        }).catch((data)=>{ alert("couldnt login please try again later")})
    }

    function handleChange({ target }) {
        setUser({
            ...user,
            [target.name]: target.value
        });
    }
    
    if (register.isRegistering) {

        return (
            <>
                <Header sessionId={props.match ? props.match.params.id : ""}/>
                <SignUp user={user} 
                    onChange={handleChange}
                    onUserRegistered={handleRegisterNewUser}
                    onUserRegister={handleRegisterNewUser}></SignUp>
            </>
        );
    }
    else {

        return (
            <>
            <Header sessionId={props.match ? props.match.params.id : ""}/>
                <SignIn user={user} 
                    handleSignIn={handleUserLogin} 
                    onChange={handleChange} 
                    onRegisterClick={handleRegisterClicked} 
                    onUserLogin={handleUserLogin}></SignIn>
            </>
        );
    }
}
export default UserLoginPage;

