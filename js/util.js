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

//Display the winner on-screen
function setWinner({player1, player2, timerId}) {
    clearTimeout(timerId)
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
function countDown() {
    if (timer > 0) {
        timerId = setTimeout(countDown, 1000)
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }

    else {
        setWinner({
            player1:player1,
            player2:player2,
            timerId
        });
    }
}