//Defining some utility functions

//Detect collission between two rectangles as players
function collissionDetection({
    player1,
    player2
}) {
    return (player1.attackArea.position.x + player1.attackArea.width >= player2.position.x
        && player1.attackArea.position.x <= player2.position.x + player2.width
        && player1.attackArea.position.y + player1.attackArea.height >= player2.position.y
        && player1.attackArea.position.y <= player2.position.y + player2.height)

}

//Detection collission between the bottle & player
function getBottleDetection({
    player,
    bottle
}) {

    if (player.position.x + player.width >= bottle.position.x
        && player.position.x <= bottle.position.x + 50 //50 == bottle width and height
        && player.position.y + player.height >= bottle.position.y
        && player.position.y <= bottle.position.y + 50) {
        console.log("GOT BOTTLE")
        return true;
    } else {
        // console.log ('condition 1: ' + (player.position.x + player.width >= bottle.position.x )
        // + ' condition 2:  ' + ( player.position.x <= bottle.position.x +bottle.width )
        // + 'condition 3: '  + (player.position.y + player.height >= bottle.position.y)
        // + 'condition 4: '  + ( player.position.y <= bottle.position.y + ) )
        //  
        // console.log("bottle width " + bottle.width + " ht  " + bottle.height)
        return false;
    }
}

//Display the winner on-screen
function setWinner({ player1, player2, timerId }) {
    clearTimeout(timerId)
    gameOver = true
    document.getElementById("scoreInfo").style.display = 'flex';
    if (player1.health == player2.health) {
        document.getElementById("scoreInfo").innerHTML = "Tie!"
    }
    if (player1.health > player2.health) {
        document.getElementById("scoreInfo").innerHTML = "Player 1 wins!"
    }
    if (player1.health < player2.health) {
        document.getElementById("scoreInfo").innerHTML = "Player 2 wins!"
    }
}

//Countdown the timer
let timerId;
//Countdown the timer
function countDown() {
    if (timer > 0) {
        timerId = setTimeout(countDown, 1000)
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }
    else {
        setWinner({
            player1: player1,
            player2: player2,
            timerId
        });

    }
}
function clearCountDown() {
    clearTimeout(timerId)
}

function playerInBoundsForLeft(player) {
    if (player.position.x < -20) {
        return false;
    } else {
        return true;
    }
}

function playerInBoundsForRight(player) {
    if (player.position.x > 880) {
        return false;
    } else {
        return true;
    }
}

function playerInBoundsForJump(player) {
    if (player.position.y < 0) {
        return false;
    } else {
        return true;
    }
}


function forceSwitchFall(player) {
    player.image = player.sprites.fall.image
    player.framesMax = player.sprites.fall.framesMax
    player.framesCurrent = 0;
}

function generateRandom(min = 0, max = 100) {
    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor(rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

function updatePlayer1HealthBar(update) {
    gsap.to('#player1health', {
        width: player1.health + '%'
    })
    if (player1.health > 20) {
        document.getElementById("player1health").style.backgroundColor = " #466734";
    }
    else if (player1.health <= 20) {
        document.getElementById("player1health").style.backgroundColor = "#85231c";
    }
}

function updatePlayer2HealthBar() {
    gsap.to('#player2health', {
        width: player2.health + '%'
    })

    if (player2.health > 20) {
        document.getElementById("player2health").style.backgroundColor = "#4f8868";
    }
    else if (player2.health <= 20) {
        document.getElementById("player2health").style.backgroundColor = "#85231c";
    }
}


function detectArrowCollission() {
    if (player2.firing && (arrow.position.x <= player1.position.x + player1.width) && (arrow.position.x >= player1.position.x) &&
        arrow.position.y >= player1.position.y && arrow.position.y <= player1.position.y + player1.height) {
        return true;
    } else {
        return false;
    }
}


function huntress1RandomAttack() {
    let num = generateRandom(1, 100);

    if (num % 2 == 0) {
        return './imgs/Huntress_1/Sprites/Attack1.png';
    } else {
        return './imgs/Huntress_1/Sprites/Attack2.png';
    }
}