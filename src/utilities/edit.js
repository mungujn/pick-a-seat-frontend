

export async function deposit(){
    let url = 'https://deposit-dot-pamoja-wallet.appspot.com/deposit/from/nmoney?key=AIzaSyCg8x4qnWFg61YP7Wp2nPfBHTyuB9HpH3k'
}


export async function updateUserDetails(first_name, last_name) {
    console.log("First name", first_name);
    console.log("Last name", last_name);
    let user = getUID();
    let uid = user.uid;
    let json_response;
    let token = await getToken(false);

    // let url = 'http://localhost:8080/edit?key=AIzaSyCg8x4qnWFg61YP7Wp2nPfBHTyuB9HpH3k'
    let url = 'https://users-dot-pamoja-wallet.appspot.com/edit?key=AIzaSyCg8x4qnWFg61YP7Wp2nPfBHTyuB9HpH3k'

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': 'Bearer ' + token,
            "Content-type": "application/json; charset=UTF-8"
        },
        credentials: 'include',
        body: JSON.stringify({
            "uid": uid,
            "first_name": first_name,
            "last_name": last_name
        })
    });

    if (response.status == 200) {
        console.log("Response code", response.status);
        json_response = await response.json()
        console.log('Response message', json_response);
    } else {
        console.log('Response', response.status);
        json_response = await response.json()
        console.log('Response message', json_response['message']);
    }
    return json_response
}