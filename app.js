const program = require('commander')
const chalk = require('chalk')
const log = console.log
const fs = require('fs-extra')
const path = require('path')
const transModule = require('./transQueue')

const CONFIG = fs.readJsonSync(path.join(__dirname, 'config.json'))
const SUPPORT_LANGUAGES = CONFIG.supported_languages
const SUPPORT_COMPETITORS = CONFIG.supported_competitors



// 命令行添加参数
program
    .version('1.0.0', '-v, --version')
    .option('-i, --input-file <str>', 'File need to translate')
    .option('-o, --output-file <str>', 'Translated output file')
    .option('--from <str>', 'translate source language')
    .option('--to <str>', 'translate target language')
    .option('-p, --product <items>', 'specify the products need to translate [google|youdao|tencent]')
    .option('-c, --concurrency <int>', 'specify the concurrency number, defaults to 5', 5)
    .option('-w, --waiting <int>', 'specify the waiting number, defaults to 100', 100)
    .option('-r, --retries <int>', 'specify the retry times for each job, defaults to 15', 15)
    .parse(process.argv)


Main()


async function Main() {
    // 参数解析
    await ValidateArguments()

    // Run
    const TransQueue = transModule.MakeAsyncQueue(program.concurrency)
    Run(TransQueue)
}


/**
 * 
 * @param {async.AsyncQueue} TransQueue 
 */
async function Run(TransQueue) {
    // 读取待翻译文件
    const lines = fs.readFileSync(program.inputFile, 'utf8').replace(/\r/g, '').split('\n')
    const write_path = path.join(process.cwd(), program.outputFile)
    fs.ensureFileSync(write_path)
    while (lines.length !== 0 ){
        if (TransQueue.length() > program.waiting){
            //console.log('Too much task are waiting in queue, delay 10 senconds to push new task')
            await sleep(10000)
            continue
        }

        const current_line = lines.shift().trim()
        if (!current_line) continue // empty line

        const [line_number, src, file_name] = current_line.split('\t')
        if (!line_number || !src || !file_name) {
            console.log(`Wrong raw line: ${current_line}`)
            continue
        } 

        const task = {
            line_number, 
            sentence:src, 
            input_file_name:file_name,
            write_path,
            src_lan:program.from,
            trg_lan:program.to,
            retries:program.retries,
            product:program.product
        }
        TransQueue.push(task)
    }
    console.log('All task have pushed into translate queue.')
}


async function ValidateArguments() {

    // 检查输入文件是否为空
    if (program.inputFile) {
        if (!fs.existsSync(program.inputFile)) {
            log(chalk.red.bold(`输入文件 ${program.inputFile} 不存在!`))
            process.exit()
        }
        if (!fs.statSync(program.inputFile).isFile()) {
            log(chalk.red.bold(`${program.inputFile} is not a file!`))
            process.exit()
        }
    } else {
        log(chalk.red.bold(`必须指定输入文件!`))
        log(chalk.red('use \n\t--input-file option'))
        process.exit()
    }

    // 检查输出文件
    if (!program.outputFile) {
        log(chalk.red.bold(`必须指定输出文件!`))
        log(chalk.red('use \n\t--output-file option'))
        process.exit()
    }

    // 检查翻译语言是否支持
    if (!program.from) {
        log(`[Argument Error] 未指定翻译的源语言, `)
        log(chalk.red('use \n\t--from option'))
        process.exit()
    } else {
        if (!SUPPORT_LANGUAGES.includes(program.from)) {
            log(`[Value Error] 当前指定的翻译语言不支持`)
            log('支持的语言: ' + chalk.green.bold(`${SUPPORT_LANGUAGES.join(', ')}`))
            process.exit()
        }
    }

    if (!program.to) {
        log(`[Argument Error] 未指定翻译的目标语言, `)
        log(chalk.red('use \n\t-p/--product option'))
        process.exit()
    } else {
        if (!SUPPORT_LANGUAGES.includes(program.from)) {
            log(`[Value Error] 当前指定的翻译语言不支持`)
            log('支持的语言: ' + chalk.green.bold(`${SUPPORT_LANGUAGES.join(', ')}`))
            process.exit()
        }
    }

    // 检查指定的竞品是否在支持的范围之内
    if (!program.product) {
        log(`[Argument Error] 未指定翻译竞品的名称`)
        log(chalk.red('use \n\t--product option'))
        process.exit()
    } else {
        if (!SUPPORT_COMPETITORS.includes(program.product)) {
            log(`[Value Error] 当前指定的竞品不支持`)
            log('支持的竞品: ' + chalk.green.bold(`${SUPPORT_COMPETITORS.join(', ')}`))
            process.exit()
        }
    }
}

function sleep(ms){
    return new Promise(resolve => {setTimeout(resolve, ms)})
}