import React, { Component } from 'react';
import { Image, Grid, Button, Form, Message, Loader } from 'semantic-ui-react';
import * as backend from '../utilities/api';

const styles = {
    root: {
        width: '100%',
        height: '100%'
    },
    center: {
        marginTop: '2em',
        maxWidth: '80em',
        height: '100%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    instructions: {
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    hide: {
        display: 'none'
    },
    form: {
        maxWidth: '20em',
        marginTop: '2em',
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    svg_wrapper: {
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    image: {
        maxWidth: '100%',
        height: '100%'
    }
};

/**
 * Main UI component
 */
class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_number: '1',
            loading: true,
            show_message: false,
            message: 'Error',
            header: 'Error!',
            table_name: 'Table 1',
            seat_states: [
                {},
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' },
                { taken: false, ticket_number: '' }
            ]
        };
    }

    /**
     * Render the apps UI
     */
    render() {
        return (
            <div style={styles.root}>
                <Grid columns="equal">
                    <Grid.Column computer={8} mobile={16}>
                        <Image
                            src={require('../plan.jpeg')}
                            style={styles.image}
                            fluid
                        />
                    </Grid.Column>
                    <Grid.Column computer={8} mobile={16}>
                        <Grid>
                            <Grid.Row>
                                <div style={styles.svg_wrapper}>
                                    {this.getSVG()}
                                </div>
                            </Grid.Row>
                            <Grid.Row>
                                <Loader
                                    size="large"
                                    active={this.state.loading}
                                    inline="centered"
                                />
                            </Grid.Row>
                            <Grid.Row>
                                <Form style={styles.form}>
                                    <br />
                                    <div style={styles.instructions}>
                                        Pick a table, check its occupancy, then
                                        pick a seat
                                    </div>
                                    <br />
                                    {this.getMessage()}
                                    <Form.Input
                                        type="number"
                                        required
                                        name="table_number"
                                        onChange={this.handleInput}
                                        label="Table number"
                                    >
                                        <input placeholder="Enter table number" />
                                    </Form.Input>
                                    <Button onClick={this.handleClickCheck}>
                                        Check
                                    </Button>
                                    <br />
                                    <br />
                                    <Form.Input
                                        type="number"
                                        name="seat_number"
                                        required
                                        onChange={this.handleInput}
                                        label="Seat number"
                                    >
                                        <input placeholder="Enter seat number" />
                                    </Form.Input>
                                    <Form.Input
                                        type="email"
                                        name="email_address"
                                        required
                                        onChange={this.handleInput}
                                        label="Email address"
                                    >
                                        <input placeholder="Enter email address" />
                                    </Form.Input>
                                    <Form.Input
                                        type="number"
                                        name="ticket_number"
                                        required
                                        onChange={this.handleInput}
                                        label="Ticket number"
                                    >
                                        <input placeholder="Enter ticket number" />
                                    </Form.Input>

                                    <Button
                                        onClick={this.handleClickSelect}
                                        type="submit"
                                    >
                                        Select
                                    </Button>
                                </Form>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

    /**
     * Handle table number selection, highlight special table
     */
    handleInput = event => {
        const name = event.target.name;
        const value = event.target.value;

        let x = `${name}`;
        if (x === 'table_number') {
            let y = `${value}`;
            if (y === '3') {
                this.setState({
                    [name]: value,
                    table_name: 'Arch'
                });
            } else {
                this.setState({
                    [name]: value,
                    table_name: `Table ${value}`
                });
            }
        } else {
            this.setState({
                [name]: value
            });
        }
    };

    /**
     * Check table occupancy
     */
    handleClickCheck = event => {
        event.preventDefault();
        console.log('Checking table');
        this.setState({
            loading: true,
            show_message: false
        });

        if (this.validateTableInput()) {
            console.log('Table input validated');
            this.updateSeatStates();
        } else {
            console.log('Table input validation failed');
            this.setState({
                loading: false,
                header: 'Error!',
                show_message: true,
                message: 'Wrong table number'
            });
        }
    };

    /**
     * Select a seat
     */
    handleClickSelect = event => {
        console.log('Selecting seat');
        this.setState({
            loading: true,
            show_message: false
        });
        event.preventDefault();

        if (this.validateSeatInput() && this.validateTableInput()) {
            this.pickASeat();
        } else {
            console.log('Input validation failed');
            this.setState({
                loading: false,
                header: 'Error!',
                show_message: true,
                message: 'Input validation failed'
            });
        }
        console.log(this.state);
    };

    /**
     * Validate selected table number
     */
    validateTableInput = () => {
        console.log('Validating table number input');
        let table_number = parseInt(this.state.table_number);
        console.log(table_number);
        if (table_number < 21 && table_number > 0) {
            return true;
        }
        return false;
    };

    /**
     * Validate selected seat number
     */
    validateSeatInput = () => {
        console.log('Validating input');
        if (
            this.state.seat_number !== undefined &&
            this.state.seat_number < 11 &&
            this.state.seat_number > 0
        ) {
            return true;
        }
        return false;
    };

    componentDidMount() {
        this.updateSeatStates();
    }

    /**
     * Update seat states
     */
    updateSeatStates = async () => {
        console.log('Updating table seat states');
        try {
            let table = `table-${this.state.table_number}`;
            let seat_states = await backend.checkSeatStates(table);
            console.log('Table seat_states data is', seat_states);
            this.setState({
                seat_states: seat_states,
                loading: false
            });
        } catch (error) {
            this.setState({
                loading: false,
                header: 'Error!',
                show_message: true,
                message: 'Failed to update table'
            });
        }
    };

    /**
     * Pick a seat by interacting with the backend
     */
    pickASeat = async () => {
        console.log('Updating table seat states');
        try {
            let data = {
                table: `table-${this.state.table_number}`,
                seat: this.state.seat_number,
                customer: {
                    ticket_number: this.state.ticket_number,
                    email_address: this.state.email_address
                }
            };
            let result = await backend.selectSeat(data);
            console.log('Seat selection result is', result);
            if (result === true) {
                this.setState({
                    loading: false,
                    show_message: true,
                    header: 'Message',
                    message: 'Successfully selected seat'
                });
            } else {
                this.setState({
                    loading: false,
                    show_message: true,
                    header: 'Error!',
                    message: result
                });
            }

            setTimeout(() => {
                this.updateSeatStates();
            }, 2000);
        } catch (error) {
            this.setState({
                loading: false,
                show_message: true,
                header: 'Error!',
                message: 'Failed to select seat'
            });
            setTimeout(() => {
                this.updateSeatStates();
            }, 2000);
        }
    };

    /**
     * Display nofication
     */
    getMessage = () => {
        if (this.state.show_message) {
            return (
                <Message
                    onDismiss={this.handleDismiss}
                    header={this.state.header}
                    content={this.state.message}
                />
            );
        }
    };

    /**
     * Get table fill color
     */
    getFill = seat => {
        if (seat.taken === true) {
            return 'red';
        }
        return 'black';
    };

    /**
     * Get table name
     */
    getTableName = () => {
        return `${this.state.table_name}`;
    };

    /**
     * Returns the JSX compatible SVG
     */
    getSVG = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="573px"
                height="445px"
                version="1.1"
            >
                <defs />
                <g transform="translate(0.5,0.5)">
                    <g id="cell-4">
                        <ellipse
                            cx={287}
                            cy={222}
                            rx={156}
                            ry={156}
                            fill="#ffffff"
                            stroke="#000000"
                            pointerEvents="none"
                        />
                        <g transform="translate(172.5,186.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={378}
                                    height={118}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 379,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font style={{ fontSize: 100 }}>
                                                {this.getTableName()}
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={189}
                                    y={65}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    &lt;font style="font-size: 100px"&gt;Table
                                    12&lt;/font&gt;
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-5">
                        <rect
                            x="268.5"
                            y={18}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[1])}
                            stroke="#000000"
                            pointerEvents="none"
                        />
                        <g transform="translate(283.5,30.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#ffffff"
                                            >
                                                1
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-6">
                        <rect
                            x="380.4"
                            y={54}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[2])}
                            stroke="#000000"
                            transform="rotate(35,398.4,72)"
                            pointerEvents="none"
                        />
                        <g transform="translate(394.5,66.5)scale(0.6)rotate(35,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#ffffff"
                                            >
                                                2
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-7">
                        <rect
                            x="386.4"
                            y={354}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[5])}
                            stroke="#000000"
                            transform="rotate(140,404.4,372)"
                            pointerEvents="none"
                        />
                        <g transform="translate(400.5,366.5)scale(0.6)rotate(140,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                color="#ffffff"
                                                style={{ fontSize: 17 }}
                                            >
                                                5
                                            </font>
                                            <br />
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-8">
                        <rect
                            x="80.4"
                            y="254.7"
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[8])}
                            stroke="#000000"
                            transform="rotate(-105,98.4,272.7)"
                            pointerEvents="none"
                        />
                        <g transform="translate(94.5,266.5)scale(0.6)rotate(-105,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                color="#ffffff"
                                                style={{ fontSize: 17 }}
                                            >
                                                8
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-9">
                        <rect
                            x="146.4"
                            y={348}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[7])}
                            stroke="#000000"
                            transform="rotate(-140,164.4,366)"
                            pointerEvents="none"
                        />
                        <g transform="translate(160.5,360.5)scale(0.6)rotate(-140,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                color="#ffffff"
                                                style={{ fontSize: 17 }}
                                            >
                                                7
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-10">
                        <rect
                            x="442.5"
                            y={138}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[3])}
                            stroke="#000000"
                            transform="rotate(70,460.5,156)"
                            pointerEvents="none"
                        />
                        <g transform="translate(457.5,150.5)scale(0.6)rotate(70,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#ffffff"
                                            >
                                                3
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-11">
                        <rect
                            x="164.4"
                            y={48}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[10])}
                            stroke="#000000"
                            transform="rotate(-40,182.4,66)"
                            pointerEvents="none"
                        />
                        <g transform="translate(176.5,60.5)scale(0.6)rotate(-40,9.5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={19}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 19,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#ffffff"
                                            >
                                                10
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={10}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-12">
                        <rect
                            x="94.5"
                            y={126}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[9])}
                            stroke="#000000"
                            transform="rotate(-60,112.5,144)"
                            pointerEvents="none"
                        />
                        <g transform="translate(109.5,138.5)scale(0.6)rotate(-60,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                color="#ffffff"
                                                style={{ fontSize: 17 }}
                                            >
                                                9
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-13">
                        <rect
                            x="452.4"
                            y="254.7"
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[4])}
                            stroke="#000000"
                            transform="rotate(110,470.4,272.7)"
                            pointerEvents="none"
                        />
                        <g transform="translate(466.5,266.5)scale(0.6)rotate(110,5,9)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#ffffff"
                                            >
                                                4
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-14">
                        <rect
                            x="268.5"
                            y={390}
                            width={36}
                            height={36}
                            fill={this.getFill(this.state.seat_states[6])}
                            stroke="#000000"
                            pointerEvents="none"
                        />
                        <g transform="translate(283.5,402.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={10}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 11,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                color="#ffffff"
                                                style={{ fontSize: 17 }}
                                            >
                                                6
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={5}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-3f48a8a04b434277-14">
                        <path
                            d="M 171 52.2 L 171 52.2"
                            fill="none"
                            stroke="#000000"
                            strokeMiterlimit={10}
                            pointerEvents="none"
                        />
                        <path
                            d="M 171 52.2 L 171 52.2 L 171 52.2 L 171 52.2 Z"
                            fill="#000000"
                            stroke="#000000"
                            strokeMiterlimit={10}
                            pointerEvents="none"
                        />
                    </g>
                    <g id="cell-43d37fc22e3b8da7-14">
                        <g transform="translate(262.5,0.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <span style={{ fontSize: 17 }}>
                                                <font color="#000">
                                                    {
                                                        this.state
                                                            .seat_states[1]
                                                            .ticket_number
                                                    }
                                                </font>
                                            </span>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-15">
                        <g transform="translate(262.5,432.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[6]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-16">
                        <g transform="translate(445.5,390.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[5]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-17">
                        <g transform="translate(93.5,378.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[7]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-18">
                        <g transform="translate(23.5,278.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[8]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-19">
                        <g transform="translate(501.5,272.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[4]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-20">
                        <g transform="translate(493.5,144.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[3]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-21">
                        <g transform="translate(31.5,126.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[9]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-22">
                        <g transform="translate(427.5,48.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[2]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                    <g id="cell-43d37fc22e3b8da7-23">
                        <g transform="translate(103.5,48.5)scale(0.6)">
                            <switch>
                                <foreignObject
                                    style={{ overflow: 'visible' }}
                                    pointerEvents="all"
                                    width={78}
                                    height={18}
                                    requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: 12,
                                            fontFamily: 'Helvetica',
                                            color: 'rgb(0, 0, 0)',
                                            lineHeight: '1.2',
                                            verticalAlign: 'top',
                                            width: 79,
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'normal',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div
                                            xmlns="http://www.w3.org/1999/xhtml"
                                            style={{
                                                display: 'inline-block',
                                                textAlign: 'inherit',
                                                textDecoration: 'inherit'
                                            }}
                                        >
                                            <font
                                                style={{ fontSize: 17 }}
                                                color="#000"
                                            >
                                                {
                                                    this.state.seat_states[10]
                                                        .ticket_number
                                                }
                                            </font>
                                        </div>
                                    </div>
                                </foreignObject>
                                <text
                                    x={39}
                                    y={15}
                                    fill="#000000"
                                    textAnchor="middle"
                                    fontSize="12px"
                                    fontFamily="Helvetica"
                                >
                                    [Not supported by viewer]
                                </text>
                            </switch>
                        </g>
                    </g>
                </g>
            </svg>
        );
    };
}

export default Table;
