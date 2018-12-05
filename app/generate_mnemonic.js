var Client = require('byteball-wallet/bitcore-wallet-client');

var api=new Client({
    network:"testnet"
});


////// 助记符相关

// 创建随机 助记符
api.seedFromRandomWithMnemonic();

// 获取助记符
var mnemonic = api.getMnemonic();
console.info(`mnemonics: ${mnemonic}`);

console.info(`credentials: ${JSON.stringify(api.credentials)}`)

console.info(`priv key: ${api.credentials.getDerivedXPrivKey()}`)

// 生成地址
var pubkey = api.credentials.getDerivedXPubKey();
var objectHash = require('byteballcore/object_hash.js');
// 设定地址定义脚本，为单签名
var arrDefinition = ["sig", {"pubkey": pubkey}];
var address = objectHash.getChash160(arrDefinition);
console.info(`address ${address}`);

