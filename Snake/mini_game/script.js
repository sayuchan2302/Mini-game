var game = {
    list:[] ,
    way : 0 ,
    pause: false ,
    score : 0 ,
    food : null ,
    level: 1,
    walls:[]
};
const levels = [
    {level: 1 , target: 1 },
    {level: 2 , target: 2},
    {level: 3 , target: 3 },
    {level: 4 , target: 4 },
    {level: 5 , target: 5 },
    {level: 6 , target: 6 }
]
$("#score").text("Score: " + game.score);
$("#target").text("Target: " + levels[0].target);
function createGameBoard() {
   
    let board = $('#game-board');
    for (let i = 0 ; i < 20; i ++) {
        let tr = $('<tr>');
        for (let j = 0 ; j < 20 ; j ++) {
            let td = $('<td>');
            $(td).addClass(i + "-" + j);
            tr.append(td);
        }
        board.append(tr);
    }

    let i = Math.floor(Math.random() * 20);
    let j = Math.floor(Math.random() * 20);
    game.list.push( {x: i , y: j} );
    
    console.log(i , j);
    $("." + i + "-" + j).addClass("snake");

}
function updateLevel() {
    let currentLevel = levels[game.level -1];
    if (game.score >= currentLevel.target) {
        if (game.level < 6){
            game.level ++ ;
            game.pause = true ;
            $("#target").text("Target: " + levels[game.level -1].target);
            $("#level").text("Level: " + game.level);
    
            alert("Level up :" + game.level ) ;
         clearWalls();
         createWalls(game.level)
        // xoa ran 
        for (let e of game.list) {
            $("." + e.x + "-" + e.y).removeClass("snake");
        }

        // random ran cho level moi
        let newX = Math.floor(Math.random() * 20);
        let newY = Math.floor(Math.random() * 20);
        game.list = [{x : newX , y : newY}];
        $("." + newX + "-" + newY).addClass("snake");
        game.way = 0;
        game.score = 0;
        $("#score").text("Score: " + game.score);
        
        // xoa food cu tao food moi
        $("." + game.food.x + "-" + game.food.y).removeClass("food");
        createFood();
        game.pause = false ;
        }else {
            game.pause = true ;
            alert("You win !")
        }
    } 
}
function createWalls(num) {
    for (let i = 0 ; i < num ; i ++){
        let wallX , wallY ;
        do {
            wallX = Math.floor(Math.random()* 20);
            wallY = Math.floor(Math.random()* 20);
        }while (
            game.list.some(e => e.x == wallX && e.y == wallY) ||
            (game.food && game.food.x == wallX && game.food.y == wallY) ||
            game.walls.some(e => e.x == wallX && e.y == wallY)
        );
        game.walls.push( {x: wallX , y: wallY} );
        $("." + wallX + "-" + wallY).addClass("wall");
    }
}
function clearWalls() {
    for (let e of game.walls) {
        $("." + e.x + "-" + e.y).removeClass("wall");
    }
    game.walls = [];
}
function controls() {
    if (game.pause) return ;

    for (let e of game.list) 
        $("." + e.x + "-" + e.y).removeClass("snake");

    let newHead = {x: game.list[0].x , y: game.list[0].y};

    switch(game.way) {
        case 0: {
            // right
            newHead.y ++;
            if (newHead.y >19) newHead.y = 0;
            break ;
        }
        case 1: {
            //down
            newHead.x ++;
            if (newHead.x >19) newHead.x = 0;
            break ;
        }
        case 2: {
            //left
            newHead.y --;
            if (newHead.y <0) newHead.y = 19;
            break ;
        }
        default:{
            newHead.x --;
            if (newHead.x <0) newHead.x = 19;
            break;
        }
    }

    // check va cham than ran
    if (game.list.some(e => e.x == newHead.x && e.y == newHead.y)) {
        alert("Game over!");
        resetGame();
        return;
    }
    if (game.walls.some(e=> e.x == newHead.x && e.y == newHead.y)) {
        alert("Game over!");
        resetGame();
        return;
    }
    // them dau moi 
    game.list.unshift(newHead);

    //check eat food
    if (game.food.x == newHead.x && game.food.y == newHead.y) {
        game.score ++ ;
        $("#score").text("Score: " + game.score);
        updateLevel();
        $("." + game.food.x + "-" + game.food.y).removeClass("food");
        createFood();
    }else {
        game.list.pop();
    }

     for (let e of game.list) 
        $("." + e.x + "-" + e.y).addClass("snake");
}
function resetGame() {
    clearWalls();
    game.list = [{x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)}];
    game.score = 0;
    game.level = 1;
    $("#score").text("Score: " + game.score);
    $("#level").text("Level: " + game.level);
    $("#target").text("Target: " + levels[0].target);
    game.way = 0;
    $("." + game.food.x + "-" + game.food.y).removeClass("food");
    createFood();
    createWalls(game.level);
}
function createFood() {
    let foodX , foodY ;
    do {
         foodX = Math.floor(Math.random() * 20);
         foodY = Math.floor(Math.random() * 20);
        console.log("food " + foodX , foodY);
    }while (game.list.some(e => e.x == foodX  && e.y == foodY) ||
    game.walls.some(e => e.x == foodX && e.y == foodY)
    );
    game.food = {x: foodX , y: foodY};
    $("." + foodX + "-" + foodY).addClass("food");
}



$(document).ready(function() {
    createGameBoard();
    createFood();
    createWalls(game.level);
    setInterval(() => {
       controls();
    }, 300);
    
    $(document).keydown(function(e) {
        switch(e.keyCode){
            case 37: {
                //left 
                if (game.way !== 0) game.way = 2;
                break;
            }
            case 38: {
                //up
                if (game.way !== 1) game.way = 3;
                break;
            }
            case 39: {
                //right
                if (game.way !== 2) game.way = 0;
                break;
            }
            case 40: {
                //down
                if (game.way !== 3) game.way = 1;
                break;
            }
        }
    });
});