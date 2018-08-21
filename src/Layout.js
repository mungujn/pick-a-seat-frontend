import React, { Component } from "react";
import Balcony from "./components/Balcony";
import Selector from "./components/Selector";
import { Grid } from "semantic-ui-react";

const styles = {
    root: {
        height: "100%",
        width: "100%"
    },
    balcony: {},
    selector: {}
};

class Layout extends Component {
    render() {
        return (
            <Grid style={styles.root}>
                <Grid.Column width={12}>
                    <div>
                        <Balcony />
                    </div>
                </Grid.Column>
                <Grid.Column width={4}>
                    <div>
                        <Selector />
                    </div>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Layout;
