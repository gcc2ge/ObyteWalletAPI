const wifLib = require('wif');
var Bitcore = require('bitcore-lib');

var Client = require('byteball-wallet/bitcore-wallet-client');
/*
// const wif = wifLib.encode(128, privKeyBuf, false); // mainnet
var privBuff = "xprv9xzPDQq2vazvXMYuPyHvYPFgwifHunDJKTptFgCHcyaMjLw9nFWBStPFGTuC9tfMon1wpmf2Go6evn3hEJyLQDZiV9RWjrWHxawnkKjPuBo"
var wif = wifLib.encode(128, new Buffer(privBuff,0,32), false);
console.info(wif);

var privStr=wifLib.decode(wif,128);
console.info(privStr.privateKey.toString())*/


var walletClient = new Client();
walletClient.createWallet("a", 1, 1, {
    //	isSingleAddress: true,
    network: 'livenet'
}, function (err) {
    if (err)
        console.info(err)
    console.info("created wallet, client: ", JSON.stringify(walletClient));
    var xPrivKey = walletClient.credentials.xPrivKey;
    var mnemonic = walletClient.credentials.mnemonic;
    console.info("mnemonic: " + mnemonic + ', xPrivKey: ' + xPrivKey);
});

// client.importFromExtendedPrivateKey("")