var Client = require('byteball-wallet/bitcore-wallet-client');

const Mnemonic = require('bitcore-mnemonic');
const wifLib = require('wif');

var api=new Client();


////// 助记符相关

// 创建随机 助记符
// api.seedFromRandomWithMnemonic();

// 导入助记符
api.seedFromMnemonic("ivory fiction brother proud multiply air surprise click female rhythm catch ask",{
    network:"livenet"
});

// 获取助记符
var mnemonic = api.getMnemonic();
console.info(`mnemonics: ${mnemonic}`);

console.info(`credentials: ${JSON.stringify(api.credentials)}`)

console.info(`getDerivedXPrivKey: ${api.credentials.getDerivedXPrivKey()}`)
console.info(`privKey: ${api.credentials.xPrivKey}`) // 返回的是privKey string

///---------------sss--------------------
var privateKey_1=api.credentials.getDerivedXPrivKey();
console.info(`typeof: ${typeof(privateKey_1)} ${JSON.stringify(privateKey_1)}`)
console.info(`privateKey_1 ${privateKey_1.privateKey.bn.toBuffer({size: 32})}`)
var privateBuffer=privateKey_1.privateKey.bn.toBuffer({size: 32});
var prv_wif = wifLib.encode(128, privateBuffer, false); // mainnet
console.info(`prv_wif ${prv_wif}`)
// const wif = wifLib.encode(239, privKeyBuf, false); // testnet
console.info(`wifDecode ${wifLib.decode(prv_wif,128).privateKey}`);
var decodePriveKey=wifLib.decode(prv_wif,128).privateKey;
///---------------sss--------------------



////----------------------- 通俗 ------------
mnemonic = new Mnemonic("ivory fiction brother proud multiply air surprise click female rhythm catch ask");
const xPrivKey = mnemonic.toHDPrivateKey('','livenet');
console.info(`xPrivKey ${xPrivKey}  typeOf ${typeof(xPrivKey)} ${JSON.stringify(xPrivKey)}`);

const path = "m/44'/0'/0'";
const {privateKey} = xPrivKey.derive(path);
console.info(`privKey ${privateKey}`);

const privKeyBuf = privateKey.bn.toBuffer({size: 32});
console.info(`privKeyBuff ${privKeyBuf.toString()}`);

const wif = wifLib.encode(128, privKeyBuf, false); // mainnet
// const wif = wifLib.encode(239, privKeyBuf, false); // testnet
console.info(`wifDecode ${wifLib.decode(wif,128).privateKey}`);
////-----------------------

// 生成地址
var pubkey = api.credentials.getDerivedXPubKey();
var objectHash = require('byteballcore/object_hash.js');
// 设定地址定义脚本，为单签名
var arrDefinition = ["sig", {"pubkey": pubkey}];
var address = objectHash.getChash160(arrDefinition);
console.info(`address ${address}`);

