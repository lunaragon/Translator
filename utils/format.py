import sys
import pathlib

CWD = pathlib.Path.cwd()

output_ja_file = open(CWD / sys.argv[2] / 'cnen.txt', 'w', encoding='utf8')
output_zh_file = open(CWD / sys.argv[2] / 'encn.txt', 'w', encoding='utf8')
for ch_file in (CWD / sys.argv[1]).iterdir():
    index = 1
    file_base_name = ch_file.name

    for line in open(ch_file, 'r', encoding='utf8'):
        line = line.strip()
        if not line:
            continue
        ja = line.split('\t')[0]
        zh = line.split('\t')[1]
        output_ja_file.write('{line_number}\t{src}\t{file_name}\n'.format(
            line_number=index,
            src=ja,
            file_name=file_base_name
        ))
        output_zh_file.write('{line_number}\t{src}\t{file_name}\n'.format(
            line_number=index,
            src=zh,
            file_name=file_base_name
        ))
        index += 1
    