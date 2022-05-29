var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var intervalRender;
var score=0;
var current; // текущая движущаяся форма
var currentX, currentY; // положение текущей формы
var freezed; // установлена ли текущая форма на доске?
var shapes = [ //формы
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// создает новую фигуру 4x4 в глобальной переменной 'current'
// 4x4, чтобы покрыть размер при вращении формы
function newShape() {
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[ id ]; // сохранить идентификатор для заливки цветом
    current = [];
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    
    // новая фигура начинает двигаться
    freezed = false;
    // положение, в котором форма будет развиваться
    currentX = 5;
    currentY = 0;
}

// очищает доску
function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}



// продолжайте движение элемента вниз, создавая новые формы и очищая линии
function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    // если элемент осел
    else {
        freeze();
        valid(0, 1);
        clearLines();
        if (lose) {
            clearAllIntervals();
            return false;
        }
        newShape();
    }
}

// остановите форму в ее положении и закрепите ее на доске
function freeze() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    freezed = true;
}

// возвращает вращает повернутую фигуру 'current' перпендикулярно против часовой стрелки
function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
}

// проверьте, заполнены ли какие-либо строки, и очистите их
function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            document.getElementById( 'clearsound' ).play();
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
            score += 100;
        }
    }
}
function keyPress( key ) { //кнопки
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if (valid(0, 1)) {
                score++;
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
        case 'drop':
            while (valid(0, 1)) {
                score += 10;
                ++currentY;
            }
            tick();
            break;
    }
}

// проверяет, допустима ли результирующая позиция текущей формы
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if (offsetY == 1 && freezed) {




                        lose = true; // проиграть, если текущая фигура установлена в самом верхнем ряду
                        document.getElementById('playbutton').disabled = false;
                    } 
                    return false;
                }
            }
        }
    }
    return true;
}

function playButtonClicked() { //кнопка начать
    score = 0;
    newGame();
    document.getElementById("playbutton").disabled = true;
}

function newGame() { //новая игра
    clearAllIntervals();
    intervalRender = setInterval( render, 30 );
    init();
    newShape();
    lose = false;
    interval = setInterval( tick, 400 );
}

function clearAllIntervals(){
    clearInterval( interval );
    clearInterval( intervalRender );
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(" "+score, 8, 20);
  }
  setInterval(drawScore, 0)