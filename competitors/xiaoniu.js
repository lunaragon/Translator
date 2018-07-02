const request = require('superagent')

const APIKEY = 'b928673567030aa0ab4dac61ef8396a1'


// GetTranslation('cn', 'en', '测试中文')
async function GetTranslation(src_lan, trg_lan, sentence) {
    let [from, to] = [src_lan, trg_lan]
    if (from == 'cn') from = 'zh'
    if (to == 'cn') to = 'zh'
    
    try {
        const res = await request.get('http://api.niutrans.vip/NiuTransServer/translation')
        .query({
            from:from,
            src_text:sentence,
            to:to,
            apikey:APIKEY
        })
        // console.log(res.text)
        const result = JSON.parse(res.text)
        if (result.result_code){ // means error happened
            console.log(result.result_msg)
            throw Error('Failed to get translation of ', sentence)
        } else {
            return result.tgt_text
        }

    } catch (error) {
        // console.log(error)
        throw error
    }
    
}

module.exports = {
    GetTranslation
}