import jieba
import jieba.analyse
import re

def cut(content):
    content = str(content)
    word_list = content.split('\n')
    court_name = word_list[0]
    gender = ''
    ethnicity = ''
    accusation = ''
    criminal = ''
    count1 = 0
    count2 = 0
    count3 = 0
    for word in word_list:
        if '被告人' in word and count3 == 0:
            count3 = 1
            if '男' in word:
                gender = '男'
            else:
                gender = '女'
            word = word.replace('。', '，')
            word = word.replace('（', '，')
            word = word.replace('）', '，')
            temp = word.split('，')[0]
            if temp[-3] == '人':
                criminal = temp[-2:]
            else:
                criminal = temp[-3:]
        if '族' in word and count2 == 0:
            count2 = 1
            word = word.replace('。', '，')
            temp = word.split('，')
            for t in temp:
                if '族' in t:
                    ethnicity_List = jieba.lcut(t)
                    for tt in ethnicity_List:
                        if '族' in tt:
                            ethnicity = tt
                            break
        if '罪' in word and count1 == 0:
            count1 = 1
            word = word.replace('。', '，')
            temp = word.split('，')
            for t in temp:
                if '罪' in t:
                    accusation_List = jieba.lcut(t)
                    if '罪' in accusation_List:
                        count = accusation_List.index('罪')
                        accusation = ''.join(accusation_List[count-2:count+1])
                    else:
                        for tt in accusation_List:
                            if '罪' in tt:
                                accusation = tt

    obj = re.compile(r'出生于(?P<birthplace>.*?)，', re.S)
    result = obj.finditer(content)
    birthplace_list = []
    for it in result:
        if it not in birthplace_list:
            birthplace_list.append(it.group("birthplace"))

    obj = re.compile(r'被告人(?P<name>.*?)，男', re.S)
    result = obj.finditer(content)
    name_list = []
    for it in result:
        if it not in name_list:
            name_list.append(it.group("name"))

    obj = re.compile(r'被告人(?P<name>.*?)，女', re.S)
    result = obj.finditer(content)
    name_list1 = []
    for it in result:
        if it not in name_list1:
            name_list1.append(it.group("name"))

    my_List = [court_name, criminal, gender] + birthplace_list + name_list + name_list1

    if ethnicity != '':
        my_List.append(ethnicity)
    if accusation != '':
        my_List.append(accusation)
    if '' in my_List:
        my_List.remove('')

    nlist = my_List+jieba.analyse.extract_tags(content, topK=2, allowPOS=('ns', ))
    nlist = list(set(nlist))
    vlist = jieba.analyse.extract_tags(content, topK=5, allowPOS=('v', ))
    vlist = list(set(vlist))
    alist = jieba.analyse.extract_tags(content, topK=3, allowPOS=('a', ))
    alist = list(set(alist))

    return [nlist, vlist, alist]
