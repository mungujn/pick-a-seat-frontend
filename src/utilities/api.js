/**
 * Created by nickson on 6/23/2018.
 */
export const CONSTANTS = {
    SUCCESS: 'success'
};

const PRODUCTION = false;

export async function checkSeatStates(data) {
    try {
        let url = 'http://localhost:8080/check-seat-states';
        if (PRODUCTION) {
            url = 'https://pick-a-seat.appspot.com/check-seat-states';
        }
        let result = await post(url, { table: data });
        let seat_states = parseSeatStates(result);
        return seat_states;
    } catch (error) {
        console.log('Error: ', error);
        return error.message;
    }
}

function parseSeatStates(data) {
    return data.message;
}

export async function selectSeat(data) {
    try {
        let url = 'http://localhost:8080/pick-a-seat';
        if (PRODUCTION) {
            url = 'https://pick-a-seat.appspot.com/pick-a-seat';
        }
        let result = await post(url, data);
        let result_2 = parseSeatSelectionResult(result);
        return result_2;
    } catch (error) {
        console.log('Error: ', error);
        return error.message;
    }
}

function parseSeatSelectionResult(data) {
    return data.message;
}

export async function post(url, data, auth) {
    log(`Posting ${JSON.stringify(data)} to url ${url}`);

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Authorization: auth,
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    });

    let json_response;

    if (response.status === 200) {
        console.log('Response code', response.status);
        json_response = await response.json();
        console.log('Response message', json_response);
    } else if (response.status === 401) {
        return { message: 'Wrong ticket number or email' };
    } else {
        console.log('Response', response.status);
        json_response = await response.json();
        console.log('Response message', json_response['message']);
    }
    return json_response;
}

export function log(message) {
    if (!PRODUCTION) {
        console.log(message);
    }
}
