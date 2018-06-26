const path = require('path')
const fs = require('fs-extra')

const ALL_SENTENCE = new Map()

/**
 * node failed_result.js all_sentence.txt[input] trans.txt[input] failed_result.txt[output]
 */

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

    // 已翻译句子
    const trans_file_path = path.join(process.cwd(), process.argv[3])
    const trans_lines = fs.readFileSync(trans_file_path, 'utf8').replace(/\r/g, '').split('\n')
    for (let j = 0; j < trans_lines.length; j++) {
        const element = trans_lines[j].trim()
        let [line_number, src_text, trans_text, file_name] = element.split('\t')
        if (!line_number || !src_text || !trans_text || !file_name){
            console.log(`Wrong trans line: ${element}`)
            continue
        }
        if (trans_text == 'undefined'){
            continue
        }
        ALL_SENTENCE.get(file_name).get(Number(line_number)).trans_text = trans_text
    }

    // 获取所有未翻译的句子并打印
    const failed_file_path = path.join(process.cwd(), process.argv[4])
    const failed_file = fs.openSync(failed_file_path, 'w')
    let index = 0
    for (let [file_name, info] of ALL_SENTENCE.entries()){
        for (let [line_number, context] of ALL_SENTENCE.get(file_name).entries()){
            if (!context.trans_text){
                ++index
                fs.writeSync(failed_file, `${line_number}\t${context.src_text}\t${file_name}\n`)
            }
        }
    }
    console.log(index)
}


