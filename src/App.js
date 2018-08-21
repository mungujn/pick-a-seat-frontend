/**
 * Created by nickson on 6/23/2018.
 */
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Table from "./components/Table";
import * as API from "./utilities/api";
import Layout from "./Layout";

const styles = {
    root: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        zIndex: 1
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: "SignIn"
        };
    }

    render() {
        return (
            <div style={styles.root}>
                <Switch>
                    <Route path="/dinner" render={() => <Layout />} />
                    <Route path="/table" component={Table} />
                    <Route path="/" render={() => <Layout />} />
                </Switch>
            </div>
        );
    }

    async componentDidMount() {
        let user = await API.isSignedIn();
        if (user === null || user === undefined) {
            // No user is signed in.
            console.log("not signed in");
        } else {
            // signed in
            this.setState({
                signed_in: true
            });
            console.log("signed in as:", user);
            // let token = await API.getToken(); //displays token in console
        }
    }

    signIn = (email, password) => {
        console.log(`Signing in with ${email}`);
        API.login(email, password).then(
            result => {
                this.setState({
                    component: "Layout"
                });
                console.log(result);
            },
            function(error) {
                console.log(error);
            }
        );
    };

    signOut = () => {
        API.logout().then(result => {
            this.setState({
                component: "SignIn"
            });
            console.log(result);
        });
    };
}

export default App;
