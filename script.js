// script.js

document.addEventListener("DOMContentLoaded", function() {
    const images = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg",
                    "6.jpg","7.jpg","8.jpg","9.jpg","10.jpg"]; // 画像ファイルのリスト
    let currentIndex = 0;
    let decision_flag = 0;
    let decisionsData = []; // CSV形式のデータを格納する配列
    
    const imageElement = document.getElementById("image");
    const student_number = document.getElementById("student_number");
    const start_Button = document.getElementById("start_Button");
    const T_Button = document.getElementById("T_Button");
    const F_Button = document.getElementById("F_Button");
    const decision_Button =document.getElementById("decision_Button");
    const download_Button =document.getElementById("download_Button");
    const result = document.getElementById("result");

    // 画像を更新する関数
    function updateImage() {
        if (currentIndex > 10) {
            currentIndex = 0;
            T_Button.classList.add("hidden");
            F_Button.classList.add("hidden");
            decision_Button.classList.add("hidden");
            start_Button.classList.remove("hidden");
            download_Button.classList.remove("hidden");
            student_number.classList.remove("hidden");
            imageElement.src = "";
        }

        if(currentIndex!=0){
            // img要素のsrcに画像ファイル名を設定する
            imageElement.src = "images/" + images[currentIndex-1];
        }
        result.textContent = "";
        decision_flag = 0;
    }

    start_Button.addEventListener("click", function() {
        if(student_number.value!=""){
            T_Button.classList.remove("hidden");
            F_Button.classList.remove("hidden");
            decision_Button.classList.remove("hidden");
            start_Button.classList.add("hidden");
            student_number.classList.add("hidden");
            currentIndex++;
            updateImage();
        }else if(student_number.value==""){
            result.textContent = "学籍番号を入力してください。";
        }
    });  

    T_Button.addEventListener("click", function() {
        result.textContent = "あなたは「良品」と判断しました。";
        console.log("良品と判断しました");  
        decision_flag = 1;   
    });

    F_Button.addEventListener("click", function() {
        result.textContent = "あなたは「不良品」と判断しました。";
        console.log("不良品と判断しました");
        decision_flag = 2;
    });

    decision_Button.addEventListener("click", function() {
        if(decision_flag == 0){
            result.textContent = "良品か不良品かを判断してください"
        }else if(decision_flag == 1){
            // データを保存する
            decisionsData[currentIndex-1] = images[currentIndex-1] + ", 良品";
            currentIndex++;
            updateImage();
        }else if(decision_flag == 2){
            // データを保存する
            decisionsData[currentIndex-1] = images[currentIndex-1] + ", 不良品";
            currentIndex++;
            updateImage();
        }
    });

    // CSV形式のデータをダウンロードする関数
    function downloadCSV() {
        //ダウンロードするCSVファイル名を指定する
        const filename = student_number.value + "_labeltool.csv";
        //CSVデータ
        const data = decisionsData.join("\n");
        //BOMを付与する（Excelでの文字化け対策）
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        //Blobでデータを作成する
        const blob = new Blob([bom, data], { type: "text/csv" });

        //IE10/11用(download属性が機能しないためmsSaveBlobを使用）
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        //その他ブラウザ
        } else {
            //BlobからオブジェクトURLを作成する
            const url = (window.URL || window.webkitURL).createObjectURL(blob);
            //ダウンロード用にリンクを作成する
            const download = document.createElement("a");
            //リンク先に上記で生成したURLを指定する
            download.href = url;
            //download属性にファイル名を指定する
            download.download = filename;
            //作成したリンクをクリックしてダウンロードを実行する
            download.click();
            //createObjectURLで作成したオブジェクトURLを開放する
            (window.URL || window.webkitURL).revokeObjectURL(url);
        }
        student_number.value = "";//前の人の学籍番号のデータを消去
        download_Button.classList.add("hidden");//csvダウンロードボタン非表示
    }

    updateImage();

    // ダウンロードボタンがクリックされたときにCSVをダウンロードする
    document.getElementById("download_Button").addEventListener("click", downloadCSV);
});
