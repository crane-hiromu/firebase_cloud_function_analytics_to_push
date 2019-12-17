
/* declaration */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


/* triggers */

/* event trigger */
exports.outputEventLogOfTestLog = functions.analytics.event('TestLog').onLog( event => {
    const params = event.params;
    const tokens = takeOutToken(params);

    if (tokens.length === 0) {
        return console.log('error: tokens is empty');
    } else {
        return sendEventCallBack(tokens, params);
    }
});


/* functions */

function takeOutToken(params) {
    return Object.keys(params)
            .filter(key => {
                return (key.search(/FCM_TOKEN_/) === 0);
            })
            .map(key => {
                return params[key];
            })
            .join("");
}

async function sendEventCallBack(tokens, params) {
    var newParams = params

    Object.keys(params).forEach(key => {
        newParams[key] = String(params[key]);
    })

    let payload = {
        notification: {
          title: 'callback',
          body: 'body',
        },
        data: newParams
    };

    return admin.messaging().sendToDevice(tokens, payload);
}