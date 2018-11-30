const fs = require("fs")
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
    server: "wss://s.altnet.rippletest.net:51233" // Public rippled server hosted by Ripple, Inc.
});

mul_address_info = JSON.parse(fs.readFileSync('mul-address.json').toString());
owners_info = JSON.parse(fs.readFileSync('owners.json').toString()).address;
const mul_addtess = mul_address_info.address;
const mul_addtess_privkey = mul_address_info.privkey;
const signer1 = owners_info[0];
const signer2 = owners_info[1];
const signer3 = owners_info[2];


const txJsonSignerListSet = JSON.stringify({
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": mul_addtess,
    "Fee": "12",
    "Sequence": 1,
    "SignerQuorum": 3,
    "offline": true,
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": signer1,
                "SignerWeight": 2
            }
        },
        {
            "SignerEntry": {
                "Account": signer2,
                "SignerWeight": 2
            }
        },
        {
            "SignerEntry": {
                "Account": signer3,
                "SignerWeight": 2
            }
        },

    ]
});
const txJsonAccountSet = JSON.stringify({
        "TransactionType": "AccountSet",
        "Account": mul_addtess,
        "Fee": "12",
        "Sequence": 2,
        "SetFlag": 4,
    }
);
const signedSignerListSet = api.sign(txJsonSignerListSet, mul_addtess_privkey);
const signedAccountSet = api.sign(txJsonAccountSet, mul_addtess_privkey);

api.connect().then(() => {
    api.submit(signedSignerListSet.signedTransaction.toString()).then((state) => {
        console.log("success in SignerListSet");
        api.submit(signedAccountSet.signedTransaction.toString()).then((state) => {
            console.log("success in AccountSet");
            return api.disconnect();
        }).catch((error) => {
            console.log("error in AccountSet");
            console.log(error)
        });
    }).catch((error) => {
        console.log("error in SignerListSet");
        console.log(error)
    });
});