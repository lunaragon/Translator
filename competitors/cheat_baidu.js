const request = require('superagent')
const moment = require('moment')
const crypto = require('crypto')
const _ = require('lodash')
const requestv2 = require('request')
const APPID = '2f52062921128872'
const SECRET_KEY = 'zECI63Snmxb0zFXYqsa1ty34ABiEvrFt'


// test()
// async function test(){
//     const result = await GetTranslation('zh', 'en', '你说啥？')
//     //const result = await GetTranslationv2('zh', 'en', '你说啥？')
//     //console.log(result)
// }

async function GetTranslation(src_lan, trg_lan, sentence) {
    const salt = moment().format('x')
    let [from, to] = [src_lan, trg_lan]

    try {
        
        const res = await request.post('http://fanyi.baidu.com/basetrans')
        .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .set('User-Agent', 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36')
        .send({
            query: '你好世界',
            from: 'zh',
            to: 'en'
        })
        
        console.log(res.text)
        
    } catch (error) {
        console.log(error)
    }
    
}


module.exports = {
    GetTranslation
}