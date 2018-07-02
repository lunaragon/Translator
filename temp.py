import pathlib
import sys

CWD = pathlib.Path.cwd()

input_dir = CWD / sys.argv[1]


trans_file = open('google_encn_trans.txt', 'w', encoding='utf8')
for ch_file in input_dir.iterdir():
    filename = ch_file.name
    print(filename)
    for line in open(ch_file, 'r', encoding='utf8'):
        line = line.strip().split('\t')
        try:
            line_number, src_text, trans_text = line[0], line[1], line[2]
            if not line_number or not src_text or not trans_text:
                continue
            trans_file.write('{line_number}\t{src}\t{tran}\t{filename}\n'.format(
                line_number=line_number,
                src=src_text,
                tran=trans_text,
                filename=filename,
            ))
        except Exception as ex:
            print(ex)

