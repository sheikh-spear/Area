import React from "react"
import { TextField, Button } from "@material-ui/core";
import '../../Utils/global'

export default class WidgetTinderPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            refresh: false,
            txt: "",
            data: undefined
        };
        this.openTinder = this.openTinder.bind(this);
        this.refreshMe = this.refreshMe.bind(this);
        this.saveTxt = this.saveTxt.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    openTinder(e) {
        this.setState({ modalVisible: e });
    }

    refreshMe() {
        this.setState({ refresh: true });
        this.props.refresh(true);
        this.setState({ txt: "" });
    }

    saveTxt(data) {
        this.setState({ txt: data });
    }

    sendMessage() {
        fetch(`http://127.0.0.1:8080/api/tinder-message`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + localStorage.getItem("auth_token"),
                outlook: localStorage.getItem("outlook_auth")
            },
            body: JSON.stringify({
                xauth: global.tinder_data.data.api_token,
                matchid: this.props.data.id,
                message: this.state.txt
            })
        }).then((response) => response.json()).then((respJson) => {
            this.refreshMe();
            console.log(respJson);
        }).catch((error) => { console.error(error); });
    }

    render() {
        return (
            <div>
                <div>
                    <Button onClick={() => { this.openTinder(false) }}>
                        <img
                        style={{width: 30, height: 30}}
                        alt=""
                        source={{ uri: "http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png" }} />
                    </Button>
                </div>
                <div>
                    <div style={{}}>
                        {this.props.data.messages.map((msg) => {
                            if (this.props.data.person._id === msg.from) {
                                return (
                                    <text>
                                        {msg.message}
                                    </text>);
                            } else {
                                return (
                                    <text style={{
                                    }}>

                                        {msg.message}

                                    </text>);
                            }
                        })}
                    </div>
                    <div>
                        <div>
                            <TextField label="Text to check"
                                style={{ textAlign: "center" }}
                                onChange={this.saveTxt}
                                variant="outlined"
                                fullWidth={true}
                                placeholder="Input Text"
                                rowsMax="1" />
                        </div>
                        <div>
                            <Button
                                style={{
                                    backgroundColor: '#7a42f4',
                                    padding: 10,
                                    margin: 15,
                                    height: 40,
                                }}
                                onClick={() => this.sendMessage()}>
                                <text style={{ color: 'white' }}>Send text</text>
                            </Button>
                        </div>
                    </div>
                </div>
                <Button style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
                    onClick={() => { this.openTinder(true) }}>
                    <img
                    style={{width: 140, height: 140}}
                    alt=""
                    source={{ uri: this.props.url }} />
                    <text style={{
                        fontSize: 20
                    }}>{this.props.name}</text>
                </Button>
            </div>
        );
    }
}
