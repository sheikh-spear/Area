import React from 'react'
import Menu from '../AppBar'
import CssBaseline from "@material-ui/core/CssBaseline";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch("http://127.0.0.1:8080/api/profile")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return (
                <div>
                    <CssBaseline/>
                    <div>
                        <Menu />
                    </div>
                    <text>
                        Your email is Unknown !
                </text>
                </div>

            )
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <CssBaseline/>
                    <div>
                        <Menu />
                    </div>
                    <text>
                        Your email is {items.email} !
                    </text>
                </div>
            );
        }
    }
}