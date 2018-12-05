var Client = require('byteball-wallet/bitcore-wallet-client');

const Mnemonic = require('bitcore-mnemonic');
const wifLib = require('wif');

var api=new Client();

// Import mnemonic
// 导入助记符
api.seedFromMnemonic("ivory fiction brother proud multiply air surprise click female rhythm catch ask",{
    network:"livenet"
});


// 获取助记符
var mnemonic = api.getMnemonic();
console.info(`mnemonics: ${mnemonic}`);

console.info(`credentials: ${JSON.stringify(api.credentials)}`);

console.info(api.Wif());

// export json
console.info(`${api.export()}`);

api.import(JSON.stringify(api.credentials));



console.info(api.getAddress());