const prompt = require('prompt-sync')();

const board = [
    ['(0,0)', '(0,1)', '(0,2)', '(0,3)'], //0
    ['(1,0)', '(1,1)', '(1,2)', '(1,3)'], //1
    ['(2,0)', '(2,1)', '(2,2)', '(2,3)'], //2
    ['(3,0)', '(3,1)', '(3,2)', '(3,3)']  //3
];

let gamePlay;
let playerName;
let playerLives = 3;
let playerPosition = [0,0];
let collisionPointsArray = [];
let playerMove;
let exitPosition = [0,0];


// Welcome message - asks player for their name and if they wanna play

console.log("Welcome to the Floor Is Lava!");
playerName = prompt('Enter your name: ');
console.log(`Welcome, ${playerName}! If you choose to play, you will be transported to the Land of Lava.`);
console.log("You make your own path but you will only have THREE lives to escape.")
gamePlay = prompt("Do you have what it takes? YES or NO: ")
gamePlay = gamePlay.toLowerCase();


// Logic to start the game or not - In case of invalid input, prompts the player again

// If yes, it will prompt the player to choose first move

if (gamePlay === "yes") {
    let numPoints = Math.floor(Math.random() * 5) + 1;
    generateCollisionPoints(board, 5);
    // console.log(board);
    // console.log(collisionPointsArray);
    // console.log(playerPosition);
    // console.log(exitPosition);
    console.log('You have been transported! You are now in a life or death situation. Choose your steps wisely!');

    while (playerLives > 0) {
        playerMove = prompt('Which way do you want to move? (forward/back/left/right): ');
        playerMove = playerMove.toLowerCase(0);

        if (playerMove === "forward" || playerMove === "back" || playerMove === "left" || playerMove === "right") {
            movePlayer(board, playerPosition, playerMove);
        } else {

            while (playerMove !== "forward" && playerMove !== "back" && playerMove !== "left" && playerMove !== "right") {
                playerMove = prompt("Invalid move. Please choose 'forward', 'back', 'left' or 'right': ")
                movePlayer(board, playerPosition, playerMove);
            }
        }
    };

// If the answer is no it sends a message and exits the game
} else if (gamePlay === "no") {
    console.log("Sad to see you go. Come back when you are ready.")
    return;

} else {

    // if answer is invalid, prompts player to choose again
    while (gamePlay !== 'yes' && gamePlay !== 'no') {
        gamePlay = prompt("Invalid answer. Please say 'yes' or 'no'").toLowerCase();
    }

    // Once player chooses a valid option, it starts the game again
    if (gamePlay === "yes") {
        let numPoints = Math.floor(Math.random() * 5) + 1;
        generateCollisionPoints(board, 5);
        // console.log(board);
        // console.log(collisionPointsArray);
        // console.log(playerPosition);
        // console.log(exitPosition);
        console.log('You have been transported! You are now in a life or death situation. Choose your steps wisely!');

        while (playerLives > 0) {
            playerMove = prompt('Which way do you want to move? (forward/back/left/right): ');
            playerMove = playerMove.toLowerCase(0);

            if (playerMove === "forward" || playerMove === "back" || playerMove === "left" || playerMove === "right") {
                movePlayer(board, playerPosition, playerMove);
            } else {

                while (playerMove !== "forward" && playerMove !== "back" && playerMove !== "left" && playerMove !== "right") {
                    playerMove = prompt("Invalid move. Please choose 'forward', 'back', 'left' or 'right': ")
                    movePlayer(board, playerPosition, playerMove);
                }
            }
        };

    } else if (gamePlay === "no") {
        console.log("Sad to see you go. Come back when you are ready.")
        return;

    }
};

// Function to create 'Lava Puddles' - randomly generates an x and a y

function generateCollisionPoints(board, numPoints) {

    playerPosition[0] = Math.floor(Math.random() * board.length);
    playerPosition[1] = Math.floor(Math.random() * board[0].length);

    let exitX = Math.floor(Math.random() * board.length);
    let exitY = Math.floor(Math.random() * board[0].length);


    // Checks that newX and newY aren't the same than the exit point

    while (playerPosition[0] === exitX) {
        exitX = Math.floor(Math.random() * board.length);
    }


    while (playerPosition[1] === exitY) {
        exitY = Math.floor(Math.random() * board[0].length);
    }


    exitPosition[0] = exitX;
    exitPosition[1] = exitY;
    let uniquePoints = 0;


    // Generates 5 unique collision points and stores them in collisionPointsArray
    while (uniquePoints < numPoints) {

        let x = Math.floor(Math.random() * board.length);
        let y = Math.floor(Math.random() * board[0].length);

        if ((x !== playerPosition[0] || y !== playerPosition[1]) &&
            (x !== exitPosition[0] || y !== exitPosition[1]) &&
            !collisionPointExists([x, y])) {
            collisionPointsArray.push([x, y]);
            uniquePoints++;
        }
    }
};


// Function to move the player

function movePlayer(board, playerPos, direction) {

    let [x,y] = playerPos;
    let length = board.length;
    let width = board[0].length;
    let newX = x;
    let newY = y;


    // Checks to see if player move is a valid move on the board. If invalid move --> 'There's a rock in the way...'

    if (direction === 'forward' && x > 0) {
        newX = x - 1;
    } else if (direction === 'back' && x < length - 1){
        newX = x + 1;
    } else if( direction === 'left' && y > 0){
        newY = y - 1;
    } else if (direction = 'right' && y < width -1){
        newY = y + 1;
    } else {
        console.log("There's a rock in your way! Choose another direction")
        return;
    };



    // Checks collisions - If the player collides, looses a life - If player runs out of them --> 'Game over ...' - If right move player can continue until they lose or win
    
    let collided = checkCollision(newX, newY);


    if (collided) {
        playerLives--;
        if (playerLives === 0) {
            console.log("Game Over! You burned to death T.T");
            playerPosition = [newX, newY];
            return;
        };
        console.log(`You stepped into a lava puddle and lost a life! You have ${playerLives} live(s) remaining.`)
        playerPosition = [newX, newY];
        return;
    };


    if( newX === exitPosition[0] && newY === exitPosition[1]){
        console.log(`Congratulatulations ${playerName}! You safely escaped Lava Land, thank you for playing!`)
        process.exit();
    }


    playerPosition = [newX, newY];

    console.log(playerPosition);
    console.log('Good job, that was an awesome move!');

};


function checkCollision(x, y) {
    let checkPoint = [x, y];
    for (let i = 0; i < collisionPointsArray.length; i++) {
        if (checkPoint[0] === collisionPointsArray[i][0] && checkPoint[1] === collisionPointsArray[i][1]) {
            return true;
        }
    }
    return false;

};


function collisionPointExists(point) {
    for (let i = 0; i < collisionPointsArray.length; i++) {
        if (collisionPointsArray[i][0] === point[0] && collisionPointsArray[i][1] === point[1]) {
            return true;
        }
    }
    return false;

};