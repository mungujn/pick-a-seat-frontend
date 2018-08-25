/**
 * Created by nickson on 6/23/2018.
 */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Table from './components/Table';

const styles = {
    root: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        zIndex: 1
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email_address: 'nicksonmjk@gmail.com',
            ticket_number: 'quick-ticket'
        };
    }

    render() {
        return (
            <div style={styles.root}>
                <Switch>
                    <Route path="/obuc-dinner" component={Table} />
                    <Route path="/" render={() => <Table />} />
                </Switch>
            </div>
        );
    }

    async componentDidMount() {}
}

export default App;
