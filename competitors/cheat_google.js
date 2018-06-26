const translate = require('google-translate-api-cn')

GetTranslation('en', 'zh', 'Why i can use this')
async function GetTranslation(src_lan, trg_lan, sentence) {
    let [from, to] = [src_lan, trg_lan]
    if (from == 'zh') from = 'zh-CN'
    if (to == 'zh') to = 'zh-CN'
    
    try {
        const res = await translate(sentence, {from:from, to:to})
        console.log(res.text)
        return res.text || 'Failed'
        
    } catch (error) {
        console.log(`Get translation of ${sentence} from ${src_lan} to ${trg_lan} failed`)
        throw error
    }
}

module.exports = {
    GetTranslation
}