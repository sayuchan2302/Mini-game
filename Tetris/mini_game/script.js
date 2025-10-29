const shapes = {
    I: [{ r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 }, { r: 0, c: 7 }],
    L: [{ r: 0, c: 5 }, { r: 1, c: 5 }, { r: 2, c: 5 }, { r: 2, c: 6 }],
    O: [{ r: 0, c: 5 }, { r: 0, c: 6 }, { r: 1, c: 5 }, { r: 1, c: 6 }],
    T: [{ r: 0, c: 5 }, { r: 1, c: 4 }, { r: 1, c: 5 }, { r: 1, c: 6 }],
    Z: [{ r: 0, c: 4 }, { r: 0, c: 5 }, { r: 1, c: 5 }, { r: 1, c: 6 }]
};

let ROWS = 18;
let COLS = 13;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let currentBrick;

function randomBrick() {
    let key = Object.keys(shapes);
    let random = key[Math.floor(Math.random() * key.length)];
    return JSON.parse(JSON.stringify(shapes[random]));
}

function drawBrick(brick) {
    $("#game-board td").removeClass("brick fixed");

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 1) {
                $("#game-board tr").eq(r).find("td").eq(c).addClass("fixed");
            }
        }
    }

    brick.forEach(cell => {
        $("#game-board tr").eq(cell.r).find("td").eq(cell.c).addClass("brick");
    });
}

function moveDown(brick) {
    brick.forEach(cell => cell.r++);
}

function createGameBoard() {
    let board = $("#game-board");
    for (let r = 0; r < ROWS; r++) {
        let tr = $("<tr>");
        for (let c = 0; c < COLS; c++) {
            let td = $("<td>");
            tr.append(td);
        }
        board.append(tr);
    }
}

function clearRows() {
    let rowsCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell === 1)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
            rowsCleared++;
            r++;
        }
    }
    if (rowsCleared > 0) {
        score += rowsCleared * 100;
        $("#score").text("Score : " + score);
    }
}

function rotateBrick(brick) {
    // Không xoay nếu là khối O
    if (brick === null || brick.length === 0) return brick;

    let pivot = brick[1];
    let rotated = brick.map(cell => {
        let dr = cell.r - pivot.r;
        let dc = cell.c - pivot.c;
        return { r: pivot.r - dc, c: pivot.c + dr };
    });

    let invalid = rotated.some(cell =>
        cell.r < 0 || cell.r >= ROWS ||
        cell.c < 0 || cell.c >= COLS ||
        board[cell.r][cell.c] === 1
    );

    return invalid ? brick : rotated;
}

function controlBrick() {
    $(document).keydown(function (e) {
        if (!currentBrick) return;
        let moved = JSON.parse(JSON.stringify(currentBrick));

        if (e.key === "ArrowLeft") {
            moved.forEach(cell => cell.c--);
        } else if (e.key === "ArrowRight") {
            moved.forEach(cell => cell.c++);
        } else if (e.key === "ArrowDown") {
            moved.forEach(cell => cell.r++);
        } else if (e.key === "ArrowUp") {
            moved = rotateBrick(moved);
        } else {
            return;
        }

        let collision = moved.some(cell =>
            cell.c < 0 || cell.c >= COLS ||
            cell.r >= ROWS ||
            board[cell.r][cell.c] === 1
        );

        if (!collision) {
            currentBrick = moved;
            drawBrick(currentBrick);
        }
    });
}

function startGame() {
    currentBrick = randomBrick();
    drawBrick(currentBrick);

    let gameInterval = setInterval(function () {
        if (currentBrick.some(cell => cell.r + 1 >= ROWS || board[cell.r + 1][cell.c] === 1)) {
            currentBrick.forEach(cell => {
                board[cell.r][cell.c] = 1;
            });
            clearRows();
            currentBrick = randomBrick();

            // Kiểm tra Game Over
            if (currentBrick.some(cell => board[cell.r][cell.c] === 1)) {
                clearInterval(gameInterval);
                alert("Game Over! Final Score: " + score);
                return;
            }
        } else {
            moveDown(currentBrick);
        }
        drawBrick(currentBrick);
    }, 300);
}

$(document).ready(function () {
    createGameBoard();
    startGame();
    controlBrick();
});
