import React, { Component } from 'react';
import Logo from './logo.png';
import './Profil.css';

export default class Profil extends Component {
    render() {
        return (
            <div className="Profil">
                <img src={Logo} />
                <h4>Hello !</h4>
                <br/>
                <h4>Welcome on your Profil page. You're logged in and you can access at all the widgets of your choice.</h4>
                <br/>
                <h4>Check what you want.</h4>
            </div>
        );
    }
}