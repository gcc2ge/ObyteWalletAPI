const Mnemonic = require('bitcore-mnemonic');
const objectHash = require('byteballcore/object_hash');
const wifLib = require('wif');

const path = "m/44'/0'/0'";

let mnemonic = new Mnemonic();
while (!Mnemonic.isValid(mnemonic.toString())) {
    mnemonic = new Mnemonic();
}
const xPrivKey = mnemonic.toHDPrivateKey('','livenet');
console.info(`xPrivKey ${xPrivKey}`);


const {privateKey} = xPrivKey.derive(path);
console.info(`privKey ${privateKey}`)

const privKeyBuf = privateKey.bn.toBuffer({size: 32});
console.info(`privKeyBuff ${privKeyBuf.toString()}`);

const wif = wifLib.encode(128, privKeyBuf, false); // mainnet
// const wif = wifLib.encode(239, privKeyBuf, false); // testnet
// console.info(`wifDecode ${wifLib.decode(wif,239).privateKey}`)

const pubkey = privateKey.publicKey.toBuffer().toString('base64');
const definition = ['sig', {pubkey}];
const address = objectHash.getChash160(definition);

console.log(
    'Seed:', mnemonic.phrase,
    '\nPath:', path,
    '\nWIF:', wif,
    '\nPublic key:', pubkey,
    '\nAddress:', address
);