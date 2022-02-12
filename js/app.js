let section = document.querySelector("section");
let add = document.querySelector("form button");

add.addEventListener("click", (e) => {
  //フォームの提出を抑止する
  e.preventDefault();
  //input内容を取得する
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  //input内容をチェック
  {
    let isAnyInvalid = false;
    for (let i = 0; i < form.children.length - 1; i++) {
      form.children[i].style.backgroundColor = "";
      form.children[i].style.border = "";
      console.log(form.children[i].value);
      if (form.children[i].value === "") {
        console.log(`No. ${i} is invalid"`);
        form.children[i].style.backgroundColor = "rgb(255, 218, 219)";
        form.children[i].style.border = "2px solid red";
        isAnyInvalid = true;
        //月不正チェック
      } else {
        form.children[i].style.backgroundColor = "";
        form.children[i].style.border = "";
      }
    }
    if (isAnyInvalid) {
      return;
    }
  }

  // 追加したときの時間を取得
  let currentTime = Date.now();

  //todo elementを新しく作る
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("div");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("div");
  time.innerText = currentTime;
  time.style = "display:none";

  // text展開用
  text.addEventListener("click", (e) => {
    // console.log("onclick");
    if (text.style.width === "90vw") {
      todo.style.flexWrap = "";
      text.style.width = "";
      text.style.maxWidth = "";
      text.style.overflow = "";
      text.style.overflowWrap = "";
      text.style.whiteSpace = "";
    } else {
      todo.style.flexWrap = "wrap";
      text.style.width = "90vw";
      text.style.maxWidth = "90vw";
      text.style.overflow = "visible";
      text.style.overflowWrap = "break-word";
      text.style.whiteSpace = "break-spaces";
    }
  });

  text.appendChild(time);
  todo.appendChild(text);
  section.appendChild(todo);

  //チェックボタン、ゴミ箱ボタンを追加
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.addEventListener("click", (e) => {
    console.log("completeButon is been clicked");
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
    // チェックボタンを押下するたびに、localStorageに最新のclassListを保存する
    let currentTime = todoItem.children[0].children[0].innerText;
    let myList = localStorage.getItem("questionList");
    if (myList !== "[]") {
      let myListArray = JSON.parse(myList);
      let myListArray2 = [];
      myListArray.forEach((item) => {
        if (String(item.todoNo) == currentTime) {
          console.log("item", item.todoClassList);
          item.todoClassList = JSON.stringify(todo.classList);
          myListArray2.push(item);
        } else {
          myListArray2.push(item);
        }
      });
      localStorage.setItem("questionList", JSON.stringify(myListArray2));
    }
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
  trashButton.addEventListener("click", (e) => {
    console.log("trashButon is been clicked");
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      // localstorageからデータを削除
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("questionList"));
      myListArray.forEach((item, index) => {
        if (item.todoText === text) {
          myListArray.splice(index, 1);
          localStorage.setItem("questionList", JSON.stringify(myListArray));
        }
      });
      todoItem.remove(); // todoItemを削除するイベントをanimationが終わった後にするよう設定
      let myList = localStorage.getItem("questionList");
      if (myList === "[]") {
        console.log("listがなくなった");
        let sortButton = document.querySelector(".sort button");
        sortButton.innerText = "何もない";
      }
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  section.appendChild(todo);

  //表示するまで見た目の変化を設定
  todo.style.animation = "scaleUp 0.3s forwards";

  //myTodo objectを作成
  let myTodo = {
    todoNo: currentTime,
    todoText: todoText,
    todoClassList: JSON.stringify(todo.classList),
  };

  // データを配列に保存する
  let myList = localStorage.getItem("questionList");
  if (myList == null) {
    localStorage.setItem("questionList", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("questionList", JSON.stringify(myListArray));
  }
  console.log(JSON.parse(localStorage.getItem("questionList")));

  // inputを初期化
  for (let i = 0; i < form.children.length - 1; i++) {
    form.children[i].value = "";
  }

  //   console.log(todoText + " " + todoMonth + " " + todoDate);
});

// localStorageからデータをロードする
loadData();
// localStorageからデータをロードする関数
function loadData() {
  let myList = localStorage.getItem("questionList");
  if (myList !== "[]") {
    let myListArray = JSON.parse(myList);

    myListArray.forEach((item) => {
      //todoを作成
      console.log("item", item);
      let todo = document.createElement("div");
      let text = document.createElement("div");
      let classArray = JSON.parse(item.todoClassList);
      //localStorageからclassListを取得
      let classList = "";
      for (const key in classArray) {
        classList = `${classList} ${classArray[key]}`;
      }
      todo.classList = classList;
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("div");
      time.innerText = item.todoNo;
      time.style = "display:none";
      // text展開用
      text.addEventListener("click", (e) => {
        // console.log("onclick");
        if (text.style.width === "90vw") {
          todo.style.flexWrap = "";
          text.style.width = "";
          text.style.maxWidth = "";
          text.style.overflow = "";
          text.style.overflowWrap = "";
          text.style.whiteSpace = "";
        } else {
          todo.style.flexWrap = "wrap";
          text.style.width = "90vw";
          text.style.maxWidth = "90vw";
          text.style.overflow = "visible";
          text.style.overflowWrap = "break-word";
          text.style.whiteSpace = "break-spaces";
        }
      });
      text.appendChild(time);
      todo.appendChild(text);

      //チェックボタン、ゴミ箱ボタンを追加
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fas fa-check"></i>';
      completeButton.addEventListener("click", (e) => {
        console.log("completeButon is been clicked");
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
        // チェックボタンを押下するたびに、localStorageに最新のclassListを保存する
        let currentTime = todoItem.children[0].children[0].innerText;
        let myList = localStorage.getItem("questionList");
        if (myList !== "[]") {
          let myListArray = JSON.parse(myList);
          let myListArray2 = [];
          myListArray.forEach((item) => {
            if (String(item.todoNo) == currentTime) {
              console.log("item", item.todoClassList);
              item.todoClassList = JSON.stringify(todo.classList);
              myListArray2.push(item);
            } else {
              myListArray2.push(item);
            }
          });
          localStorage.setItem("questionList", JSON.stringify(myListArray2));
        }
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
      trashButton.addEventListener("click", (e) => {
        console.log("trashButon is been clicked");
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
          // localstorageからデータを削除
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("questionList"));
          myListArray.forEach((item, index) => {
            if (item.todoText === text) {
              myListArray.splice(index, 1);
              localStorage.setItem("questionList", JSON.stringify(myListArray));
            }
          });
          todoItem.remove(); // todoItemを削除するイベントをanimationが終わった後にするよう設定
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  } else {
  }
}

// console.log(mergeSort(JSON.parse(localStorage.getItem("questionList"))));
