const request = require('superagent')
const crypto = require('crypto')
const Base64 = require('js-base64').Base64

const APPID = '5b1e2922'
const KEY = '600e586c4cba1ebecaf91f9374f68199'

GetTranslation('cn', 'en', '测试中文')
async function GetTranslation(src_lan, trg_lan, sentence) {
    let [from, to] = [src_lan, trg_lan]
    if (from == 'zh') from = 'cn'
    if (to == 'zh') to = 'cn'
    const xpar = Base64.encode(`appid=${APPID}`)
    try {
        const res = await request.get('http://openapi.openspeech.cn/webapi/its.do')
        .query({
            svc: 'its',
            token: '600e586c4cba1ebecaf91f9374f68201',
            q:sentence,
            from:src_lan,
            to:trg_lan,
            sign:md5sum(sentence, xpar, KEY)
        })
        .set('X-Par', xpar)
        .set('Ver', '1.0')

        
        
    } catch (error) {
        result = JSON.parse(Base64.decode(error.rawResponse))
        if (result.errmsg){
            throw error
        }else{
            return result.trans_result.dst
        }
        
    }
    
}


function md5sum(q, xpar, key) {
    return crypto
        .createHash('md5')
        .update(q + xpar + key)
        .digest('hex')
}

module.exports = {
    GetTranslation
}