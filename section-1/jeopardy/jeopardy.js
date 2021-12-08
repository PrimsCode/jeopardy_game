let categories = [];
let resInfo = [];
const WIDTH = 6;
const HEIGHT = 5;

function getCategoryIds() {
    let catIds = [];    
    while(catIds.length < 6){
        let id = Math.floor(Math.random() * 10000) + 1;
        catIds.push(id);
    }
    return catIds;
}

function getCategory(catId) {
    
    let catData ={};

    //Tried this and it return an Array of Promises - why?
    // let res = await axios.get(`https://jservice.io/api/category?id=${catId}`);
    // console.log(res.data);
    // let catData = res.data;

    //trial #2 - returned an empty array with objects!?!
    // let catData = res.data.map((temp) => ({
    //     id: temp.id,
    //     title: temp.title,
    //     clues_count: temp.clues_count,
    //     clues: temp.clues,
    //   }));
    //   console.log(catData);
    //   categories.push(catData);

    for(i=0; i< resInfo.length; i++){
        if(catId === resInfo[i].data.id){
            Object.assign(catData, resInfo[i].data);
        }           
    }
    categories.push(catData);  
}

 
async function fillTable() {
      
    let gameBoard = document.createElement('table');
    gameBoard.setAttribute("id", "game-board");
    let headerRow = document.createElement('tr');
    headerRow.setAttribute("id", "header-row");
    
    for (let x = 0; x < WIDTH; x++) {
        let headerCell = document.createElement("th");
        let headerTitle = document.createTextNode(categories[x].title);
        headerCell.setAttribute("id", x);
        headerCell.append(headerTitle);
        headerRow.append(headerCell);
      };

    gameBoard.append(headerRow)
        
    for (let x = 0; x < HEIGHT; x++){
        let tableRow = document.createElement("tr");
        for (let y = 0; y < WIDTH; y++){
            let tableCell = document.createElement("td");
            let question = document.createTextNode('?');
            tableCell.setAttribute("id", `${y}-${x}`);
            tableCell.append(question);
            tableRow.append(tableCell);
        }
        gameBoard.append(tableRow);
    }

    $('.game').append(gameBoard);
}

function handleClick(evt) {
    let id = evt.target.id;
    let [y, x] = id.split("-");
    let clue = categories[y].clues[x];
    let text;

    if(!clue.showing){
        text = clue.question;
        clue.showing = "question";        
    } else if (clue.showing === "question"){
        text = clue.answer;
        clue.showing = "answer";
    } else {
        return;
    }

    $(`#${y}-${x}`).html(text);
}

async function setupAndStart() {
    $(".game").empty();
    categories = [];
    resInfo = [];

    let ids = getCategoryIds(); 
    for (let i = 0; i < ids.length ; i++){
        let id = ids[i];
        let res = await axios.get(`https://jservice.io/api/category?id=${id}`);
        resInfo.push(res);
    }
    
    for (let catId of ids){
        getCategory(catId);
    }
    
    fillTable();
    $("table").on("click", "td", handleClick);
}


$("button").on("click", setupAndStart);