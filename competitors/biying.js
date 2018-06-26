const request = require('superagent')


const IG = 'a random value'
const IID = 'also'

async function GetTranslation(src_lan, trg_lan, sentence) {
    
    let [from, to] = [src_lan, trg_lan]
    if (from == 'zh' || from == 'cn') from = 'zh-CHS'
    if (to == 'zh' || from == 'cn') to = 'zh-CHS'
    const res = await request.post(
        `https://cn.bing.com/ttranslate?&category=&IG=${IG}&IID=${IID}`
    )
        .set('Content-Type', 'application/x-www-form-urlencoded;')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
        .send({
            text: sentence,
            from: from,
            to: to
        })
    
    const result = JSON.parse(res.text)
    if (result.statusCode != 200){
        throw Error(`Failed to Get translation of ${sentence}`)
    }
    return result.translationResponse
    
}


module.exports = {
    GetTranslation
}