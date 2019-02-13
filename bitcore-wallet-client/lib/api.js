/** @namespace Client.API */
'use strict';


var _ = require('lodash');
var $ = require('preconditions').singleton();
var util = require('util');
var events = require('events');
var Bitcore = require('bitcore-lib');

var Common = require('./common');
var Constants = Common.Constants;

var log = require('./log');
var Credentials = require('./credentials');
var Errors = require('./errors/errordefinitions');




/**
 * @desc ClientAPI constructor.
 *
 * @param {Object} opts
 * @constructor
 */
function API(opts) {
	opts = opts || {};
	this.verbose = !!opts.verbose;
	this.timeout = opts.timeout || 50000;

	if (this.verbose)
		log.setLevel('debug');
	else
		log.setLevel('info');
};
util.inherits(API, events.EventEmitter);

API.privateKeyEncryptionOpts = {
  iter: 10000
};


API.prototype.initialize = function(opts, cb) {
  $.checkState(this.credentials);


  return cb();
};



/**
 * Seed from random
 *
 * @param {Object} opts
 * @param {String} opts.network - default 'livenet'
 */
API.prototype.seedFromRandom = function(opts) {
  $.checkArgument(arguments.length <= 1, 'DEPRECATED: only 1 argument accepted.');
  $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: argument should be an options object.');

  opts = opts || {};
  this.credentials = Credentials.create(opts.network || 'livenet', opts.account || 0);
};

/**
 * Seed from random with mnemonic
 *
 * @param {Object} opts
 * @param {String} opts.network - default 'livenet'
 * @param {String} opts.passphrase
 * @param {Number} opts.language - default 'en'
 * @param {Number} opts.account - default 0
 */
API.prototype.seedFromRandomWithMnemonic = function(opts) {
    $.checkArgument(arguments.length <= 1, 'DEPRECATED: only 1 argument accepted.');
    $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: argument should be an options object.');

    opts = opts || {};
    console.log("client: seedFromRandomWithMnemonic " + JSON.stringify(opts));
    this.credentials = Credentials.createWithMnemonic(opts.network || 'livenet', opts.passphrase, opts.language || 'en', opts.account || 0);
};

API.prototype.getMnemonic = function() {
  return this.credentials.getMnemonic();
};

API.prototype.mnemonicHasPassphrase = function() {
  return this.credentials.mnemonicHasPassphrase;
};



API.prototype.clearMnemonic = function() {
  return this.credentials.clearMnemonic();
};


/**
 * Seed from extended private key
 *
 * @param {String} xPrivKey
 */
API.prototype.seedFromExtendedPrivateKey = function(xPrivKey, account) {
  this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey, account);
};


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
API.prototype.seedFromMnemonic = function(words, opts) {
  $.checkArgument(_.isUndefined(opts) || _.isObject(opts), 'DEPRECATED: second argument should be an options object.');

  opts = opts || {};
  this.credentials = Credentials.fromMnemonic(opts.network || 'livenet', words, opts.passphrase, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
};

/**
 * Seed from external wallet public key
 *
 * @param {String} xPubKey
 * @param {String} source - A name identifying the source of the xPrivKey (e.g. ledger, TREZOR, ...)
 * @param {String} entropySourceHex - A HEX string containing pseudo-random data, that can be deterministically derived from the xPrivKey, and should not be derived from xPubKey.
 * @param {Object} opts
 * @param {Number} opts.account - default 0
 * @param {String} opts.derivationStrategy - default 'BIP44'
 */
API.prototype.seedFromExtendedPublicKey = function(xPubKey, source, entropySourceHex, opts) {
  $.checkArgument(_.isUndefined(opts) || _.isObject(opts));

  opts = opts || {};
  this.credentials = Credentials.fromExtendedPublicKey(xPubKey, source, entropySourceHex, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
};


/**
 * Export wallet
 *
 * @param {Object} opts
 * @param {Boolean} opts.noSign
 */
API.prototype.export = function(opts) {
  $.checkState(this.credentials);

  opts = opts || {};

  var output;

  var c = Credentials.fromObj(this.credentials);

  if (opts.noSign) {
    c.setNoSign();
  }

  output = JSON.stringify(c.toObj());

  return output;
}


/**
 * Import wallet
 *
 * @param {Object} str
 * @param {Object} opts
 * @param {String} opts.password If the source has the private key encrypted, the password
 * will be needed for derive credentials fields.
 */
API.prototype.import = function(str, opts) {
  opts = opts || {};
  try {
    var credentials = Credentials.fromObj(JSON.parse(str));
    this.credentials = credentials;
  } catch (ex) {
    throw Errors.INVALID_BACKUP;
  }
};

API.prototype._import = function(cb) {
  $.checkState(this.credentials);


  // First option, grab wallet info from BWS.
  self.openWallet(function(err, ret) {

    // it worked?
    cb(null, ret);

  });
};

/**
 * Import from Mnemonics (language autodetected)
 * Can throw an error if mnemonic is invalid
 *
 * @param {String} BIP39 words
 * @param {Object} opts
 * @param {String} opts.network - default 'livenet'
 * @param {String} opts.passphrase
 * @param {Number} opts.account - default 0
 * @param {String} opts.derivationStrategy - default 'BIP44'
 */
API.prototype.importFromMnemonic = function(words, opts, cb) {
  log.debug('Importing from 12 Words');

  opts = opts || {};
  try {
    this.credentials = Credentials.fromMnemonic(opts.network || 'livenet', words, opts.passphrase, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
  } catch (e) {
    log.info('Mnemonic error:', e);
    return cb(Errors.INVALID_BACKUP);
  };

  this._import(cb);
};

API.prototype.importFromExtendedPrivateKey = function(xPrivKey, cb) {
  log.debug('Importing from Extended Private Key');
  try {
    this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey);
  } catch (e) {
    log.info('xPriv error:', e);
    return cb(Errors.INVALID_BACKUP);
  };

  this._import(cb);
};

/**
 * Import from Extended Public Key
 *
 * @param {String} xPubKey
 * @param {String} source - A name identifying the source of the xPrivKey
 * @param {String} entropySourceHex - A HEX string containing pseudo-random data, that can be deterministically derived from the xPrivKey, and should not be derived from xPubKey.
 * @param {Object} opts
 * @param {Number} opts.account - default 0
 * @param {String} opts.derivationStrategy - default 'BIP44'
 */
API.prototype.importFromExtendedPublicKey = function(xPubKey, source, entropySourceHex, opts, cb) {
  $.checkArgument(arguments.length == 5, "DEPRECATED: should receive 5 arguments");
  $.checkArgument(_.isUndefined(opts) || _.isObject(opts));
  $.shouldBeFunction(cb);

  opts = opts || {};
  log.debug('Importing from Extended Private Key');
  try {
    this.credentials = Credentials.fromExtendedPublicKey(xPubKey, source, entropySourceHex, opts.account || 0, opts.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
  } catch (e) {
    log.info('xPriv error:', e);
    return cb(Errors.INVALID_BACKUP);
  };

  this._import(cb);
};

API.prototype.decryptBIP38PrivateKey = function(encryptedPrivateKeyBase58, passphrase, opts, cb) {
  var Bip38 = require('bip38');
  var bip38 = new Bip38();

  var privateKeyWif;
  try {
    privateKeyWif = bip38.decrypt(encryptedPrivateKeyBase58, passphrase);
  } catch (ex) {
    return cb(new Error('Could not decrypt BIP38 private key', ex));
  }

  var privateKey = new Bitcore.PrivateKey(privateKeyWif);
  var address = privateKey.publicKey.toAddress().toString();
  var addrBuff = new Buffer(address, 'ascii');
  var actualChecksum = Bitcore.crypto.Hash.sha256sha256(addrBuff).toString('hex').substring(0, 8);
  var expectedChecksum = Bitcore.encoding.Base58Check.decode(encryptedPrivateKeyBase58).toString('hex').substring(6, 14);

  if (actualChecksum != expectedChecksum)
    return cb(new Error('Incorrect passphrase'));

  return cb(null, privateKeyWif);
};



/**
 * Open a wallet and try to complete the public key ring.
 *
 * @param {Callback} cb - The callback that handles the response. It returns a flag indicating that the wallet is complete.
 * @fires API#walletCompleted
 */
API.prototype.openWallet = function(cb) {
    $.checkState(this.credentials);
    var self = this;
    if (self.credentials.isComplete() && self.credentials.hasWalletInfo())
        return cb(null, true);

    return cb();
};





/**
 * Return if wallet is complete
 */
API.prototype.isComplete = function() {
  return this.credentials && this.credentials.isComplete();
};

/**
 * Is private key currently encrypted? (ie, locked)
 *
 * @return {Boolean}
 */
API.prototype.isPrivKeyEncrypted = function() {
  return this.credentials && this.credentials.isPrivKeyEncrypted();
};

/**
 * Is private key encryption setup?
 *
 * @return {Boolean}
 */
API.prototype.hasPrivKeyEncrypted = function() {
  return this.credentials && this.credentials.hasPrivKeyEncrypted();
};

/**
 * Is private key external?
 *
 * @return {Boolean}
 */
API.prototype.isPrivKeyExternal = function() {
  return this.credentials && this.credentials.hasExternalSource();
};

/**
 * Get external wallet source name
 *
 * @return {String}
 */
API.prototype.getPrivKeyExternalSourceName = function() {
  return this.credentials ? this.credentials.getExternalSourceName() : null;
};

/**
 * unlocks the private key. `lock` need to be called explicity
 * later to remove the unencrypted private key.
 *
 * @param password
 */
API.prototype.unlock = function(password) {
  try {
    this.credentials.unlock(password);
  } catch (e) {
    throw new Error('Could not unlock:' + e);
  }
};

/**
 * Can this credentials sign a transaction?
 * (Only returns fail on a 'proxy' setup for airgapped operation)
 *
 * @return {undefined}
 */
API.prototype.canSign = function() {
  return this.credentials && this.credentials.canSign();
};



/**
 * sets up encryption for the extended private key
 *
 * @param {String} password Password used to encrypt
 * @param {Object} opts optional: SJCL options to encrypt (.iter, .salt, etc).
 * @return {undefined}
 */
API.prototype.setPrivateKeyEncryption = function(password, opts) {
  this.credentials.setPrivateKeyEncryption(password, opts || API.privateKeyEncryptionOpts);
};

/**
 * disables encryption for private key.
 * wallet must be unlocked
 *
 */
API.prototype.disablePrivateKeyEncryption = function(password, opts) {
  return this.credentials.disablePrivateKeyEncryption();
};

/**
 * Locks private key (removes the unencrypted version and keep only the encrypted)
 *
 * @return {undefined}
 */
API.prototype.lock = function() {
  this.credentials.lock();
};


///// wif
API.prototype.Wif=function () {
	const wifLib = require('wif');
	var privateKey=this.credentials.getDerivedXPrivKey();
	var privateBuffer=privateKey.privateKey.bn.toBuffer({size: 32});
	var version = (this.credentials.network == 'livenet' ? 128 : 239);
	var prv_wif = wifLib.encode(version, privateBuffer, false); // mainnet
	return prv_wif;
};

//// address
API.prototype.getAddress=function () {
	// 生成地址
	var pubkey = this.credentials.getDerivedXPubKey();
	var objectHash = require('../../byteballcore/object_hash.js');
	// 设定地址定义脚本，为单签名
	var arrDefinition = ["sig", {"pubkey": pubkey}];
	var address = objectHash.getChash160(arrDefinition);
	return address;
}

module.exports = API;
