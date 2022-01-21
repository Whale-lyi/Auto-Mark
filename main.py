from flask import Flask, render_template, request, json
from collections import OrderedDict
from cut import cut

app = Flask(__name__)
content = ''


@app.route("/")
def root():

    return render_template("file.html")


@app.route("/submit", methods=['POST'])
def submit():

    global content
    content = request.form.get("input")
    content_list = cut(content)
    return {'message': 'success', 'content': content_list}


@app.route("/save", methods=['POST'])
def save():

    criminals_data = request.form.get("Criminals")
    gender_date = request.form.get("Gender")
    ethnicity_date = request.form.get("Ethnicity")
    birthplace_date = request.form.get("Birthplace")
    accusation_date = request.form.get("Accusation")
    courts_date = request.form.get("Courts")

    dict = OrderedDict()
    dict["Criminals"] = criminals_data
    dict["Gender"] = gender_date
    dict["Ethnicity"] = ethnicity_date
    dict["Birthplace"] = birthplace_date
    dict["Accusation"] = accusation_date
    dict["Courts"] = courts_date

    with open('标注.json', 'w', encoding='utf-8') as json_file:
        json.dump(dict, json_file, ensure_ascii=False, indent=4, sort_keys=False)

    global content
    with open('案件文本.txt', 'w', encoding='gbk') as content_file:
        content_file.write(content)
    return "success"


if __name__ == "__main__":
    app.run(debug=True)
