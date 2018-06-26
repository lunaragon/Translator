const request = require('superagent')
const moment = require('moment')
const crypto = require('crypto')

const APPID = '20180621000178769'
const SECRET_KEY = 'pyfiX1qNISE0SEoBTW30'


// test()
// async function test(){
//     const result = await GetTranslation('jp', 'zh', '劉コーチは私のコーチです。彼は中国人です。')
//     console.log(result)
// }

async function GetTranslation(src_lan, trg_lan, sentence) {
    const salt = moment().format('x')
    let [from, to] = [src_lan, trg_lan]

    try {
        const res = await request.post('http://api.fanyi.baidu.com/api/trans/vip/translate')
        .send({
            q: sentence,
            from: from,
            to: to,
            appid: APPID,
            salt: salt,
            sign: `${hash(sentence, salt)}`
        })
        .set('Content-Type', 'application/x-www-form-urlencoded;')
        
        const result = JSON.parse(res.text)
        if (result.error_code){
            // means some error happened
            console.log(result)
            return `Failed:${result.error_msg}`
        }else{
            let trans_result = ''
            result.trans_result.forEach(element => {
                trans_result += element.dst
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