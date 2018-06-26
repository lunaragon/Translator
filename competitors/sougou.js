const request = require('superagent')
const moment = require('moment')
const crypto = require('crypto')
const fs = require('fs-extra')

const PID = '059ad85853c5f20e54508cebf85287cd'
const SECRET_KEY = 'c447fe597dc86f8c586cf7adef9dec21'


async function GetTranslation(src_lan, trg_lan, sentence) {
    const salt = moment().format('x')
    let [from, to] = [src_lan, trg_lan]
    if (src_lan == 'zh') from = 'zh-CHS'
    if (trg_lan == 'zh') to = 'zh-CHS'
    try {
        const res = await request.post('http://fanyi.sogou.com/reventondc/api/sogouTranslate')
        .send({
            q: sentence,
            from: from,
            to: to,
            pid: PID,
            salt: salt,
            sign: `${hash(sentence.trim(), salt)}`
        })
        .set('Content-Type', 'application/x-www-form-urlencoded;')
        
        const result = JSON.parse(res.text)
        if (result.errorCode == 0) {
            //console.log(`${sentence} : ${result.translation}`)
            return result.translation
        } else {
            throw Error(`Get translation of ${sentence} from ${src_lan} to ${trg_lan} failed`)
        }
    } catch (error) {
        throw error
    }
    
}


function hash(q, salt) {
    return crypto
        .createHash('md5')
        .update(PID + q + salt + SECRET_KEY)
        .digest('hex')
}

module.exports = {
    GetTranslation
}