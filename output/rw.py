import xlwt
import pathlib
import sys


CWD = pathlib.Path.cwd()

input_dir = CWD / sys.argv[1]


for item in input_dir.iterdir():
    book = xlwt.Workbook()
    sheet = book.add_sheet("sheet 1")
    index = 0
    for line in open(item, 'r', encoding='utf8'):
        
        line = line.strip().split('\t')
        if len(line) != 3:
            print(index)
            continue
        line_number = line[0]
        src = line[1]
        trans = line[2]

        sheet.write(index, 0, line_number)
        sheet.write(index, 1, src)
        sheet.write(index, 2, trans)
        index += 1

    book.save('{filename}.xls'.format(
        filename=item.stem
    ))






