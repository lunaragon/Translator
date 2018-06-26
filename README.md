# 机器翻译

该工具是用来获取谷歌, 百度, 小牛, 腾讯, 搜狗, 必应, 有道, 360的翻译结果
另外提供了一些前处理和后处理的小脚本

## Requirement and Run

```bash
# Install latest nodejs
git clone https://github.com/lunaragon/translator.git
cd translator
npm install
```

## 处理流程

### **1. `utils`/`read-src-dir-into-one-file.js`**

将待获取翻译的文件放到一个文件夹里面, 文件夹中的每个文件的每一行为一个句子  
该脚本的作用是把这些文件夹中的所有句子读到同一个文件中, 在这个文件中保存句子来源于哪一个文件, 在源文件中的行号

```bash
node utils/read-src-dir-into-one-file.js test/src_files cnen_src.txt
```

### **2. `app.js`**

上一步预处理会生成一个原始待翻译文件, 调用该脚本获取不同产品的翻译结果  
没有做成一键支持多个产品的翻译结果 是因为  

1. 抓取时会因为 **网络原因** 经常失败  
2. 个别产品因不支持API方式, 只能用模拟浏览器的方式实现, 所以 **耗时过长**且 **占用CPU较多**  

基于以上原因, 建议每次调用的时候只获取一家产品的翻译结果

```bash
node app.js --input-file test/cnen_src.txt --output-file test/cnen_baidu_result.txt \
    --from zh --to en --product baidu
```

### **3. `utils`/`split-trans-file-into-multifiles.js`**

将获取的翻译结果文件中的句子按来源进行拆分, 是输出文件个数与源输入文件保持一致

```bash
node utils/split-trans-file-into-multifiles.js translate_file translate_dir
```

## 翻译产品

### 1. 腾讯

### 2. 小牛

### 3. 搜狗

|简称|中文别名|英文别名|
|:---:|:--:|:--|
|zh-CHS|中文|Chinese Simplified|
|en|英语|English|
|ja|日语|Japanese|
|ru|俄语|Russian|
详见 [搜狗翻译文档](http://deepi.sogou.com/docs/fanyiDoc)

### 4. 必应
