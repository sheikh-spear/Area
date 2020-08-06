import React from "react";
import { Button, TextField } from "@material-ui/core";
import '../../Utils/global'

export default class TinderLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            sms_sent: false,
            sms: undefined,
            number: undefined
        };
        this.openTinder = this.openTinder.bind(this);
        this.handlePhone = this.handlePhone.bind(this);
        this.handleSMS = this.handleSMS.bind(this);
        this.login = this.login.bind(this);
    }

    openTinder(e) {
        this.setState({ modalVisible: e });
    }

    handlePhone(data) {
        this.setState({ number: data.target.value });
    }

    handleSMS(data) {
        this.setState({ sms: data.target.value });
    }

    login(num) {
        fetch(`http://127.0.0.1:8080/api/tinder-login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + localStorage.getItem("auth_token"),
                outlook: localStorage.getItem("outlook_auth")
            },
            body: JSON.stringify({
                number: num,
            })
        }).then((response) => response.json()).then((respJson) => {
            console.log("send SMS");
            this.setState({ sms_sent: respJson.data.sms_sent });
        }).catch((error) => { console.error(error); });
    }
    loginSMS(sms, num) {
        let token_refresh;
        fetch(`http://127.0.0.1:8080/api/tinder-validate-num`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + localStorage.getItem("auth_token"),
                outlook: localStorage.getItem("outlook_auth")
            },
            body: JSON.stringify({
                code: sms,
                number: num,
            })
        }).then((response) => response.json()).then((respJson) => {
            token_refresh = respJson.data.refresh_token;
            console.log(token_refresh);
            fetch(`http://127.0.0.1:8080/api/tinder-getxauth`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    authorization:
                        "Bearer " + localStorage.getItem("auth_token"),
                    outlook: localStorage.getItem("outlook_auth")
                },
                body: JSON.stringify({
                    refresh: token_refresh,
                    number: num,
                })
            }).then((response) => response.json()).then((respJson) => {
                global.tinder_data = respJson;
                window.alert("getres");
                this.props.refresh();
                console.log(global.tinder_data);
            }).catch((error) => { console.error(error); });
        }).catch((error) => { console.error(error); });
    }

    render() {
        let form;
        if (this.state.sms_sent === false) {
            form = <div><div>
                <TextField
                    label="Phone Number"
                    style={{ textAlign: "center" }}
                    variant="outlined"
                    fullWidth={false}
                    placeholder="33600000000"
                    rowsMax="1"
                    onChange={this.handlePhone} />
            </div>
                <div>
                    <Button
                        style={{
                            marginTop: "1%",
                            border: "1px solid grey"
                        }}
                        onClick={() => this.login(this.state.number)}>
                        <text >Login</text>
                    </Button>
                </div></div>;
        } else {
            form = <div><div>
                <TextField label="SMS Code"
                    style={{ textAlign: "center" }}
                    variant="outlined"
                    fullWidth={false}
                    placeholder="88888888"
                    rowsMax="1"
                    onChange={this.handleSMS} />
            </div>
                <div>
                    <Button
                        style={{ marginTop: "1%", border: "1px solid grey" }}
                        onClick={() => this.loginSMS(this.state.sms, this.state.number)}>
                        <text>Login</text>
                    </Button>
                </div></div>;
        }
        return (
            <div>
                {form}
            </div>
        );
    }
}