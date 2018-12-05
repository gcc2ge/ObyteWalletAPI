var prettyjson = require('prettyjson');



var a =`{"version":"1.0t","alt":"2","messages":[{"app":"payment","payload_hash":"+A0y/rjeBQB0VbMbzAMguvXHcUtQA3JyrLqd52VFmD8=","payload_location":"inline","payload":{"inputs":[{"unit":"H2cHdoLZyYUTEISFgLP2UM1M+bwtA4nAxQYljQyT/kg=","message_index":0,"output_index":0}],"outputs":[{"address":"3KGRUVQDV6VIVNHEV2XIO4YUGFCWMYPJ","amount":499998411},{"address":"JEXTINCXBMQOG3O7UGYKGIBBN7LVXO2N","amount":1000}]}}],"authors":[{"address":"3KGRUVQDV6VIVNHEV2XIO4YUGFCWMYPJ","authentifiers":{"r":"4TMvwg2mCeCH5GmBD/o9P8E+FXLuzpOkFuBWWs613BsZIU2hNHzCIU6ovC2IMQt/AwXzHYdZ/nd/zxzjoyBNBg=="},"definition":["sig",{"pubkey":"A/9vLqaQ1tLz1eGcJ3e144KKMJGiPcsGLHBYDsKo2LOj"}]}],"parent_units":["2iYTVOV6/huMRBx1S/i/65qc8ZJuBs12ZQzuofRPCRQ="],"last_ball":"xYR56S78vTyeG4bXoxnuAnB5TfigBirOXx89+lxlX9Y=","last_ball_unit":"xsLzGrSmWH0u3uFvafMrgWCAG2nzqjHUSy//hhB1Kt0=","witness_list_unit":"TvqutGPz3T4Cs6oiChxFlclY92M2MvCvfXR5/FETato=","headers_commission":392,"payload_commission":197,"unit":"kamEOdqytIRD8cPDmvP9KCCBWGrOFt7QB2RTbJLBIk0="}`


var options = {
    noColor: true,
    noAlign: true
};

// console.log(prettyjson.render(a, options));
console.log(prettyjson.renderString(a,options));