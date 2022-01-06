//** Summer Martin, Lalima Bhola, Dom Lamastra **//
//** CSC 380 Pipelayer Project **//

//** INIT VARS **//

//size of circles
var RADIUS = 6;
var DIAMETER = RADIUS * 2;
var SPACING = 45;

//size of squares
var CUBE_HALF = 6;
var CUBE_LENGTH = CUBE_HALF * 2;

//size of padding
var GRID_PADDING = SPACING / 2;
var MOUSE_DISTANCE = 15;

//** GLOBAL VARS **//

//holds the dots and squares
let dots = [];
//holds the links
let lines = [];
//staring position for link
let origin = null;
//count which dot/square we are on for drawing grid
let count = 0;
//colors for the two players
let colours = {
    p1: null,
    p2: null
};
//start with p1
let turn = 'p1';
//moves each player made
let p1moves = 0;
let p2moves = 0;
//p1 previous move
let p1oprev = null;
let p1tprev = null;
//p2 previous move
let p2oprev = null;
let p2tprev = null;

//** TRACK MOUSE **//

var mouse = {
    x: undefined,
    y: undefined
};

//** CLASSES **//

//function deals with drawing and updating the dots in the game board
function Dot(x, y, radius, gx, gy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.gx = gx;
    this.gy = gy;

    //draws the dot shapes on the game board
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        c.fillStyle = 'white';
        c.fill();
    }

    //update when making a move involving the dots
    this.update = function () {
        //expand on hover
        if ((mouse.x - this.x < MOUSE_DISTANCE && mouse.x - this.x > -MOUSE_DISTANCE &&
            mouse.y - this.y < MOUSE_DISTANCE && mouse.y - this.y > -MOUSE_DISTANCE) ||
            origin === this) {
            this.radius = RADIUS * 1.5;
        } else {
            this.radius = RADIUS;
        }

        //handle click
        if (click.x < this.x + this.radius && click.x > this.x - this.radius &&
            click.y < this.y + this.radius && click.y > this.y - this.radius) {

            if (origin) {
                //if user move is valid create link
                if (checkValidMove(this)) {
                    //save this move to be used by agent
                    p1oprev = origin;
                    p1tprev = this;
                    createLink(this);
                } else {
                    //reset origin
                    origin = null;
                }
            } else {
                origin = this;
            }

            click.x = undefined;
            click.y = undefined;
        }
        //draw the new board state
        this.draw();
    }
}

//function deals with drawing and updating the squares in the game board
//used by heuristic agent
function Box(x, y, hwidth, gx, gy) {
    this.x = x;
    this.y = y;
    this.hwidth = hwidth;
    this.gx = gx;
    this.gy = gy;

    //draw the square shapes on the game board
    this.draw = function () {
        c.beginPath();
        //this is the starting point for where to draw the box
        c.rect(this.x - CUBE_HALF, this.y - CUBE_HALF, this.hwidth * 2, this.hwidth * 2);
        c.fillStyle = 'white';
        c.fill();
    }

    //update when making a move involving the squares
    this.update = function () {
        //only do if it is player two's turn
        if (turn === 'p2') {
            //if player1 has only gone once- this is for player2's first turn
            if (p1moves == 1) {
                //if player one made a horizontal move
                if (p1oprev.gy === p1tprev.gy) {

                    //depending on which row they made the move, block player one in the middle
                    //unless they went in the middle of the row
                    //in which case block them one over from the middle
                    //if they went one over from the middle ensure there is not error from touching one of the middle squares

                    //row one
                    if (p1oprev.gy === 1) {
                        //middle of row 1 (if p1 didn't go in middle)
                        if ((p1oprev.gx !== 4 && p1tprev.gx !== 6) && (p1tprev.gx !== 4 && p1oprev.gx !== 6)) {
                            origin = dotArray[42];
                            x = dotArray[43];
                            p2oprev = 42;
                            p2tprev = 43;
                        } else {
                            //middle of row 1 (in case of error)
                            if (p1oprev.gx === 8 || p1tprev.gx === 8) {
                                origin = dotArray[42];
                                x = dotArray[43];
                                p2oprev = 42;
                                p2tprev = 43;
                                //one over from middle of row 1
                            } else {
                                origin = dotArray[48];
                                x = dotArray[49];
                                p2oprev = 48;
                                p2tprev = 49;
                            }
                        }
                    }

                    //row 3
                    if (p1oprev.gy === 3) {
                        //middle of row 3 (if p1 didn't go in middle)
                        if ((p1oprev.gx !== 4 && p1tprev.gx !== 6) && (p1tprev.gx !== 4 && p1oprev.gx !== 6)) {
                            origin = dotArray[43];
                            x = dotArray[44];
                            p2oprev = 43;
                            p2tprev = 44;
                        } else {
                            //middle of row 3 (in case of error)
                            if (p1oprev.gx === 8 || p1tprev.gx === 8) {
                                origin = dotArray[43];
                                x = dotArray[44];
                                p2oprev = 43;
                                p2tprev = 44;
                                //one over from middle of row 3
                            } else {
                                origin = dotArray[49];
                                x = dotArray[50];
                                p2oprev = 49;
                                p2tprev = 50;
                            }
                        }
                    }

                    //row 5
                    if (p1oprev.gy === 5) {
                        //middle of row 5 (if p1 didn't go in middle)
                        if ((p1oprev.gx !== 4 && p1tprev.gx !== 6) && (p1tprev.gx !== 4 && p1oprev.gx !== 6)) {
                            origin = dotArray[44];
                            origin = dotArray[44];
                            x = dotArray[45];
                            p2oprev = 44;
                            p2tprev = 45;
                        } else {
                            //middle of row 5 (in case of error)
                            if (p1oprev.gx === 8 || p1tprev.gx === 8) {
                                origin = dotArray[44];
                                x = dotArray[45];
                                p2oprev = 44;
                                p2tprev = 45;
                            } else {
                                //one over from middle of row 5
                                origin = dotArray[50];
                                x = dotArray[51];
                                p2oprev = 50;
                                p2tprev = 51;
                            }
                        }
                    }

                    //row 7
                    if (p1oprev.gy === 7) {
                        //middle of row 7 (if p1 didn't go in middle)
                        if ((p1oprev.gx !== 4 && p1tprev.gx !== 6) && (p1tprev.gx !== 4 && p1oprev.gx !== 6)) {
                            origin = dotArray[45];
                            origin = dotArray[45];
                            x = dotArray[46];
                            p2oprev = 45;
                            p2tprev = 46;
                        } else {
                            //middle of row 7 (in case of error)
                            if (p1oprev.gx === 8 || p1tprev.gx === 8) {
                                origin = dotArray[45];
                                x = dotArray[46];
                                p2oprev = 45;
                                p2tprev = 46;
                            } else {
                                //one over from middle of row 7
                                origin = dotArray[51];
                                x = dotArray[52];
                                p2oprev = 51;
                                p2tprev = 52;
                            }
                        }
                    }

                    //row 9
                    if (p1oprev.gy === 9) {
                        //middle of row 9 (if p1 didn't go in middle)
                        if ((p1oprev.gx !== 4 && p1tprev.gx !== 6) && (p1tprev.gx !== 4 && p1oprev.gx !== 6)) {
                            origin = dotArray[46];
                            origin = dotArray[46];
                            x = dotArray[47];
                            p2oprev = 46;
                            p2tprev = 47;
                        } else {
                            //middle of row 9 (in case of error)
                            if (p1oprev.gx === 8 || p1tprev.gx === 8) {
                                origin = dotArray[46];
                                x = dotArray[47];
                                p2oprev = 46;
                                p2tprev = 47;
                            } else {
                                //one over from middle of row 9
                                origin = dotArray[52];
                                x = dotArray[53];
                                p2oprev = 52;
                                p2tprev = 53;
                            }
                        }
                    }

                    //if p1 made virticle move go exactly in the center of the game board
                } else if (p1oprev.gx === p1tprev.gx) {
                    origin = dotArray[44];
                    x = dotArray[45];
                    p2oprev = 44;
                    p2tprev = 45;
                }

                //if move is valid, make the line
                if (checkValidMove(x)) {
                    createLink(x);
                }

                //if player1 has gone twice- this is for player2's second turn
            } else if (p1moves === 2) {

                //try to go straight down
                origin = dotArray[p2oprev + 1];
                x = dotArray[p2tprev + 1];
                if (checkValidMove(x)) {
                    origin = dotArray[p2oprev + 1];
                    x = dotArray[p2tprev + 1];
                    //if you can't go straight down, try to go straight up
                } else {
                    origin = dotArray[p2oprev - 1];
                    x = dotArray[p2tprev - 1];
                    if (checkValidMove(x)) {
                        origin = dotArray[p2oprev - 1];
                        x = dotArray[p2tprev - 1];
                        //otherwise, make a turn move to start going around the block
                    } else {
                        origin = dotArray[p2tprev];
                        x = dotArray[p2oprev + 6]
                    }
                }
                //if move is valid, make the link
                if (checkValidMove(x)) {
                    createLink(x);
                }
            }
        }
        //draw new board state
        this.draw();
    }
}

function Link(start, end) {
    //always record links left-right or top-bottom
    if (start.gy === end.gy) { //if horizontal move
        if (start.gx < end.gx) {
            this.start = start;
            this.end = end;
            this.turn = turn;
        } else {
            this.start = end;
            this.end = start;
            this.turn = turn;
        }
    } else { //if vertical move
        if (start.gy < end.gy) {
            this.start = start;
            this.end = end;
            this.turn = turn;

        } else {
            this.start = end;
            this.end = start;
            this.turn = turn;
        }
    }

    //draw the new link
    this.draw = function () {
        c.beginPath();
        c.lineWidth = 5;
        c.moveTo(this.start.x, this.start.y); //starting position
        c.lineTo(this.end.x, this.end.y); //ending position

        //color of line depends on whose turn it is
        if (this.turn == 'p1') {
            c.strokeStyle = '#8443a3';
        } else {
            c.strokeStyle = '#ffba03';
        }
        c.stroke();
    }
}

//** HANDLE LINK **//

//function is active when you have not chosen an ending position yet this is the faded 
//line that is shown and moves with your mouse when you click on a first position
function renderActiveLink() {
    c.beginPath();
    c.lineWidth = 5;
    c.shadowBlur = 0;
    c.moveTo(origin.x, origin.y);
    c.lineTo(mouse.x, mouse.y);
    c.strokeStyle = '#aaa';
    c.stroke();
}

//functions deals with creating and adding a new link the the array and send the
//new link position to python code to be processed
function createLink(target) {
    //create a new link and push to the links array
    var newLink = new Link(origin, target, turn);
    linksArray.push(newLink);

    //send coordinates the the python file
    sendCoords(origin.gx, origin.gy, target.gx, target.gy);
    origin = null;

    //increment the number of moves for the current player
    if (turn === 'p1') {
        p1moves++;

    } else if (turn === 'p2') {
        p2moves++;
    }

    //switch turns once move is completed
    turn = turn === 'p1' ? 'p2' : 'p1';
    document.querySelector('#turn').classList.toggle('p2-turn');

    //after opening moves are completed, get moves from playGame.py
    if (p1moves + p2moves >= 5) {
        receiveCoords();
    }
}

//function is used to ensure user is making an allowed move
function checkValidMove(target) {
    //check this move hasn't already been made
    if (linksArray.find(link =>
        (origin.gx === link.start.gx && origin.gy === link.start.gy &&
            target.gx === link.end.gx && target.gy === link.end.gy) ||
        (origin.gx === link.end.gx && origin.gy === link.end.gy &&
            target.gx === link.start.gx && target.gy === link.start.gy)
    )) return false;

    //only allow player one to use dots and player two to use boxes

    if ((turn === 'p1') && (origin.gx % 2 != 0)) {
        return false;
    }

    if ((turn === 'p2') && (origin.gx % 2 != 1)) {
        return false;
    }

    //only allow moves to adjacent, non-diagonal points
    if (((origin.gx === target.gx - 2 || origin.gx === target.gx + 2) && origin.gy === target.gy) || //x-move
        ((origin.gy === target.gy - 2 || origin.gy === target.gy + 2) && origin.gx === target.gx)) //y-move
    {
        //do not allow for cross overs for horizontal
        if (origin.gx === target.gx) { //if making a virtical line
            if (linksArray.find(link =>
                ((origin.gy + 1 === link.start.gy && origin.gx - 1 === link.start.gx &&
                    origin.gy + 1 === link.end.gy && origin.gx + 1 === link.end.gx) &&
                    (target.gy - 1 === link.start.gy) && (target.gx - 1 === link.start.gx) &&
                    (target.gy - 1 === link.end.gy) && (target.gx + 1 === link.end.gx)) ||
                ((origin.gy + 1 === link.end.gy) && (origin.gx - 1 === link.end.gx) &&
                    (origin.gy + 1 === link.start.gy) && (origin.gx + 1 === link.start.gx) &&
                    (target.gy - 1 === link.end.gy) && (target.gx - 1 === link.end.gx) &&
                    (target.gy - 1 === link.start.gy) && (target.gx + 1 === link.start.gx) ||
                    (target.gy + 1 === link.start.gy && target.gx - 1 === link.start.gx &&
                        target.gy + 1 === link.end.gy && target.gx + 1 === link.end.gx) &&
                    (origin.gy - 1 === link.start.gy) && (origin.gx - 1 === link.start.gx) &&
                    (origin.gy - 1 === link.end.gy) && (origin.gx + 1 === link.end.gx)) ||
                ((target.gy + 1 === link.end.gy) && (target.gx - 1 === link.end.gx) &&
                    (target.gy + 1 === link.start.gy) && (target.gx + 1 === link.start.gx) &&
                    (origin.gy - 1 === link.end.gy) && (origin.gx - 1 === link.end.gx) &&
                    (origin.gy - 1 === link.start.gy) && (origin.gx + 1 === link.start.gx))
            )) return false;
        }
        if (origin.gy === target.gy) { //if making a horizontal line
            if (linksArray.find(link =>
                ((origin.gx + 1 === link.start.gx && origin.gy - 1 === link.start.gy &&
                    origin.gx + 1 === link.end.gx && origin.gy + 1 === link.end.gy) &&
                    (target.gx - 1 === link.start.gx) && (target.gy - 1 === link.start.gy) &&
                    (target.gx - 1 === link.end.gx) && (target.gy + 1 === link.end.gy)) ||
                ((origin.gx + 1 === link.end.gx) && (origin.gy - 1 === link.end.gy) &&
                    (origin.gx + 1 === link.start.gx) && (origin.gy + 1 === link.start.gy) &&
                    (target.gx - 1 === link.end.gx) && (target.gy - 1 === link.end.gy) &&
                    (target.gx - 1 === link.start.gx) && (target.gy + 1 === link.start.gy) ||
                    (target.gx + 1 === link.start.gx && target.gy - 1 === link.start.gy &&
                        target.gx + 1 === link.end.gx && target.gy + 1 === link.end.gy) &&
                    (origin.gx - 1 === link.start.gx) && (origin.gy - 1 === link.start.gy) &&
                    (origin.gx - 1 === link.end.gx) && (origin.gy + 1 === link.end.gy)) ||
                ((target.gx + 1 === link.end.gx) && (target.gy - 1 === link.end.gy) &&
                    (target.gx + 1 === link.start.gx) && (target.gy + 1 === link.start.gy) &&
                    (origin.gx - 1 === link.end.gx) && (origin.gy - 1 === link.end.gy) &&
                    (origin.gx - 1 === link.start.gx) && (origin.gy + 1 === link.start.gy))
            )) return false;
        }
        //do not allow top row or bottom row to make horizontal moves 
        if ((origin.gx === 0 && origin.gx === target.gx) || (origin.gx === 10 && origin.gx === target.gx)) {
            return false;
        }

        //do not allow left most or right most column to make virtical moves
        if ((origin.gy === 0 && origin.gy === target.gy) || (origin.gy === 10 && origin.gy === target.gy)) {
            return false;
        }

        return true;
    }
}

//** HANDLING SOLUTION **//

//asyncronous function sends values to the python code "playGame.py" using eel
async function sendCoords(a, b, c, d) {
    let return_val = true
    //send coordinates and return if there has been a winner
    return_val = await eel.sendCoords(a, b, c, d, turn, p1moves, p2moves, false)();
   
    //if the return value from playGame is 1 then player 1 has won
    if (return_val[1] === 1) {
        //open winner screen for player 1
        window.location.href = 'player1win.html';

    //if the return value from playGame is 2 then player 2 has won
    } else if (return_val[1] === 2) {
        //open winner screen for player 2
        window.location.href = 'player2win.html';
    }
}

//recieve the new location to move from playGame.py using eel
async function receiveCoords() {
    let return_val = []; //received four values: the x and y coordinate of both the start and end point
    let total_moves = p1moves + p2moves;
    //get the return values from the playGame function
    return_val = await eel.receiveCoords(total_moves, turn)();
    let firstSquare = 0;
    let secondSquare = 0;

    //go through all the squares on the board to see which one was returned
    for (let i = 30; i < 60; i++) {
        //if the object in dot array has the same x and y value that was returned then this is the chose origin
        if (return_val[0] === dotArray[i].gx && return_val[1] === dotArray[i].gy) {
            firstSquare = i;
        //chosen end point/ target spot
        } else if (return_val[2] === dotArray[i].gx && return_val[3] === dotArray[i].gy) {
            secondSquare = i;
        }
    }
    //set the origin/starting point and the ending point
    origin = dotArray[firstSquare];
    x = dotArray[secondSquare];

    //if move is valid then create the link
    if (checkValidMove(x)) {
        createLink(x);
    }
    origin = null; //reset origin
}

//for seeing when the mouse moves - espcially for once you have clicked on a position and move the
//mouse around - used to help move the faded line
window.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();

    mouse.x = e.x - rect.left;
    mouse.y = e.y - rect.top;
});

//** TRACK CLICKS **//

//click coordinates
var click = {
    x: undefined,
    y: undefined
};

//listens for when you click on a position
window.addEventListener('mousedown', function (e) {
    var rect = canvas.getBoundingClientRect();

    click.x = e.x - rect.left;
    click.y = e.y - rect.top;

});

//** INITIALIZE CANVAS **//

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
init();

//make the starting game board
function init() {
    //get size and player colors
    count = document.querySelector('#gridSize').value;
    colours.p1 = document.querySelector('#p1Colour').value;
    colours.p2 = document.querySelector('#p2Colour').value;

    var size = GRID_PADDING * 2 //grid padding
        +
        ((RADIUS * 2) * count) //size
        +
        ((SPACING - DIAMETER) * (count - 1)); //spacing

    canvas.width = size;
    canvas.height = size;

    linksArray = [];
    dotArray = [];
    grid(count);

    makeIt();
    //reset playGame.py variables
    reset();
}

//connects the playGame.py to reset the variables in that code
async function reset() {
    await eel.reset()();
}

//draw the circles and the squares on the grid
//separate so they are offset and every other line
function grid(count) {
    //draw the circles
    for (var i = 0; i < count; i++) {
        for (var j = 1; j < count; j++) {
            dotArray.push(new Dot(
                i * SPACING + (GRID_PADDING + RADIUS),
                j * SPACING + (GRID_PADDING + RADIUS),
                RADIUS, i, j));
            j++;
        }
        i++;
    }
    //draw the sqaures
    for (var i = 1; i < count; i++) {
        for (var j = 0; j < count; j++) {
            dotArray.push(new Box(
                i * SPACING + (GRID_PADDING + CUBE_HALF),
                j * SPACING + (GRID_PADDING + CUBE_HALF),
                CUBE_HALF, i, j));
            j++;
        }
        i++;
    }
}

//** UPDATE CANVAS **//

//draw the game board and all its components
function makeIt() {
    requestAnimationFrame(makeIt);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < linksArray.length; i++) {
        linksArray[i].draw();
    }

    if (origin) {
        renderActiveLink();
    }

    for (var i = 0; i < dotArray.length; i++) {
        dotArray[i].update();
    }

}

//** EVENT LISTENERS **//

document.querySelector('#gridSize').addEventListener('change', function () {
    init();
});