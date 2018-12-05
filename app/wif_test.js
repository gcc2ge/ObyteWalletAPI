const Mnemonic = require('bitcore-mnemonic');
const wifLib = require('wif');

var mnemonic = new Mnemonic("ivory fiction brother proud multiply air surprise click female rhythm catch ask");
const xPrivKey = mnemonic.toHDPrivateKey('','livenet');
console.info(`xPrivKey ${xPrivKey}  typeOf ${typeof(xPrivKey)} ${JSON.stringify(xPrivKey)}`);

// const path = "m/44'/0'/0'";
const path = "m/44'/0'/0'/0/0";
const {privateKey} = xPrivKey.derive(path);
console.info(`privKey ${privateKey}`);

const privKeyBuf = privateKey.bn.toBuffer({size: 32});
console.info(`privKeyBuff ${privKeyBuf.toString()}`);

const wif = wifLib.encode(128, privKeyBuf, false); // mainnet
console.info(`wif ${wif}`)
// const wif = wifLib.encode(239, privKeyBuf, false); // testnet
console.info(`wifDecode ${wifLib.decode(wif,128).privateKey}`);