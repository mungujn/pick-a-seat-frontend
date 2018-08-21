import React, { Component } from "react";

const styles = {
    root: {
        padding: "1em",
        border: "3px solid white",
        height: "100%",
    }
};

class Balcony extends Component {
    render() {
        return <div style={styles.root}>Balcony component</div>;
    }
}

export default Balcony;
