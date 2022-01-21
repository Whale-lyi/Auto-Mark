length = 16;

function ale() {
    var list1 = [];
    var list2=[];
    var list3=[];
    var input = document.getElementById("userInput").value;
    if (!input) {
        alert("输入不能为空！")
    } else {
        $.ajax({
            url:"submit",
            type:"POST",
            data:{input:$("#userInput").val()},
            success: function (result) {
                if (result.message === "success") {
                    var content = result.content;
                    addTitle("名词",true);
                    for (let i=0;i<content[0].length;i++){
                        list1.push(content[0][i]);
                    }
                    show(list1);
                    addTitle("动词",false);
                    for (let i=0;i<content[1].length;i++){
                        list2.push(content[1][i]);
                    }
                    show(list2);
                    addTitle("形容词",false);
                    for (let i=0;i<content[2].length;i++){
                        list3.push(content[2][i]);
                    }
                    show(list3);
                }
            }
        })
    }
    // document.getElementById("userInput").value = "";
    $("#submit").hide();
    $("#fileSave").show();
}


function show(list) {
    for (let k = 1; k <= 6; k++) {
        var father = document.getElementById(k.toString() + k.toString());
        for (let i = 0; i < list.length; i++) {
            let content = list[i];
            let item = document.createElement("input");
            father.appendChild(item);
            item.setAttribute("type", "checkbox");
            item.setAttribute("name", "crime" + k);
            item.setAttribute("value", content);
            if ((i+1) % 4 === 0 && i<list.length-1) {
                father.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+content + "<br> <br>";
            } else {
                let len=(""+content).length;
                father.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+content;
                for (let k=0;k<22-len;k++){
                    father.innerHTML+="&nbsp;";
                }
            }
        }
    }
}

function addTitle(title,isFirst) {
    for (let k = 1; k <= 6; k++) {
        let father = document.getElementById(k.toString() + k.toString());
        if (!isFirst){
            father.innerHTML+="<br> <br>";
        }
        father.innerHTML+="<strong>"+title+"</strong>";
        father.innerHTML+="<br>";
    }
}

function fileDealing() {
    var file = document.getElementById("fileInput");
    var item = file.files[0];
    let textarea = document.getElementById("userInput");
    var reader = new FileReader();
    reader.readAsText(item, "utf-8");
    reader.onload = function () {
        alert("文件已成功上传！");
        textarea.innerHTML += this.result;
    }
}

function fileSaving() {
    let data={
        "Criminals":getSelection("crime1"),
        "Gender":getSelection("crime2"),
        "Ethnicity":getSelection("crime3"),
        "Birthplace":getSelection("crime4"),
        "Accusation":getSelection("crime5"),
        "Courts":getSelection("crime6")
    }
    $.ajax({
        url: "save",
        type: "POST",
        data: data
    })
}

function getSelection(name) {
    let list=document.getElementsByName(name);
    let result="";
    for (let i=0;i<list.length;i++){
        if (list[i].checked===true){
            result+=list[i].value+",";
        }
    }
    result=result.substring(0,result.length-1);
    return result;
}

$("#fileSave").hide();
$("#root").children("div.page").hide();
document.getElementById("l1").style.backgroundColor = "deepskyblue"
$("#11").show();
$("input").change(function () {
    $("#root").children("div").hide();
    var rank = 0;
    $("#root").children("input").each(function () {
        rank++;
        if ($(this).prop("checked")) {
            var cnt = 1;
            setLabelColor(rank);
            $("#root").children("div").each(function () {
                if (cnt === rank) {
                    $(this).slideDown();
                }
                cnt++;
            })
        }
    })
})

function setLabelColor(rank) {
    let labels = document.getElementsByClassName("label");
    for (let i = 0; i < labels.length; i++) {
        labels[i].style.backgroundColor = "white";
        if (i != rank - 1) {
            labels[i].onmouseover = function () {
                labels[i].style.backgroundColor = "deepskyblue";
            }
            labels[i].onmouseout = function () {
                labels[i].style.backgroundColor = "white";
            }
        } else {
            labels[i].onmouseover = "";
            labels[i].onmouseout = "";
        }
    }
    labels[rank - 1].style.backgroundColor = "deepskyblue";
}