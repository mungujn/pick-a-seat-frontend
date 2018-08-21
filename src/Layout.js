import React, { Component } from "react";
import Balcony from "./components/Balcony";
import Selector from "./components/Selector";
import { Grid } from "semantic-ui-react";

const styles = {
    root: {
        height: "100%",
        width: "100%"
    },
    balcony: {
        marginTop: "1em",
        marginLeft: "1em",
        height: "100%"
    },
    selector: {
        marginTop: "calc(100% - (100% - 10em))"
    }
};

class Layout extends Component {
    render() {
        return (
            <Grid style={styles.root}>
                <Grid.Column width={10}>
                    <div style={styles.balcony}>
                        <Balcony /> 
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <div style={styles.selector}>
                        <Selector />
                    </div>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Layout;
