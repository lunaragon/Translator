const Nightmare = require('nightmare')


async function GetTranslation(src_lan, trg_lan, sentence) {
    
    const nightmare = Nightmare({
        show: false,
        webPreferences:{
            webSecurity:false
        }})
    let [from, to] = [src_lan, trg_lan]
    if (src_lan == 'zh') from = 'zh-CN'
    if (trg_lan == 'zh') to = 'zh-CN'
    const url = `https://translate.google.cn/#${from}/${to}/${sentence}`
    let translate_result = ''
    console.log(url)
    await nightmare
        .goto(url)
        .wait(3000)
        .evaluate(() => {
            return new Promise((resolve, reject) => {
                try {
                    const element = document.querySelector('#result_box')
                    resolve(element.textContent)
                } catch (error) {
                    reject(error)
                }
            })
        })
        .end()
        .then(transText => {
            translate_result = transText
        })
        .catch(error => {
            console.log('error happened')
            throw Error(`Get translation of ${sentence} from ${src_lan} to ${trg_lan} failed`)
        })
    
    
    return translate_result
}

module.exports = {
    GetTranslation
}