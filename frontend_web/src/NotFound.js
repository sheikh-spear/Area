import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'

const classes = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: theme.spacing(3, 0, 2),
    },
    avatar: {
      margin: theme.spacing(1),
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

export default class NotFound extends React.Component {
    render() {
        return (
            <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <header>
                    <p className="App-title" title="Notfound">404 - Not Found</p>
                </header>
                <content>
                <Link to="/">
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Get Back To HomePage
          </Button>
                </Link>
                </content>
            </div>
            </Container>
        )
    }
}