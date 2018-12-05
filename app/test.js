const byteball = require('byteball');

// Connect to mainnet official node 'wss://byteball.org/ws'
// const client = new byteball.Client();

// Connect to a custom node
// const client = new byteball.Client('wss://byteball.fr/bb');

// Connect to testnet
// const client = new byteball.Client('wss://byteball.org/bb-test',true);

// main net
const client = new byteball.Client('wss://byteball.org/bb', false);

/**
 *

 Seed: vicious wait peanut involve cover report fame identify earth bus museum false
 Path: m/44'/0'/0'/0/0
 WIF: 91kNzGxp1VjdY273czHUdm459j9WZZcateujpfrVYXxNXoi69Ws
 Public key: A7jfJxl2TEcryGTr5FC/Ft/nwKT9PyvtphvNiXO//hmW
 Address: JEXTINCXBMQOG3O7UGYKGIBBN7LVXO2N

 * @type {[string]}
 */

// 余额查询

const addresses = [
    '3KGRUVQDV6VIVNHEV2XIO4YUGFCWMYPJ',

];

client.api.getBalances(addresses, function (err, result) {

    console.log(result[addresses[0]].base.stable);
});


// 区块编号查询

/*client.api.getLastMci(function(err, result) {
    console.log(result);
});*/

// 生成交易
/*const params = {
    outputs: [
        {address: 'JEXTINCXBMQOG3O7UGYKGIBBN7LVXO2N', amount: 1000}
    ]
};
client.compose.payment(params, "9386coYjDwLDGc8eEZiVLdieJtXdYwMRutqPcuJSQFBDSh8c75G", function (err, result) {
    if (err) console.info(err)
    console.log(JSON.stringify(result));
});*/
//5HxBTuBec5kVPzxvdV4rBdtXXKihxCrCttU4aBquhEFGd14VoNz
const params = {
    outputs: [
        {address: 'JEXTINCXBMQOG3O7UGYKGIBBN7LVXO2N', amount: 1}
    ]
};
client.compose.payment(params, "5KMU34jBdiG5JYdMcDpaU3AgfEAvPmpEZwySYGww4WSAfdtgtMt", function (err, result) {
    if (err) console.info(err)
    console.log(JSON.stringify(result));
});


// 发送交易
/*const params = {
    unit: [Object]
};

client.api.postJoint(params, function(err, result) {
    console.log(result);
});*/

// 直接发送交易
/*const params = {
    outputs: [
        { address: 'ZVXUBCYCMK7F2ZR5PTJOOJT6LTWSNC6Z', amount: 1000 }
    ]
};

client.post.payment(params, wif, function(err, result) {
    console.log(result);
});*/


// 校验地址
/*
const address = 'eee';

client.api.getDefinition(address, function(err, result) {
    console.info(JSON.stringify(err))
    console.info(JSON.stringify(result))

    console.log(result==null);
});
*/
