const fs = require('fs-extra')
const path = require('path')
const Nightmare = require('nightmare')


const URL = "http://fanyi.qq.com/"
const SOURCE_SELECTOR = "div.textpanel-source-textarea > div.highlight"
const TARGET_SELECTOR = "div.textpanel-target-textblock > span.text-dst"


async function GetTranslation(src_lan, trg_lan, sentence) {
    const nightmare = Nightmare({show: true,
        webPreferences:{  
            webSecurity:false
        }})
    let translate_text = ''
    await nightmare
        .goto(URL)
        .wait(1000)
        .type(SOURCE_SELECTOR, sentence)
        .wait(2000)
        .wait(TARGET_SELECTOR)
        .evaluate((TARGET_SELECTOR) => {
            return new Promise((resolve, reject) => {
                try {
                    const element = document.querySelector(TARGET_SELECTOR)
                    resolve(element.textContent)
                } catch (error) {
                    reject(error)
                }
            })
        }, TARGET_SELECTOR)
        .end()
        .then(transText => {
            translate_text = transText
        })
        .catch(error => {
            console.log('error happened')
            throw Error(`Get translation of ${sentence} from ${src_lan} to ${trg_lan} failed`)
        })
    
    return translate_text
}

module.exports = {
    GetTranslation
}