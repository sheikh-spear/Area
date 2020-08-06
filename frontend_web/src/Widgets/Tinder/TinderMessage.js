import React from "react"
import { Button } from "@material-ui/core"

import WidgetTinderLogin from './TinderLogin';
import WidgetTinderPerson from './TinderPerson';
import '../../Utils/global'

export default class WidgetTinderMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            refresh: false,
            data: undefined
        };
        this.openTinder = this.openTinder.bind(this);
        this.refreshMe = this.refreshMe.bind(this);
        this.getLiked = this.getLiked.bind(this);
    }

    openTinder(e) {
        this.setState({ modalVisible: e });
    }

    refreshMe(val) {
        this.setState({ refresh: val });
        this.getLiked();
    }

    getLiked() {
        fetch(`http://127.0.0.1:8080/api/tinder-update`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + localStorage.getItem("auth_token"),
                outlook: localStorage.getItem("outlook_auth")
            },
            body: JSON.stringify({
                xauth: global.tinder_data.data.api_token,
            })
        }).then((response) => response.json()).then((respJson) => {
            this.setState({ data: respJson.matches });
        }).catch((error) => { console.error(error); });
    }

    render() {
        let data;
        if (global.tinder_data === undefined) {
            return <WidgetTinderLogin refresh={this.refreshMe} />;
        } else {
            if (this.state.data !== undefined) {
                data = this.state.data.map((data) => {
                    return (
                        <div>
                            <WidgetTinderPerson
                                refresh={this.getLiked}
                                data={data}
                                name={data.person.name}
                                url={data.person.photos[0].processedFiles[0].url} />
                        </div>
                    );
                });
            }
            else {
                this.getLiked();
                return <text>Loading</text>
            }
        }
        return (
            <div>
                <div>
                    <Button
                        onClick={() => { this.openTinder(false) }}>
                        <img
                            style={{ width: 30, height: 30 }}
                            alt=""
                            source={{ uri: "http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png" }}
                        />
                    </Button>
                </div>
                <div> <text>
                    {data}
                </text>
                </div>
                <Button
                    onClick={() => { this.openTinder(true) }}>
                    <img
                    style={{width: 140, height: 140}}
                    alt=""
                    source={{ uri: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.prospectmagazine.co.uk%2Fwp-content%2Fuploads%2F2014%2F12%2FTinder-Flame.png&f=1&nofb=1" }} />
                </Button>
            </div>
        );
    }
}
