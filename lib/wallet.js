var Bitcore = require('bitcore-lib');
var Utils = require('./utils');

function assert(val, msg) {
    if (!val) {
        throw new Error(msg || 'Assertion failed');
    }
}

// 管理私钥 公钥

var Wallet = function Wallet(priv, pub) {
    if (priv && pub) {
        throw new Error('Cannot supply both a private and a public key to the constructor');
    }

    if (priv && !Utils.isValidPrivate(priv)) {
        throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)');
    }

    if (pub && !Utils.isValidPublic(pub)) {
        throw new Error('Invalid public key');
    }

    this._privKey = priv;
    this._pubKey = pub;
};

Object.defineProperty(Wallet.prototype, 'privKey', {
    get: function get() {
        assert(this._privKey, 'This is a public key only wallet');
        return this._privKey;
    }
});

Object.defineProperty(Wallet.prototype, 'pubKey', {
    get: function get() {
        if (!this._pubKey) {
            this._pubKey = Utils.privateToPublic(this.privKey);
        }
        return this._pubKey;
    }
});


Wallet.prototype.getPrivateKey = function () {
    return this.privKey;
};

Wallet.prototype.getPrivateKeyString = function () {
    return this.getPrivateKey().toString();
};

Wallet.prototype.getPrivateKeyWif = function () {
    return Utils.Wif(this.privKey);
};


Wallet.prototype.Version = function () {
    return Utils.Version(this.privKey, this.pubKey);
};

Wallet.prototype.getPublicKey = function () {
    return this.pubKey;
};

Wallet.prototype.getPublicKeyString = function () {
    return this.pubKey.toString();
};

Wallet.prototype.getAddress = function () {
    return Utils.Address(this.pubKey);
};


Wallet.fromPrivateKey = function (priv) {
    var xPrivKey = new Bitcore.HDPrivateKey(priv)
    return new Wallet(xPrivKey);
};


Wallet.import = function (input, password) {
    var privKey = Utils.importWallet(input, password);

    var wallet = Wallet.fromPrivateKey(privKey);
    return wallet;
};

Wallet.prototype.export = function (password) {
    var x = Utils.exportWallet(this.privKey, password);
    return x;
};

Wallet.generate = function (opts) {
    var privKey = Utils.generate(opts);
    return Wallet.fromPrivateKey(privKey);
};

Wallet.generateMnemonic = function (opts) {
    var privKey = Utils.generateMnemonic(opts);
    return Wallet.fromPrivateKey(privKey);
};

Wallet.fromMnemonic = function (words, opts) {
    var privKey = Utils.fromMnemonic(words, opts);
    return Wallet.fromPrivateKey(privKey);
};

Wallet.prototype.getV3Filename = function (timestamp) {
    /*
     * We want a timestamp like 2016-03-15T17-11-33.007598288Z. Date formatting
     * is a pain in Javascript, everbody knows that. We could use moment.js,
     * but decide to do it manually in order to save space.
     *
     * toJSON() returns a pretty close version, so let's use it. It is not UTC though,
     * but does it really matter?
     *
     * Alternative manual way with padding and Date fields: http://stackoverflow.com/a/7244288/4964819
     *
     */
    var ts = timestamp ? new Date(timestamp) : new Date();

    return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', this.getAddress().toString('hex')].join('');
};

module.exports = Wallet;