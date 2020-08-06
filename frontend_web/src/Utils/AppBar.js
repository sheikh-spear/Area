import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import history from '../history'

const useStyles = makeStyles(theme => ({
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

class Profile extends React.Component {
    handleProfile(event) {
        history.push('/profile')
        window.location.reload();
    }
    render() {
        return (
            <IconButton edge="start"color="inherit" aria-label="menu"
          onClick={this.handleProfile}>
            <AccountCircle />
          </IconButton>
        );
    }
}

class Logout extends React.Component {
    handleProfile(event) {
        localStorage.setItem("auth_token", "");
        localStorage.setItem("outlook_auth", "");
        history.push('/')
        window.location.reload();
    }
    render() {
        return (
        <IconButton edge="start"color="inherit" aria-label="menu"
          onClick={this.handleProfile}>
            <ExitToAppIcon />
          </IconButton>
        );
    }
}

export default function MenuAppBar() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <AppBar position="absolute">
        <Toolbar>
          <Logout/>
          <Typography variant="h6" className={classes.title}>
            Area
          </Typography>
            <div>
                <Profile/>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
