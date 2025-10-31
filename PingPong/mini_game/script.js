let COLS = 20;
let ROWS = 30;
let paddle = { row: ROWS - 1, col: Math.floor(COLS / 2) - 2, len: 5 };
let ball = { row: ROWS - 2, col: Math.floor(COLS / 2), dirRow: -1, dirCol: 1 };
let score = 0;
function gameBoard() {
    let board = $('#game-board');
    for (let r = 0; r < ROWS; r++) {
        let tr = $("<tr>");
        for (let c = 0; c < COLS; c++) {
            let td = $("<td>");
            tr.append(td);
        }
        board.append(tr);
    }
}
function drawPaddle() {
    for (let i = 0; i < paddle.len; i++) {
        $("#game-board tr").eq(paddle.row).find("td").eq(paddle.col + i).addClass("paddle");
    }
}
function resetGame() {
    ball.row = ROWS - 2;
    ball.col = Math.floor(COLS / 2);
    ball.dirRow = -1;
    ball.dirCol = 1;
    score = 0;
    $("#score").text("Score: " + score);
}

function moveBall() {
    // Xóa vị trí cũ
    $("#game-board tr").eq(ball.row).find("td").eq(ball.col).removeClass("ball");

    // Cập nhật vị trí
    ball.row += ball.dirRow;
    ball.col += ball.dirCol;

    // Kiểm tra va chạm tường
    if (ball.col <= 0 || ball.col >= COLS - 1) ball.dirCol = -ball.dirCol;
    if (ball.row <= 0) ball.dirRow = -ball.dirRow;

    // Va chạm paddle
    if (ball.row === paddle.row - 1 &&
        ball.col >= paddle.col &&
        ball.col <= paddle.col + paddle.len - 1) {
        ball.dirRow = -ball.dirRow; // nảy ngược lên
        updateScore();
    }

    // Nếu bóng rơi xuống đáy → reset hoặc Game Over
    if (ball.row >= ROWS ) {
        alert("Game Over!");
        resetGame();
    }

    drawBall();

}
function updateScore() {
    score += 10;
    $("#score").text("Score: " + score);
}
function drawBall() {
    $("#game-board tr").eq(ball.row).find("td").eq(ball.col).addClass("ball");
}
function control() {
    $(document).keydown(function (e) {
        for (let i = 0; i < paddle.len; i++) {
            $("#game-board tr").eq(paddle.row).find("td").eq(paddle.col + i).removeClass("paddle");
        }
        
        if (e.key === "ArrowLeft" && paddle.col > 0) {
            paddle.col--;
        } else if (e.key === "ArrowRight" && paddle.col + paddle.len < COLS) {
            paddle.col++;
        }
        drawPaddle();
    });
}
$(document).ready(function () {
    gameBoard();
    drawPaddle();
    drawBall();
    control();
    setInterval(moveBall, 60);
})