const game = {
    currentLevel: 1,
    score: 0,
    isPaused: false,
    firstCell: null,
    timeRemaining: 0,
    timerInterval: null,
    gameBoard: []
}
const levels = [
    { level: 1, row: 4, col: 8, time: 200 },
    { level: 2, row: 5, col: 10, time: 200 },
    { level: 3, row: 6, col: 10, time: 200 },
    { level: 4, row: 7, col: 10, time: 200 },
    { level: 5, row: 8, col: 10, time: 200 },
    { level: 6, row: 9, col: 10, time: 200 },
]
function startLevel(num) {
    game.currentLevel = levels[num].level;
    createBoard(levels[num].row, levels[num].col);
}
function createBoard(row, col) {
    let totalPair = (row * col) / 2;
    let totalImg = 36;
    let imgArray = [];

    for (let i = 0; i < totalPair; i++) {
        let imgIndex = i % totalImg;
        imgArray.push(imgIndex, imgIndex);
    }
    shuffleArray(imgArray);

    // ✅ tạo board có 2 lớp viền trống mỗi bên
    let boardData = [];
    let index = 0;
    for (let r = 0; r < row + 4; r++) {
        boardData[r] = [];
        for (let c = 0; c < col + 4; c++) {
            if (r < 2 || r >= row + 2 || c < 2 || c >= col + 2) {
                boardData[r][c] = null;
            } else {
                boardData[r][c] = imgArray[index];
                index++;
            }
        }
    }
    game.gameBoard = boardData;

    // ✅ render từ 2..row+1
    let board = $("#board-game");
    board.empty();

    for (let r = 2; r < row + 2; r++) {
        let tr = $("<tr>");
        for (let c = 2; c < col + 2; c++) {
            let td = $("<td>");
            let img = $("<img>");
            img.attr("src", "./images/pieces" + game.gameBoard[r][c] + ".png");
            img.attr("data-row", r);
            img.attr("data-col", c);
            td.append(img);
            tr.append(td);
        }
        board.append(tr);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

$("#board-game").on("click", "td img", function () {
    handleClick($(this));
});

function handleClick($img) {
    if (game.isPaused) return;

    if (game.firstCell == null) {
        game.firstCell = $img;
        $img.addClass("selected");
    } else {
        if ($img.is(game.firstCell)) return;
        matchCell(game.firstCell, $img);
    }
}

function matchCell($img1, $img2) {
    const r1 = +$img1.attr("data-row");
    const c1 = +$img1.attr("data-col");
    const r2 = +$img2.attr("data-row");
    const c2 = +$img2.attr("data-col");

    const val1 = game.gameBoard[r1][c1];
    const val2 = game.gameBoard[r2][c2];

    // Nếu khác hình thì hủy chọn
    if (val1 !== val2) {
        $img1.removeClass("selected");
        $img2.removeClass("selected");
        game.firstCell = null;
        return;
    }

    // Nếu giống hình, kiểm tra có nối được không
    if (canConnect(r1, c1, r2, c2)) {
        // Ẩn 2 hình
        $img1.css("visibility", "hidden");
        $img2.css("visibility", "hidden");
        // Xóa trong gameBoard
        game.gameBoard[r1][c1] = null;
        game.gameBoard[r2][c2] = null;
        // Cộng điểm
        game.score += 10;
        console.log("+10 điểm. Tổng:", game.score);
    } else {
        console.log("Không nối được");
        $img1.removeClass("selected");
        $img2.removeClass("selected");
    }

    game.firstCell = null;
}
function canConnect(r1, c1, r2, c2) {
    const path = findPath(r1, c1, r2, c2);
    // Đường đi hợp lệ nếu có ít nhất 2 điểm (2 đầu) và không quá 4 (3 đoạn)
    return path.length >= 2 && path.length <= 4;
}

function findPath(r1, c1, r2, c2) {
    const board = game.gameBoard;
    const rowCount = board.length;
    const colCount = board[0].length;

    // 0 = trống, 1 = có hình
    const e = Array.from({ length: rowCount }, () =>
        Array.from({ length: colCount }, () => 0)
    );

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            e[i][j] = board[i][j] != null ? 1 : 0;
        }
    }

    let s = new Point(r1, c1);
    const t = new Point(r2, c2);
    const dx = [-1, 0, 1, 0];
    const dy = [0, 1, 0, -1];
    const q = [];
    const trace = Array.from({ length: rowCount }, () =>
        Array.from({ length: colCount }, () => new Point(-1, -1))
    );

    q.push(t);
    trace[t.x][t.y] = new Point(-2, -2);
    e[s.x][s.y] = 0;
    e[t.x][t.y] = 0;

    while (q.length > 0) {
        const u = q.shift();
        if (u.equals(s)) break;

        for (let i = 0; i < 4; ++i) {
            let x_ = u.x + dx[i];
            let y_ = u.y + dy[i];
            while (
                x_ >= 0 &&
                x_ < rowCount &&
                y_ >= 0 &&
                y_ < colCount &&
                e[x_][y_] === 0
            ) {
                if (trace[x_][y_].x === -1) {
                    trace[x_][y_] = u;
                    q.push(new Point(x_, y_));
                }
                x_ += dx[i];
                y_ += dy[i];
            }
        }
    }

    const res = [];
    if (trace[s.x][s.y].x !== -1) {
        while (s.x !== -2) {
            res.push(new Point(s.x, s.y));
            s = trace[s.x][s.y];
        }
    }
    res.reverse();
    return res;
}

$(document).ready(function () {
    $(".level").on("click", function () {
        let levelNum = parseInt($(this).data("level")) - 1;
        startLevel(levelNum);
    })
    startLevel(0);
});