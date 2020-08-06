import React from 'react';
import Typography from '@material-ui/core/Typography';

export default class Loading extends React.Component {
    state = {
        dot: 0
    };
    render() {
        if (this.state.dot === 0) {
            this.setState({
                dot: this.state.dot + 1
            })
            return (
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Loading
            </Typography>
            );
        } if (this.state.dot === 1) {
            this.setState({
                dot: this.state.dot + 1
            })
            return (
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Loading.
            </Typography>
            );
        } if (this.state.dot === 2) {
            this.setState({
                dot: this.state.dot + 1
            })
            return (
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Loading..
            </Typography>
            );
        }
        if (this.state.dot === 3) {
            this.setState({
                dot: 0
            })
            return (
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Loading...
            </Typography>
            );
        }
    }
}

