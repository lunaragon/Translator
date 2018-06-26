const path = require('path')
const fs = require('fs-extra')


Main()

async function Main() {
    input_dir = ValidInputParams()
    const output_file = process.argv[3]
    output_fd = fs.openSync(output_file, 'w')
    const child_items = fs.readdirSync(input_dir)
    for (let index = 0; index < child_items.length; index++) {
        child_file_path = path.join(input_dir, child_items[index])
        //console.log(path.basename(child_file_path))
        if (!fs.statSync(child_file_path).isFile()){
            return console.log(`${child_file_path} is not a file, skip it`)
        }

        const lines = fs.readFileSync(child_file_path, 'utf8').replace(/\r/g, '').split('\n')
        for (let j = 0; j < lines.length; j++) {
            const line = lines[j].trim()
            if (!line){
                continue
            }
            fs.writeSync(output_fd, `${j+1}\t${line || 'Empty line'}\t${path.basename(child_file_path)}\n`)
        }
    }
}


function ValidInputParams(){
    if (process.argv.length !== 4) {
        console.error('Argument number not match!')
        printHelp()
        process.exit()
    }
    // change input-dir into absolute path
    let input_dir = process.argv[2]
    if (!path.isAbsolute(input_dir)){
        input_dir = path.join(process.cwd(), input_dir)
    }

    if (!fs.existsSync(input_dir)) {
        console.error(`${input_dir} does not exist!`)
        printHelp()
        process.exit()
    }
    if (!fs.statSync(input_dir).isDirectory()){
        console.error(`${input_dir} is not a directory!`)
        printHelp()
        process.exit()
    }

    return input_dir
}


function printHelp(){
    console.log(`node read-src-dir-into-one-file.js input-dir output-file
    input-dir 待翻译文件夹路径
    output-file 预处理后输出文件路径`)
}