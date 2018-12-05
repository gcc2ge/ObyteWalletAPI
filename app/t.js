
try{
    var Bitcore = require('bitcore-lib');
    console.info("bbbbbbbbb")
}
catch(e){ // if byteballcore is a symlink, load bitcore-lib from the main module
    console.info("aaaaaa")
    var Bitcore = loadBitcoreFromNearestParent(module.parent);
}