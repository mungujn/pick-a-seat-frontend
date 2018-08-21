import React, {Component } from "react";

const styles = {
    root: {
        padding: "1em", 
        border: "3px solid green",
    },
    section_1: {},
    title_1: {},
    title_2: {},
    title_3: {},
    title_4: {},
    section_2: {},
    title_5: {},
    selector: {}
};

class Selector extends Component {
    render() {
        return (
            <div style={styles.root}>
                <div style={styles.section_1}>
                    <p style={styles.title_1}>OLD</p>
                    <p style={styles.title_2}>BUDONIANS</p>
                    <p style={styles.title_3}>UNIVERSITY CHAPTER</p>
                    <p style={styles.title_4}>DINNER</p>
                </div>
                <div style={styles.section_2}>
                    <p style={styles.title_5}>Pick A Table</p>
                </div>
            </div>
        );
    }
}

export default Selector;
