var Wallet = require('../lib/wallet');

// var wallet=Wallet.generate();

var wallet = Wallet.fromMnemonic("ivory fiction brother proud multiply air surprise click female rhythm catch ask", {
    network: "livenet",
    account: 0,
});

// var wallet=Wallet.fromPrivateKey("tprv8fW6xL8rgUar2xhZxujbkeJcdz5syS9rXjmSNSnu5PBYJ4LAfHgs5kT63eutWD7CjwjZMNgheuNVPt7pnqZ3SLmsMQ76xB3ny8WpkNQwGVf");

// var wallet=Wallet.generateMnemonic();

console.info(`privKey: ${wallet.getPrivateKeyString()}`)

console.info(`pubkey: ${wallet.getPublicKeyString()}`);

console.info(wallet.Version());

console.info(`wif: ${wallet.getPrivateKeyWif()}`);

//decode
// const wifLib = require('wif');
// var Bitcore = require('bitcore-lib');
// var privKeyBuf=wifLib.decode(wallet.getPrivateKeyWif(),128).privateKey;
// console.info(privKeyBuf.toString('base64'))
// var xPrivKey = new Bitcore.HDPrivateKey()
// console.info(xPrivKey)
//decode

console.info(`address: ${wallet.getAddress()}`);

var password = '1';
var output = wallet.export(password);
console.info(`output ${JSON.stringify(output)}`);

var wallet_import = Wallet.import(output, password);
console.info(wallet_import.getAddress());