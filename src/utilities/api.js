/**
 * Created by nickson on 6/23/2018.
 */
const utils = require('./utils');

/**
 * Switch local testing on or off
 */
const PRODUCTION = true;

/**
 * Check table occupancy
 * @param {*} data table data
 */
export async function getTableOccupancy(table_number) {
    try {
        let url = `http://localhost:8080/table/${table_number}`;
        if (PRODUCTION) {
            url = `https://pick-a-seat.appspot.com/table/${table_number}`;
        }
        let response = await fetch(url, {
            method: 'GET',
            mode: 'cors'
        });

        let occupancy = await response.json();

        let seat_states = parseTableState(occupancy);
        return seat_states;
    } catch (error) {
        utils.log('Error: ', error);
        return error.message;
    }
}

/**
 * Parse table occupancy data returned from server
 * @param {*} data table data
 */
function parseTableState(data) {
    return data;
}

/**
 * Pick a seat by interacting with the backend
 * @param {*} data
 */
export async function selectSeat(table_number, occupancy_details) {
    utils.log('putting');
    utils.log('table number', table_number);
    utils.log('occupancy', occupancy_details);
    try {
        let url = `http://localhost:8080/table/${table_number}`;
        if (PRODUCTION) {
            url = `https://pick-a-seat.appspot.com/table/${table_number}`;
        }
        let response = await fetch(url, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(occupancy_details)
        });

        let status = await response.json();

        let selection_result = parseSeatSelectionResult(status);

        return selection_result;
    } catch (error) {
        utils.log('Error: ', error);
        return error.message;
    }
}

function parseSeatSelectionResult(data) {
    return data.message;
}

export function log(message) {
    if (!PRODUCTION) {
        utils.log(message);
    }
}
