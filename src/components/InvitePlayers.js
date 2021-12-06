import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import * as UserApi from "../api/userApi";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'box',
        alignItems: 'left',


    },
    avatar: {
        margin: theme.spacing(5),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    card: {
        margin: '5px',
        width: '300px'
    }
}));

export default function InvitePlayers(props) {
    const classes = useStyles();


    const [users, setUsers] = useState([]);

    useEffect(
        () => {
            UserApi.GetAllUsers().then((data) => {
                //filter out the currentuser    
                var currUser = UserApi.GetCurrentUser()
                const result = data.filter(user => user.email != currUser.email);
                setUsers(result)
            
            })
        },
        users
    );


    return (
        <Container component="main" maxWidth="sm" >
            <div style={{ justifyContent: "center", alignItems: "center", display: "flex", marginTop: "50px" }}>
                <h2>Choose players </h2>
            </div>
            <MaterialTable style={{ marginTop: "50px" }} onSelectionChange={props.onInvitationChanged}
                title="Select Players"
                columns={[
                    { title: 'ID', field: 'id' },
                    { title: 'Name', field: 'name' },
                    { title: 'Email', field: 'email' }]}
                data={users}
                options={{
                    selection: true
                }}
            />
            <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                <Button type="submit" onClick={props.onInvitationSent} variant="contained" color="primary" className={classes.submit} width="100px">Send Invitation</Button>
            </div>
        </Container>

    );
}