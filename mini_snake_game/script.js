var game = {list:[] , way : 0 , pause: false , score : 0 , food : null};

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
    if (game.list.some(e => e.x == newHead.x && e.y == newHead.y)) {
        alert(`Game Over! Your score: ${game.score}`);
        game.list= [{x: Math.floor(Math.random() * 20) , y: Math.floor(Math.random() * 20)}];
        game.score = 0; 
        $("#score").text("Score: " + game.score);
        game.way = 0;
        $("." + game.food.x + "-" + game.food.y).removeClass("food");
        createFood();
        return ;
    }
    game.list.unshift(newHead);

    //check eat food
    if (game.food.x == newHead.x && game.food.y == newHead.y) {
        game.score ++ ;
        $("#score").text("Score: " + game.score);
        $("." + game.food.x + "-" + game.food.y).removeClass("food");
        createFood();
    }else {
        game.list.pop();
    }


     for (let e of game.list) 
        $("." + e.x + "-" + e.y).addClass("snake");
}


function createFood() {
    let foodx , foody ;
    do {
         foodx = Math.floor(Math.random() * 20);
    foody = Math.floor(Math.random() * 20);
    console.log("food " + foodx , foody);
    }while (game.list.some(e => e.x == foodx  && e.y == foody));
    game.food = {x: foodx , y: foody};
    $("." + foodx + "-" + foody).addClass("food");
    }

$(document).ready(function() {
    createGameBoard();
    createFood();
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