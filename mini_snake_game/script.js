var game = {list:[] , way : 0};

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
    for (let e of game.list) 
        $("." + e.x + "-" + e.y).removeClass("snake");
    
    switch(game.way) {
        case 0: {
            // right
            game.list[0].y ++;
            if (game.list[0].y >19) game.list[0].y = 0;
            break ;
        }
        case 1: {
            //down
            game.list[0].x ++;
            if (game.list[0].x >19) game.list[0].x = 0;
            break ;
        }
        case 2: {
            //left
            game.list[0].y-- ;
            if (game.list[0].y <0) game.list[0].y = 19;
            break ;
        }
        default:{
            
            game.list[0].x --;
            if (game.list[0].x <0) game.list[0].x = 19;
            break;
        }
    }

     for (let e of game.list) 
        $("." + e.x + "-" + e.y).addClass("snake");
}

$(document).ready(function() {
    createGameBoard();
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