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
            email_address: "nicksonmjk@gmail.com",
            ticket_number: "quick-ticket"
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
        
    }
}

export default App;
