import React, { Component } from "react";
import { Button, Form, Message } from "semantic-ui-react";

const styles = {
    root: {
        padding: "1em",
        border: "3px solid green",
        textAlign: "center"
    },
    section_1: {},
    title_1: {
        // OLD
        fontFamily: "Gotham",
        fontSize: "1em",
        margin: "0",
        color: "white"
    },
    title_2: {
        // Budonians
        fontStyle: "bold",
        fontSize: "2em",
        margin: "0",
        color: "white"
    },
    title_3: {
        // UNIVERSITY CHAPTER
        margin: "0",
        color: "white"
    },
    title_4: {
        // Dinner
        fontFamily: "'Tangerine', cursive",
        fontStyle: "italic",
        fontSize: "1.7em",
        margin: "0",
        color: "white"
    },
    section_2: {},
    selector: {},
    hide: {
        display: "none"
    }
};

class Selector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_message: false,
            message: ""
        };
    }
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
                    <Form>
                        <Form.Input
                            name="table_number"
                            required
                            onChange={this.handleInput}
                        >
                            <input placeholder="Enter table number" />
                        </Form.Input>
                        <Button onClick={this.handleClickNext} type="submit">
                            Next
                        </Button>
                    </Form>
                    <Message
                        style={Object.assign(
                            {},
                            !this.state.show_message && styles.hide
                        )}
                        attached="bottom"
                        warning
                    >
                        {this.state.message}
                    </Message>
                </div>
            </div>
        );
    }

    handleInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    };

    handleClickNext = event => {
        console.log("Moving to next");
        console.log(this.state);
        event.preventDefault();
        if (this.validateInput()) {
            console.log("input validated");
            window.sessionStorage.setItem("selected_table", this.state.table_number);
            window.location = "/table?number=" + this.state.table_number
        } else {
            console.log("Input validation failed");
            this.setState({
                show_message: true,
                message: "Input validation failed"
            });
        }
    };

    validateInput = () => {
        console.log("Validating input");
        if (
            this.state.table_number !== undefined &&
            this.state.table_number < 21 &&
            this.state.table_number > 0
        ) {
            return true;
        }
        return false;
    };
}

export default Selector;
