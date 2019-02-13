const PrivateKey = require('bitcore-lib/lib/privatekey');
const PublicKey = require('bitcore-lib/lib/publickey');

var Client = require('../bitcore-wallet-client');
var Credentials = require('../bitcore-wallet-client/lib/credentials');
var sjcl = require('sjcl');
var Bitcore = require('bitcore-lib');

function isValidPrivate(priv) {
    return PrivateKey.isValid(priv.privateKey);
}

function isValidPublic(pub) {
    return PublicKey.isValid(pub);
}

function privateToPublic(priv) {
    return new Bitcore.HDPublicKey(priv);
}

function privateToAddress(priv) {
    var pub = privateToPublic(priv);
    return Address(pub);
}

function Version(xPrivKey, xPubKey) {
    var network = Credentials._getNetworkFromExtendedKey(xPrivKey.toString() || xPubKey.toString());
    return network;
}

function Wif(privKey) {
    var network = Version(privKey);
    const wifLib = require('wif');

    var privateBuffer = privKey.derive('m/0/0').privateKey.bn.toBuffer({size: 32});
    var version = (network == 'livenet' ? 128 : 239);
    var prv_wif = wifLib.encode(version, privateBuffer, false);
    return prv_wif;
}

function Address(xPubKey) {
    // 生成地址
    var pubKey = xPubKey.derive('m/0/0').publicKey.toBuffer().toString("base64");
    var objectHash = require('../byteballcore/object_hash.js');
    // 设定地址定义脚本，为单签名
    var arrDefinition = ["sig", {"pubkey": pubKey}];
    var address = objectHash.getChash160(arrDefinition);
    return address;
}

function exportWallet(priv, password) {
    var x = {};
    if (password) {
        x.xPrivKeyEncrypted = sjcl.encrypt(password, priv.xprivkey);
    } else {
        x.xPrivKey = priv.xprivkey;
    }
    ;
    return x;
}

function importWallet(input, password) {
    var xPrivKey;
    if (input.xPrivKeyEncrypted) {
        xPrivKey = sjcl.decrypt(password, input.xPrivKeyEncrypted);
    } else {
        xPrivKey = input.xPrivKey;
    }

    xPrivKey = new Bitcore.HDPrivateKey(xPrivKey)

    return xPrivKey;
}

// 公用
function fromAPI(api) {
    var privKey = api.credentials.getDerivedXPrivKey();
    /*var wallet = Wallet.fromPrivateKey(privKey);
    return wallet;*/
    return privKey;
}

function generate(opts) {
    var api = new Client();
    api.seedFromRandom(opts);
    return fromAPI(api);
}


function generateMnemonic(opts) {
    var api = new Client();
    api.seedFromRandomWithMnemonic();
    return fromAPI(api);
}

/**
 * Seed from Mnemonics (language autodetected)
 * Can throw an error if mnemonic is invalid
 *
 * @param {String} BIP39 words
 * @param {Object} opts
 * @param {String} opts.network - default 'livenet'
 * @param {String} opts.passphrase
 * @param {Number} opts.account - default 0
 * @param {String} opts.derivationStrategy - default 'BIP44'
 */
function fromMnemonic(words, opts) {
    var api = new Client();
    api.seedFromMnemonic(words, opts);
    return fromAPI(api);
}

exports.isValidPrivate = isValidPrivate;
exports.isValidPublic = isValidPublic;
exports.privateToPublic = privateToPublic;
exports.privateToAddress = privateToAddress;
exports.Version = Version;
exports.Wif = Wif;
exports.Address = Address;
exports.exportWallet = exportWallet;
exports.importWallet = importWallet;
exports.generate = generate;
exports.generateMnemonic = generateMnemonic;
exports.fromMnemonic = fromMnemonic;