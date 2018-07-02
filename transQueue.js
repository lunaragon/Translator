const async = require('async')
const Baidu = require('./competitors/baidu')
const Tencent = require('./competitors/tencent')
const XiaoNiu = require('./competitors/xiaoniu')
// const XiaoNiu = require('./competitors/xiaoniu')
const Youdao = require('./competitors/cheat_youdao')
const Google = require('./competitors/cheat_google')
// const Google = require('./competitors/google')
const Sougou = require('./competitors/sougou')
const Qihu = require('./competitors/360')
const Biying = require('./competitors/biying')
const fs = require('fs-extra')

function MakeAsyncQueue(concurrency){
    return async.queue(TransWorker, concurrency)
}


async function TransWorker(task){
    let trans_text = ''
    try {
        if (task.product == 'google'){
            trans_text = await Google.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }else if (task.product == 'tencent'){
            trans_text = await Tencent.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }else if (task.product == 'sougou'){
            trans_text = await Sougou.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }else if (task.product == 'baidu'){
            trans_text = await Baidu.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }else if (task.product == 'biying'){
            trans_text = await Biying.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }else if (task.product == 'youdao'){
            trans_text = await Youdao.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }else if (task.product == 'xiaoniu'){
            trans_text = await XiaoNiu.GetTranslation(task.src_lan, task.trg_lan, task.sentence)
        }
        
        const write_str = `${task.line_number}\t${task.sentence}\t${trans_text}\t${task.input_file_name}\n`
        fs.writeFileSync(task.write_path,
            write_str,{
            encoding:'utf8',
            flag:'a+'
        })
    } catch (error) {
        // console.log(error)
        if (--task.retries != 0){
            TranslateQueue.push(task)
        }else{
            console.log(`Translate line ${task.line_number} of ${task.input_file_name}
                from ${task.src_lan} to ${task.trg_lan} failed after all times`)
            fs.writeFileSync(task.write_path,
                `${task.line_number}\t${task.sentence}\tFailed\t${task.input_file_name}\n`,{
                encoding:'utf8',
                flag:'a+'
            })
        }
    }
}


function sleep(ms){return new Promise(resolve=>setTimeout(resolve, ms))}


module.exports = {
    MakeAsyncQueue
}