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
        },
        imgSrc: './imgs/Huntress_1/Sprites/Idle.png',
        framesMax:8,
        scale: 2.5,
        offset: {
            x:100,
            y:87
        },
        sprites: {
            idle: {
                spriteSrc: './imgs/Huntress_1/Sprites/Idle.png',
                framesMax:8,
            },
            run: {
                spriteSrc: './imgs/Huntress_1/Sprites/Run.png',
                framesMax:8,

            },
            jump: {
                spriteSrc: './imgs/Huntress_1/Sprites/Jump.png',
                framesMax:2,

            },
            fall: {
                spriteSrc: './imgs/Huntress_1/Sprites/Fall.png',
                framesMax:2

            }
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

let timerID
let timer = 60



countDown();

function animate() {

    //       -----Background------
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    bg.update();

    
     //       -----Player 1------
    player1.update();
    player1.velocity.x = 0

    //Default to set for every frame
    player1.setSprite('idle');

    //Player 1 animation -left,right movement
    if (KEYS.a.pressed) {
        player1.velocity.x = -MOVEMENT_SPEED
        player1.setSprite('run');
        //player1.image.src = './imgs/Huntress_1/Sprites/Run.png';

    } else if (KEYS.d.pressed) {
        player1.velocity.x = MOVEMENT_SPEED
        player1.setSprite('run');
        
    }
    //Player 1 Jump
    if(player1.velocity.y < 0) {
       player1.setSprite('jump');
    } else if(player1.velocity.y>0) {
        player1.setSprite('fall');
    }

     //       -----Player 2------
    player2.velocity.x = 0
    //player2.update()

    //Player 2 animation- left,right movement 
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

// window.addEventListener('keydown', (event) => {
//     console.log("You pressed: " + event.key)
// })

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