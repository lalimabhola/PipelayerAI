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

//p1 previous move (dotArray index)
let p1oprev = null;
let p1tprev = null;
//p1 previous move grid values
let p1oprevM = null;
let p1tprevM = null;
//p2 previous move (dotArray index)
let p2oprevM = null;
let p2tprevM = null;
//p2 previous move grid values
let p2oprev = null;
let p2tprev = null;


//** TRACK MOUSE **//

var mouse = {
    x: undefined,
    y: undefined
};

//** CLASSES **//

//function deals with drawing and updating the dots in the game board
//used by first heuristic agent
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

        //only if it is player one's turn
        if (turn === 'p1') {

            //if this is the first move of the game
            if (p2moves === 0 && p1moves === 0) { //do a random move for the first round

                //generate some random number from 0 to 29
                //these correspond the the index of dotArray which hold the circles
                i = genrand(0, 30);
                origin = dotArray[i];
                p1oprevM = origin; //save the move to be used by the heuristic agent

                if ((i >= 25) && (i < 30)) { //right column can't go right
                    //for ease, do not allow virtical moves on the left or right hand side
                    j = i - 5; //go left

                } else if ((i >= 0) && (i <= 4)) { //left column can't go left
                    //for ease, do not allow virtical moves on the left or right hand side
                    j = i + 5; //go right


                } else if ((i % 5) == 4) { //bottom row can't go down

                    if ((i >= 25) && (i < 30)) { //also left col, can't go left
                        j = i + 5; //go right

                    } else if ((i >= 0) && (i <= 4)) { //also right col, can't go right
                        j = i - 5; //go left

                    } else {
                        k = genrand(0, 3);
                        if (k == 0) {
                            j = i - 5; //go left
                        } else if (k == 1) {
                            j = i + 5; //go right
                        } else if (k == 2) {
                            j = i - 1; //go up
                        }
                    }

                } else if ((i % 5) == 0) { //top row can't go up
                    if ((i >= 25) && (i < 30)) { //also left col, can't go left
                        j = i + 5; //go right

                    } else if ((i >= 0) && (i <= 4)) { //also right col, can't go right
                        j = i - 5; //go left

                    } else {
                        k = genrand(0, 3);
                        if (k == 0) {
                            j = i + 5; //go right
                        } else if (k == 1) {
                            j = i + 1; //go down
                        } else if (k == 2) {
                            j = i - 5; //go left
                        }
                    }
                } else { //if not on the edge go in any random direction
                    k = genrand(0, 4);
                    if (k == 0) {
                        j = i + 5; //go right
                    } else if (k == 1) {
                        j = i + 1; //go down
                    } else if (k == 2) {
                        j = i - 5; //go left
                    } else {
                        j = i - 1; //go up
                    }
                }

                //check if valid and create new link if it is
                x = dotArray[j];
                p1tprevM = x; //save move
                if (checkValidMove(x)) {
                    createLink(x);
                }

            //if player two has gone once then this is p1's second turn
            } else if (p2moves == 1) { //if player two has gone - it is p1's second turn

                //if p2 made virtical move
                if (p2oprevM.gx === p2tprevM.gx) {

                    //depending on which column they made the move, block player two in the middle
                    //unless they went in the middle of the column
                    //in which case block them one down from the middle
                    //if they went one down from the middle ensure there is not error from touching one of the middle squares
                    //always save the index of the origin and target

                    //column 1
                    if (p2oprevM.gx === 1) {
                        //middle of column 1 (if p2 didn't go in middle)
                        if ((p2oprevM.gy !== 4 && p2tprevM.gy !== 6) && (p2tprevM.gy !== 4 && p2oprevM.gy !== 6)) {
                            origin = dotArray[2];
                            x = dotArray[7];
                            p1oprev = 2;
                            p1tprev = 7;
                        } else {
                            //middle of column 1 (in case of error)
                            if (p2oprevM.gy === 8 || p2tprevM.gy === 8) {
                                origin = dotArray[2];
                                x = dotArray[7];
                                p1oprev = 2;
                                p1tprev = 7;
                            } else {
                                //one down from middle of column 1
                                origin = dotArray[3];
                                x = dotArray[8];
                                p1oprev = 3;
                                p1tprev = 8;
                            }
                        }
                    }

                    //column 3
                    if (p2oprevM.gx === 3) {
                        //middle of column 3 (if p2 didn't go in middle)
                        if ((p2oprevM.gy !== 4 && p2tprevM.gy !== 6) && (p2tprevM.gy !== 4 && p2oprevM.gy !== 6)) {
                            origin = dotArray[7];
                            x = dotArray[12];
                            p1oprev = 7;
                            p1tprev = 12;
                        } else {
                            //middle of column 3 (in case of error)
                            if (p2oprevM.gy === 8 || p2tprevM.gy === 8) {
                                origin = dotArray[7];
                                x = dotArray[12];
                                p1oprev = 7;
                                p1tprev = 12;
                            } else {
                                //one down from middle of column 3
                                origin = dotArray[8];
                                x = dotArray[13];
                                p1oprev = 8;
                                p1tprev = 13;
                            }
                        }
                    }

                    //column 5
                    if (p2oprevM.gx === 5) {
                        //middle of column 5 (if p2 didn't go in middle)
                        if ((p2oprevM.gy !== 4 && p2tprevM.gy !== 6) && (p2tprevM.gy !== 4 && p2oprevM.gy !== 6)) {
                            origin = dotArray[12];
                            x = dotArray[17];
                            p1oprev = 12;
                            p1tprev = 17;
                        } else {
                            //middle of column 5 (in case of error)
                            if (p2oprevM.gy === 8 || p2tprevM.gy === 8) {
                                origin = dotArray[12];
                                x = dotArray[17];
                                p1oprev = 12;
                                p1tprev = 17;
                            } else {
                                //one down from middle of column 5
                                origin = dotArray[13];
                                x = dotArray[18];
                                p1oprev = 13;
                                p1tprev = 18;
                            }
                        }
                    }

                    //column 7
                    if (p2oprevM.gx === 7) {
                        //middle of column 7 (if p2 didn't go in middle)
                        if ((p2oprevM.gy !== 4 && p2tprevM.gy !== 6) && (p2tprevM.gy !== 4 && p2oprevM.gy !== 6)) {
                            origin = dotArray[17];
                            x = dotArray[22];
                            p1oprev = 17;
                            p1tprev = 22;
                        } else {
                            //middle of column 7 (in case of error)
                            if (p2oprevM.gy === 8 || p2tprevM.gy === 8) {
                                origin = dotArray[17];
                                x = dotArray[22];
                                p1oprev = 17;
                                p1tprev = 22;
                            } else {
                                //one down from middle of column 7
                                origin = dotArray[18];
                                x = dotArray[23];
                                p1oprev = 18;
                                p1tprev = 23;
                            }
                        }
                    }

                    //column 9
                    if (p2oprevM.gx === 9) {
                        //middle of column 9 (if p2 didn't go in middle)
                        if ((p2oprevM.gy !== 4 && p2tprevM.gy !== 6) && (p2tprevM.gy !== 4 && p2oprevM.gy !== 6)) {
                            origin = dotArray[22];
                            x = dotArray[27];
                            p1oprev = 22;
                            p1tprev = 27;
                        } else {
                            //middle of column 9 (in case of error)
                            if (p2oprevM.gy === 8 || p2tprevM.gy === 8) {
                                origin = dotArray[22];
                                x = dotArray[27];
                                p1oprev = 22;
                                p1tprev = 27;
                            } else {
                                //one down from middle of column 9
                                origin = dotArray[23];
                                x = dotArray[28];
                                p1oprev = 23;
                                p1tprev = 28;
                            }
                        }
                    }

                //if p2 made horizontal move go exactly in the center of the game board and save move
                } else if (p2oprevM.gy === p2tprevM.gy) {
                    origin = dotArray[12];
                    x = dotArray[17];
                    p1oprev = 12;
                    p1tprev = 17;
                }

                //if move is valid, make the line and save the move
                if (checkValidMove(x)) {
                    p1oprevM = origin;
                    p1tprevM = x;
                    createLink(x);
                }

            //if player2 has gone twice- this is for player1's third turn
            } else if (p2moves === 2) {

                //try to go left
                origin = dotArray[p1oprev - 5];
                x = dotArray[p1tprev - 5];
                if (checkValidMove(x)) {
                    origin = dotArray[p1oprev - 5];
                    x = dotArray[p1tprev - 5];
                //if you cannot go left try right
                } else {
                    origin = dotArray[p1oprev + 5];
                    x = dotArray[p1tprev + 5];
                    if (checkValidMove(x)) {
                        origin = dotArray[p1oprev + 5];
                        x = dotArray[p1tprev + 5];
                    //otherwise, make a turn move to start going around the block
                    } else {
                        origin = dotArray[p1tprev];
                        x = dotArray[p1oprev - 1]
                    }
                }

                //check if valid and create new link if it is
                if (checkValidMove(x)) {
                    createLink(x);
                }
            }
        }
        //draw new board state
        this.draw();
    }
}

//function deals with drawing and updating the squares in the game board
//used by second heuristic agent
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
                if (p1oprevM.gy === p1tprevM.gy) {

                    //depending on which row they made the move, block player one in the middle
                    //unless they went in the middle of the row
                    //in which case block them one over from the middle
                    //if they went one over from the middle ensure there is not error from touching one of the middle squares
                    //always save the index of the origin and target

                    //row 1
                    if (p1oprevM.gy === 1) {
                        //middle of row 1 (if p1 didn't go in middle)
                        if ((p1oprevM.gx !== 4 && p1tprevM.gx !== 6) && (p1tprevM.gx !== 4 && p1oprevM.gx !== 6)) {
                            origin = dotArray[42];
                            x = dotArray[43];
                            p2oprev = 42;
                            p2tprev = 43;
                        } else {
                            //middle of row 1 (in case of error)
                            if (p1oprevM.gx === 8 || p1tprevM.gx === 8) {
                                origin = dotArray[42];
                                x = dotArray[43];
                                p2oprev = 42;
                                p2tprev = 43;
                            } else {
                                //one over from middle of row 1
                                origin = dotArray[48];
                                x = dotArray[49];
                                p2oprev = 48;
                                p2tprev = 49;
                            }
                        }
                    }

                    //row 3
                    if (p1oprevM.gy === 3) {
                        //middle of row 3 (if p1 didn't go in middle)
                        if ((p1oprevM.gx !== 4 && p1tprevM.gx !== 6) && (p1tprevM.gx !== 4 && p1oprevM.gx !== 6)) {
                            origin = dotArray[43];
                            x = dotArray[44];
                            p2oprev = 43;
                            p2tprev = 44;
                        } else {
                            //middle of row 3 (in case of error)
                            if (p1oprevM.gx === 8 || p1tprevM.gx === 8) {
                                origin = dotArray[43];
                                x = dotArray[44];
                                p2oprev = 43;
                                p2tprev = 44;
                            } else {
                                //one over from middle of row 3
                                origin = dotArray[49];
                                x = dotArray[50];
                                p2oprev = 49;
                                p2tprev = 50;
                            }
                        }
                    }

                    //row 5
                    if (p1oprevM.gy === 5) {
                        //middle of row 5 (if p1 didn't go in middle)
                        if ((p1oprevM.gx !== 4 && p1tprevM.gx !== 6) && (p1tprevM.gx !== 4 && p1oprevM.gx !== 6)) {
                            origin = dotArray[44];
                            x = dotArray[45];
                            p2oprev = 44;
                            p2tprev = 45;
                        } else {
                            //middle of row 5 (in case of error)
                            if (p1oprevM.gx === 8 || p1tprevM.gx === 8) {
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
                    if (p1oprevM.gy === 7) {
                        //middle of row 7 (if p1 didn't go in middle)
                        if ((p1oprevM.gx !== 4 && p1tprevM.gx !== 6) && (p1tprevM.gx !== 4 && p1oprevM.gx !== 6)) {
                            origin = dotArray[45];
                            x = dotArray[46];
                            p2oprev = 45;
                            p2tprev = 46;
                        } else {
                            //middle of row 7 (in case of error)
                            if (p1oprevM.gx === 8 || p1tprevM.gx === 8) {
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
                    if (p1oprevM.gy === 9) {
                        //middle of row 9 (if p1 didn't go in middle)
                        if ((p1oprevM.gx !== 4 && p1tprevM.gx !== 6) && (p1tprevM.gx !== 4 && p1oprevM.gx !== 6)) {
                            origin = dotArray[46];
                            x = dotArray[47];
                            p2oprev = 46;
                            p2tprev = 47;
                        } else {
                            //middle of row 9 (in case of error)
                            if (p1oprevM.gx === 8 || p1tprevM.gx === 8) {
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
                } else if (p1oprevM.gx === p1tprevM.gx) {
                    origin = dotArray[44];
                    x = dotArray[45];
                    p2oprev = 44;
                    p2tprev = 45;
                }
                
                //save finalized move
                p2oprevM = origin;
                p2tprevM = x;

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

                //check if valid and create new link if it is
                if (checkValidMove(x)) {
                    createLink(x);
                }
            }
        }
        //draw new board state
        this.draw();
    }
}

//generates random number within parameter values
function genrand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
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

    if (turn === "p2") {
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

    } else {
        //go through all the circles on the board to see which one was returned
        for (let i = 0; i < 30; i++) {
            //if the object in dot array has the same x and y value that was returned then this is the chose origin
            if (return_val[0] === dotArray[i].gx && return_val[1] === dotArray[i].gy) {
                firstSquare = i;
            //chosen end point/ target spot
            } else if (return_val[2] === dotArray[i].gx && return_val[3] === dotArray[i].gy) {
                secondSquare = i;
            }
        } 
    }

    //set the origin/starting point and the ending point
    origin = dotArray[firstSquare];
    x = dotArray[secondSquare];

    //if move is valid then create the link
    if (checkValidMove(x)) {
        createLink(x);
    } else {
        //otherwise, this move is invalid, try again
        sendCoords(origin.gx, origin.gy, x.gx, x.gy);
        receiveCoords(); //recursive function
    }
    origin = null; //reset origin
}

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

//connects the playGame.py to reset the buffer there
async function resetBuffer() {
    await eel.resetBuffer()();
    reset()
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