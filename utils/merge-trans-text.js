/**
 * node merge-trans-text.js 
 *      all_sentence.txt[input] 
 *      trans1.txt[input] trans2.txt[input] 
 *      failed_trans.txt [output]
 *      new_trans.txt[output]
 */

const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const ALL_SENTENCE = new Map()


Main()

async function Main(params) {
    const input_file_path = path.join(process.cwd(), process.argv[2])
    const all_lines = fs.readFileSync(input_file_path, 'utf8').replace(/\r/g, '').split('\n')
    
    // 所有待翻译句子
    for (let index = 0; index < all_lines.length; index++) {
        const element = all_lines[index].trim()
        let [line_number, src_text, file_name]  = element.split('\t')
        if (!line_number || !src_text || !file_name){
            console.log(`Wrong raw line: ${element}`)
            continue
        }

        if (!ALL_SENTENCE.has(file_name)) ALL_SENTENCE.set(file_name, new Map())
        ALL_SENTENCE.get(file_name).set(Number(line_number), {src_text})
    }

    // 已翻译句子1
    const trans_file_path = path.join(process.cwd(), process.argv[3])
    const trans_lines = fs.readFileSync(trans_file_path, 'utf8').replace(/\r/g, '').split('\n')
    for (let j = 0; j < trans_lines.length; j++) {
        const element = trans_lines[j].trim()
        if (!element){
            continue
        }
        let [line_number, src_text, trans_text, file_name] = element.split('\t')
        if (!line_number || !src_text || !trans_text || !file_name){
            console.log(`Wrong trans line: ${element}`)
            continue
        }

        ALL_SENTENCE.get(file_name).get(Number(line_number)).trans_text = trans_text
    }

    // 已翻译句子2
    const trans_file_path2 = path.join(process.cwd(), process.argv[4])
    const trans_lines2 = fs.readFileSync(trans_file_path2, 'utf8').replace(/\r/g, '').split('\n')
    for (let j = 0; j < trans_lines2.length; j++) {
        const element = trans_lines2[j].trim()
        if (!element){
            continue
        }
        let [line_number, src_text, trans_text, file_name] = element.split('\t')
        if (!line_number || !src_text || !trans_text || !file_name){
            console.log(`Wrong trans line: ${element}`)
            continue
        }

        ALL_SENTENCE.get(file_name).get(Number(line_number)).trans_text = trans_text
    }

    // 获取所有未翻译的句子并打印
    const failed_file_path = path.join(process.cwd(), process.argv[5])
    const failed_file = fs.openSync(failed_file_path, 'w')
    for (let [file_name, info] of ALL_SENTENCE.entries()){
        for (let [line_number, context] of ALL_SENTENCE.get(file_name).entries()){
            if (!context.trans_text){
                fs.writeSync(failed_file, `${line_number}\t${context.src_text}\t${file_name}\n`)
            }
        }
    }

    // 获取所有已翻译句子并排序打印
    const new_trans_file_path = path.join(process.cwd(), process.argv[6])
    const new_trans_file = fs.openSync(new_trans_file_path, 'w')
    let failed_number = 0
    for (let file_name of ALL_SENTENCE.keys()){
        // sort function provided by lodash
        // read documents at https://www.lodashjs.com/docs/4.17.5.html#sortBy
        const sorted_result = _.sortBy([...ALL_SENTENCE.get(file_name).entries()], [function (elem){return elem[0]}])
        sorted_result.forEach( element => {
            if (!element[1].trans_text){
                ++failed_number
                return
            }
            fs.writeSync(new_trans_file, 
            `${element[0]}\t${element[1].src_text}\t${element[1].trans_text}\t${file_name}\n`, 'utf8')
        })
    }
    console.log(failed_number)
}