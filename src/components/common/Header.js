import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useNavigate } from "react-router-dom";
import * as UserApi from "../../api/userApi";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = props => {
  let history = useNavigate();
  const classes = useStyles();

  function handleLoginClick(event) {
    if (props.sessionId)
      history.push("/login/" + props.sessionId)
    else
      history.push("/login")

  }

  const handleMobileMenuOpen = (event) => {
    const newLocal = 'clicked';

    console.log(newLocal);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={handleMobileMenuOpen} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {UserApi.GetCurrentUser() ? UserApi.GetCurrentUser().name : "Welcome"}
          </Typography>

          <Button color="inherit" onClick={handleLoginClick}> {!UserApi.GetToken() ? "Login" : "Logout"}</Button>

        </Toolbar>
      </AppBar>

    </div>
  );

}
export default Header;