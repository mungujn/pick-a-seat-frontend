/**
 * Switch local testing on or off
 */
const PRODUCTION = true;

export function log(message, object) {
    if (!PRODUCTION) {
        console.log(message);
        if (object !== undefined) {
            console.log(object);
        }
    }
}
