import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import './index'

import Login from './App';
import NotFound from './NotFound';
import Profile from './Pages/Profile';
import Dashboard from './Dashboard';

class AutoNotFound extends React.Component {
    render() {
        return (<Redirect to="/404-it-looks-like-tu-t-es-perdu" />)
    }
}

class AutoDashboard extends React.Component {
    render() {
        return (<Redirect to="/dashboard"/>)
    }
}

export default class Navigation extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={AutoDashboard} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/login" component={Login}/>
                    <Route path="/404-it-looks-like-tu-t-es-perdu" component={NotFound}></Route>
                    <Route component={AutoNotFound} />
                </Switch>
            </Router>
        )
    }
}
