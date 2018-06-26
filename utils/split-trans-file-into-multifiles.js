const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')


const ALL_RESULT = new Map()

Main()



async function Main() {
    let [translate_file, translate_dir] = ValidInputParams()
    
    // 读取翻译结果至Map中，用于后续拆分写入文件
    ReadTransFileIntoMemory(translate_file)
    
    // 读取该Map, 写入输出文件
    WriteResultIntoFile(translate_dir)
    
    console.log('Finished')
}


function ReadTransFileIntoMemory(trans_file_path){
    const lines = fs.readFileSync(trans_file_path, 'utf8').replace(/\r/g, '').split('\n')
    for (let index = 0; index < lines.length; index++) {
        const element = lines[index]
        if (!element.trim()) continue
        let [line_number, src, trans, file_name] = element.trim().split('\t')
        if (!line_number || !src || !trans || !file_name) continue

        // 把这些结果全部插入到ALL_RESULT这个对象里面，用来去重排序过滤
        if (!ALL_RESULT.has(file_name)){
            ALL_RESULT.set(file_name, new Map())
        }

        ALL_RESULT.get(file_name).set(Number(line_number), {src, trans})
    }
}


function WriteResultIntoFile(output_dir_path){
    for( let file_name of ALL_RESULT.keys()){
        output_file_path = path.join(output_dir_path, file_name)
        console.log(`Start write result into ${output_file_path}...`)
        output_file = fs.openSync(output_file_path, 'w')

        // sort function provided by lodash
        // read documents at https://www.lodashjs.com/docs/4.17.5.html#sortBy
        const sorted_result = _.sortBy([...ALL_RESULT.get(file_name).entries()], [function (elem){return elem[0]}])
        sorted_result.forEach( element => {
            fs.writeSync(output_file, 
            `${element[0]}\t${element[1].src}\t${element[1].trans}\n`, 'utf8')
        })
        
    }
}


function ValidInputParams(){
    if (process.argv.length !== 4) {
        console.error('Argument number not match!')
        printHelp()
        process.exit()
    }
    
    // change input-translate-file into absolute path
    let translate_file = process.argv[2]
    if (!path.isAbsolute(translate_file)){
        translate_file = path.join(process.cwd(), translate_file)
    }

    if (!fs.existsSync(translate_file)) {
        console.error(`${translate_file} does not exist!`)
        printHelp()
        process.exit()
    }
    if (!fs.statSync(translate_file).isFile()){
        console.error(`${translate_file} is not a file!`)
        printHelp()
        process.exit()
    }

    let translate_dir = process.argv[3]
    if (!path.isAbsolute(translate_dir)){
        translate_dir = path.join(process.cwd(), translate_dir)
    }

    // 输出目录的确定
    if (!fs.existsSync(translate_dir)){
        fs.mkdirpSync(translate_dir)
    }else{
        if (!fs.statSync(translate_dir).isDirectory()){
            console.error(`${translate_dir} is not a directory!`)
            printHelp()
            process.exit()
        }
    }

    return [translate_file, translate_dir]
}


function printHelp(){
    console.log(`node read-src-dir-into-one-file.js translate-file translate-dir
    translate-file 已获取的翻译文件
    translate-dir 拆分后的输出目录`)
}