const request = require('superagent')
const moment = require('moment')
const crypto = require('crypto')
const _ = require('lodash')

const APPID = '2f52062921128872'
const SECRET_KEY = 'zECI63Snmxb0zFXYqsa1ty34ABiEvrFt'


// test()
// async function test(){
//     const result = await GetTranslation('en', 'zh', 'This word is very')
//     console.log(result)
// }

async function GetTranslation(src_lan, trg_lan, sentence) {
    const salt = moment().format('x')
    let [from, to] = [src_lan, trg_lan]
    if (from == 'zh' || from == 'cn') from = 'zh-CHS'
    if (to == 'zh' || from == 'cn') to = 'zh-CHS'

    try {
        const res = await request.post('http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule')
        .send({
            i: sentence,
            from: from,
            to: to,
            smartresult: 'dict',
            salt: salt,
            sign: `${hash(sentence, salt)}`,
            client:'fanyideskweb',
            doctype:'json',
            version:'2.1',
            keyfrom:'fanyi.web',
            action:'FY_BY_CLICKBUTTION',
            typoResult:'false'
        })
        .set('Content-Type', 'application/x-www-form-urlencoded;')
        
        const result = JSON.parse(res.text)
        if (result.errorCode != 0){
            // means some error happened
            console.log(result)
            return `Failed:${result.errorCode}`
        }else{
            //let trans_result = _.join(result.translation, ' ')
            let trans_result = ''
            result.translateResult[0].forEach(element => {
                trans_result += element.tgt
            })
            return trans_result
        }
    } catch (error) {
        console.log(error)
    }
    
}


function hash(q, salt) {
    return crypto
        .createHash('md5')
        .update(APPID + q + salt + SECRET_KEY)
        .digest('hex')
}

module.exports = {
    GetTranslation
}