let rows = document.querySelectorAll(".row");
let sixCount = 6;
let sevenCount = 7;
let turns = 1;
let draw = 42;
let gameOver = false;

function generateGameWall() {
    rows.forEach(row =>  {
        for (let i = 1; i <= sevenCount; ++i) {
            let newCell = document.createElement("td");
            let newCircle = document.createElement("div");
            newCell.id = "c" + row.id + i;
            newCell.classList.add("td");
            newCircle.id = row.id + i;
            newCircle.innerText = "0";
            document.getElementById(row.id).appendChild(newCell);
            newCell.appendChild(newCircle);
            if (row.id === "0") {
                newCircle.classList.add("triangle");
                newCircle.addEventListener("click", function () {
                    insertChip(newCircle.id);
                });
            } else {
                newCircle.classList.add("circle");
            }
        }
    });
}

generateGameWall();

let winnerCombo = ["1111", "2222"];
let player = "1";
let playerColor = "red";
let insertSlots = document.querySelectorAll(".triangle");


nextPlayer();

function nextPlayer() {
    insertSlots.forEach(cell => cell.style.borderTopColor = playerColor);
}

function insertChip(id) {
    var col = id[1];
    slideChip(col, playerColor, player);
    if (player === "1") {
        player = "2";
        playerColor = "black";
    } else {
        player = "1";
        playerColor = "red";
    }
}

function slideChip(col, playerColor, player) {
    if (gameOver) {
        return; 
    }
    let lineNo = 1;
    var chipSlide = setInterval (function () {
        let cell = document.getElementById(lineNo.toString() + col);      
        if (cell.innerText === "0" && lineNo <= sixCount) {
            modifyCell(cell, playerColor,player);
            if (lineNo > 1) {
                let prevCell = document.getElementById((lineNo - 1).toString() + col);
                modifyCell(prevCell, "white", "0");
            }
            if (lineNo === sixCount) {
                clearInterval(chipSlide);
                checkForCombo(cell.id, playerColor);
                ++turns;
            }
            ++lineNo;
        } else if (cell.innerText != "0" && lineNo != 1) {
            let prevCell = document.getElementById((lineNo - 1).toString() + col);
            clearInterval(chipSlide);
            modifyCell(prevCell, playerColor, player);
            checkForCombo(prevCell.id, playerColor);
            if (lineNo === 2) {
                let parentCell = document.getElementById("c0" + col);
                let childTriangle = parentCell.querySelector(".triangle");
                parentCell.removeChild(childTriangle);
            }
            ++turns;
        } 
        if (lineNo > sixCount) {
        	clearInterval(chipSlide);
        }
        nextPlayer();
     }, 100);
     console.log(turns);
}

function modifyCell(cell, playerColor, player) {
    cell.style.backgroundColor = playerColor;
    cell.innerText = player;
}

function checkForCombo(id, playerColor) {
    checkHorizontalVertical(id, playerColor);
    checkMainDiagonal(id, playerColor);
    checkSecondDiagonal(id, playerColor);
}

function checkHorizontalVertical(id, playerColor) {
    let cellValues = [];
    for (let i = 1; i <= sevenCount; ++i) {
        let cell = document.getElementById(id[0] + i.toString());
        cellValues += cell.innerText;
    }
    checkWinner(cellValues, playerColor);
    cellValues = [];
    for (let i = 1; i <= sixCount; ++i) {
        let cell = document.getElementById(i.toString() + id[1]);
        cellValues += cell.innerText;
    }
    checkWinner(cellValues, playerColor);
}

function checkMainDiagonal(id, playerColor) {
    let cellValues = [];
    let sumId = Number(id[0]) + Number(id[1]);
    if (sumId <= sevenCount) { /// suma index linie si coloana < 7
        for (let i = sumId - 1, j = 1; i >= 1 && j <= sumId - 1; --i, ++j) {
            let cell = document.getElementById(i.toString() + j.toString());
            cellValues += cell.innerText;
        }
        checkWinner(cellValues, playerColor);
    } else {
        for (let i = sixCount, j = sumId - sixCount; i >= 1 && j <= sevenCount; --i, ++j) {
            let cell = document.getElementById(i.toString() + j.toString());
            cellValues += cell.innerText;
        }
        checkWinner(cellValues, playerColor);
    }
}

function checkSecondDiagonal(id, playerColor) {
    let cellValues = [];
    let diffId = Math.abs(Number(id[0]) - Number(id[1]));
    if (id[0] >= id[1]) { /// index linie > idnex coloana
        for (let i = sixCount, j = sixCount - diffId; i >= 1 + diffId && j >= 1; --i, --j) {
            let cell = document.getElementById(i.toString() + j.toString());
            cellValues += cell.innerText;
        }
        checkWinner(cellValues, playerColor);
    } else {
        for (let i = sevenCount - diffId, j = sevenCount; i >= 1 && j >= 1 + diffId; --i, --j) {
            let cell = document.getElementById(i.toString() + j.toString());
            cellValues += cell.innerText;
        }
        checkWinner(cellValues, playerColor);
    }
}

function checkWinner(cellValues, playerColor) {
    if (cellValues.indexOf(winnerCombo[0]) !== -1 || cellValues.indexOf(winnerCombo[1]) !== -1) {
        document.getElementById("messageBox").innerText = "Player  " + playerColor + " wins!!";
        insertSlots.forEach(triangle => { 
            triangle.removeEventListener("click", insertChip);
        });
        gameOver = true;
    } else if (turns === draw) {
        document.getElementById("messageBox").innerText = "Nobody wins, it's a draw";
    }
}

function restart() {  
    location.reload();
}
