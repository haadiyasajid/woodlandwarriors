const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

//Constants
const GRAVITY = 0.5
const JUMP_FORCE = -15
const GAME_WIDTH = 1024
const GAME_HEIGHT = 576
const MOVEMENT_SPEED = 5
const KEYS = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    Shift: {
        pressed: false
    }

}


const bg = new Sprite( {
    position: {
        x:0, y:0
    },
    imgSrc: './imgs/background.png'
})

canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

//Player 1 will be controlled by A,W,D
const player1 = new Player(
    {
        position: new Position(0, 0),
        velocity: { x: 0, y: 5 }, //initial falling down velocity, will be reset when hitting ground
        color: 'red',
        offset: {
            x: 0,
            y: 0
        }

    }
);

//Player 2 will be controlled by ArrowUp, ArrowLeft, ArrowRight
const player2 = new Player(
    {
        position: new Position(400, 0),
        velocity: { x: 0, y: 20 },
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        }
    }
);

player1.draw();
player2.draw();

function collissionDetection({
    player1,
    player2
}) {
    return (player1.attackBox.position.x + player1.attackBox.width >= player2.position.x
        && player1.attackBox.position.x <= player2.position.x + player2.width
        && player1.attackBox.position.y + player1.attackBox.height >= player2.position.y
        && player1.attackBox.position.y <= player2.position.y + player2.height)

}

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
let timerID
let timer = 60
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

countDown()

function animate() {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    bg.update();
    player1.update()
    player2.update()

    player1.velocity.x = 0
    player2.velocity.x = 0

    //Player 1 animation 
    if (KEYS.a.pressed) {
        player1.velocity.x = -MOVEMENT_SPEED
    } else if (KEYS.d.pressed) {
        player1.velocity.x = MOVEMENT_SPEED
    }

    //Player 2 animation 
    if (KEYS.ArrowLeft.pressed) {
        player2.velocity.x = -MOVEMENT_SPEED
    } else if (KEYS.ArrowRight.pressed) {
        player2.velocity.x = MOVEMENT_SPEED
    }

    //COllission detection - if player1 hit player2
    if (collissionDetection({ player1: player1, player2: player2 }) && player1.isAttacking) {
        console.log("HIT PLAYER 2!!!");
        player2.health -= 20
        document.getElementById('player2health').style.width = player2.health + '%'
        player1.isAttacking = false;
    }

    //Collission detection - if player2 hit player2
    if (collissionDetection({ player1: player2, player2: player1 }) && player2.isAttacking) {
        console.log("HIT PLAYER 1!!!");
        player1.health -= 20
        document.getElementById('player1health').style.width = player1.health + '%'
        player2.isAttacking = false;
    }

    //If health finishes 
    if(player1.health<=0 || player2.health<=0 ) {
        setWinner({
            player1: player1,
            player2: player2,
            timerId
        });
    }

}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //Player 2 controls
        // --- MOvement
        case 'ArrowUp':
            player2.velocity.y = JUMP_FORCE
            KEYS.ArrowUp.pressed = true
            break
        case 'ArrowRight':
            KEYS.ArrowRight.pressed = true
            break
        case 'ArrowLeft':
            KEYS.ArrowLeft.pressed = true
            break
        // ---  Attack
        case ' ':
            // KEYS.Shift.pressed = true
            player2.attack()
            break


        //player 1 controls
        case 'd':
            KEYS.d.pressed = true
            break
        case 'w':
            player1.velocity.y = JUMP_FORCE
            KEYS.w.pressed = true
            break
        case 'a':
            KEYS.a.pressed = true
            break
        // ---  Attack
        case 'Shift':
            KEYS.Shift.pressed = true
            player1.attack()
            break
    }
})

window.addEventListener('keydown', (event) => {
    console.log("You pressed: " + event.key)
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            KEYS.ArrowUp.pressed = false
            break
        case 'ArrowRight':
            KEYS.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            KEYS.ArrowLeft.pressed = false
            break
        case 'd':
            KEYS.d.pressed = false
            break
        case 'w':
            KEYS.w.pressed = false
            break
        case 'a':
            KEYS.a.pressed = false
            break

        case 'Shift':
            KEYS.Shift.pressed = false
            break
    }
})