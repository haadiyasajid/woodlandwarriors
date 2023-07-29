const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
let framesCount =0;
let HEALTH_REPLENISH_TIME; //boolean to indicate whether bottle should appaear or not
let gameOver=false;

//Constants
const GRAVITY = 0.5
const JUMP_FORCE = -15
const GAME_WIDTH = 1024
const GAME_HEIGHT = 576
const MOVEMENT_SPEED = 5
const ATTACK_DAMAGE = 10; //Amount of damage an attack will cause
const HEALTH_WARNING = 20; //Amout of health upon which bar turns red
const HEALTH_REPLENISH_PAUSE = 500; //Amount of frames after which health replenish bottle will appear
const HEALTH_REPLENISH_STAY = 5000; //Number of milliseconds for which health replenish bottle will stay on screen

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

const healthBottle = new Sprite ({
    position: {
        x: 200, 
        y: 150
    },
    imgSrc: './imgs/health_potion.png',
    scale: 2.5,
    width: 50,
    height:50
})

var audio = new Audio('audio/LostWoods_Mikel.mp3');
audio.volume = 0.01;
audio.play();

var getHeart = new Audio('audio/zelda_get_heart.mp3');
var getHit = new Audio('audio/zelda_hit.mp3');

        

function restart() {
    document.getElementById("scoreInfo").style.display = 'none';
    gameOver=false;

    player1.health=100;
    player2.health=100;
    player1.isAlive=true;
    player2.isAlive=true;
    player1.setSprite('fall');
    player2.setSprite('fall');
    forceSwitchFall(player1);
    forceSwitchFall(player2);
   
    document.getElementById("player1health").style.backgroundColor = "#466734";
    document.getElementById("player2health").style.backgroundColor = "#4f8868";

    gsap.to('#player1health', {
        width: player1.health + '%'
    })
    gsap.to('#player2health', {
        width: player2.health + '%'
    })
    
    player1.position.y = 0;
    player1.position.x = 35;
    player2.position.y =0;
    player2.position.x=890;
    timer=60;
    document.getElementById('timer').innerHTML = timer;
    player1.draw();
    player2.draw();
    
}


function animate() {

    //An infinite loop
    window.requestAnimationFrame(animate)

    //       -----Background------
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    bg.update();
    
    //Making the background slightly lighter for better contrast
    canvasContext.fillStyle = 'rgba(255,255,255,0.11)'
    canvasContext.fillRect(0,0,canvas.width, canvas.height-32)


    //       -----Player 1------
    player1.update();
    player1.velocity.x = 0

    //Player 1 animation -left,right movement
    if (KEYS.a.pressed && player1.lastKey == 'a' && playerInBoundsForLeft(player1)) {
        player1.velocity.x = -MOVEMENT_SPEED
        player1.setSprite('run');
        //player1.image.src = './imgs/Huntress_1/Sprites/Run.png';

    } else if (KEYS.d.pressed && player1.lastKey == 'd' && playerInBoundsForRight(player1)) {
        player1.velocity.x = MOVEMENT_SPEED
        player1.setSprite('run');
    } else {
        //Default to set for every frame
        player1.setSprite('idle');
    }
    //Player 1 Jump
    if (player1.velocity.y < 0) {
        player1.setSprite('jump');
    } else if (player1.velocity.y > 0) {
        player1.setSprite('fall');
    }

    //       -----Player 2-----
    player2.update()
    player2.velocity.x = 0

    //Player 2 animation- left,right movement 
    if (KEYS.ArrowLeft.pressed && player2.lastKey == 'ArrowLeft' && playerInBoundsForLeft(player2)) {
        player2.velocity.x = -MOVEMENT_SPEED;
        player2.setSprite('run');
    } else if (KEYS.ArrowRight.pressed && player2.lastKey == 'ArrowRight'  && playerInBoundsForRight(player2)) {
        player2.velocity.x = MOVEMENT_SPEED;
        player2.setSprite('run');
    } else {
        //Default to set for every frame
        player2.setSprite('idle');
    }

    //Player 2 Jump
    if (player2.velocity.y < 0) {
        player2.setSprite('jump');
    } else if (player2.velocity.y > 0) {
        player2.setSprite('fall');
    }

    if(gameOver)
        return; //Don't execute the rest of the functions.

     //Setting winner in case of death
     if (player1.health <= 0 || player2.health <= 0) {
        setWinner({
            player1: player1,
            player2: player2,
            timerId
        });
    }

    //COllission detection - if player1 hit player2
    if (collissionDetection({ player1: player1, player2: player2 }) && player1.isAttacking) {
        console.log("HIT PLAYER 2!!!");
        getHit.play();

        //player2.setSprite('getHit');

        player2.health -= ATTACK_DAMAGE;
        if (player2.health <= 0) {
            player2.setSprite('death');
        } else { //still alive
            player2.setSprite('getHit');
            if(player2.health<=20) {
                document.getElementById("player2health").style.backgroundColor = "#85231c";
                
            }
        }

        //document.getElementById('player2health').style.width = player2.health + '%'
        gsap.to('#player2health', {
            width: player2.health + '%'
        })
        player1.isAttacking = false;
    }

    //Collission detection - if player2 hit player2
    if (collissionDetection({ player1: player2, player2: player1 }) && player2.isAttacking) {
        console.log("HIT PLAYER 1!!!");
        getHit.play();

        player1.health -= ATTACK_DAMAGE
        if (player1.health <= 0) {
            player1.setSprite('death');
        } else { //health >0
            player1.setSprite('getHit');
            if(player1.health<=20) {
                document.getElementById("player1health").style.backgroundColor = "#85231c";
            }
        }

        //document.getElementById('player1health').style.width = player1.health + '%'
        gsap.to('#player1health', {
            width: player1.health + '%'
        })
        player2.isAttacking = false;
    }

    //Detecting if bottle was collected by player1
    if(getBottleDetection({player: player1, bottle: healthBottle})) {
        if(player1.health<=90 && HEALTH_REPLENISH_TIME) {
            player1.health += 10;
            getHeart.play();
        }
        
        HEALTH_REPLENISH_TIME=false;
        gsap.to('#player1health', {
            width: player1.health + '%'
        })
        if(player1.health>20) {
            document.getElementById("player1health").style.backgroundColor = " #466734";
        }
    }

    //Detecting if bottle was collected by player2
    if(getBottleDetection({player: player2, bottle: healthBottle})) {
        if(player2.health <=90 && HEALTH_REPLENISH_TIME) {
             player2.health += 10;
             getHeart.play();
        }
        HEALTH_REPLENISH_TIME=false;
        gsap.to('#player2health', {
            width: player2.health + '%'
        })
        if(player2.health>20) {
            document.getElementById("player2health").style.backgroundColor = "#4f8868";
        }
    }

    //Generating health potion bottle
   framesCount++; //this only increases over time
        if (framesCount % HEALTH_REPLENISH_PAUSE === 0) { //add health bottle after every n frames (n=health replenish pause)
            HEALTH_REPLENISH_TIME=true;
            healthBottle.position.x = generateRandom(25, 850);
            healthBottle.position.y = generateRandom(25, 450);

            setTimeout(() => {
                HEALTH_REPLENISH_TIME = false;
            }, HEALTH_REPLENISH_STAY)
        }

    if(HEALTH_REPLENISH_TIME) {
        healthBottle.draw();
    }
        

}


function startGame() {
    
}

const bg = new Sprite({
    position: {
        x: 0, y: 0
    },
    imgSrc: './imgs/background.png'
})

canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

//Player 1 will be controlled by A,W,D
const player1 = new Player(
    {
        position: new Position(35, 0),
        velocity: { x: 0, y: 5 }, //initial falling down velocity, will be reset when hitting ground
        color: 'red',
        offset: {
            x: 0,
            y: 0
        },
        imgSrc: './imgs/Huntress_1/Sprites/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x: 100,
            y: 87
        },
        sprites: {
            idle: {
                spriteSrc: './imgs/Huntress_1/Sprites/Idle.png',
                framesMax: 8,
            },
            run: {
                spriteSrc: './imgs/Huntress_1/Sprites/Run.png',
                framesMax: 8,

            },
            jump: {
                spriteSrc: './imgs/Huntress_1/Sprites/Jump.png',
                framesMax: 2,

            },
            fall: {
                spriteSrc: './imgs/Huntress_1/Sprites/Fall.png',
                framesMax: 2
            },
            attack: {
                spriteSrc: './imgs/Huntress_1/Sprites/Attack1.png',
                framesMax: 5
            },
            getHit: {
                spriteSrc: './imgs/Huntress_1/Sprites/Take hit.png',
                framesMax: 3
            },
            death: {
                spriteSrc: './imgs/Huntress_1/Sprites/Death.png',
                framesMax: 8
            }
        },
        attackArea: {
            offset: {
                x: 110,
                y: 60
            },
            width: 120,
            height: 80
        }
    }
);

//Player 2 will be controlled by ArrowUp, ArrowLeft, ArrowRight
const player2 = new Player(
    {
        position: new Position(890, 0),
        velocity: { x: 0, y: 5 }, //Initial velocity for falling down
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        },
        imgSrc: './imgs/Huntress_2/Sprites/Idle.png',
        framesMax: 10,
        scale: 2.5,
        offset: {
            x: 100,
            y: 12
        },
        sprites: {
            idle: {
                spriteSrc: './imgs/Huntress_2/Sprites/Idle.png',
                framesMax: 10
            },
            run: {
                spriteSrc: './imgs/Huntress_2/Sprites/Run.png',
                framesMax: 8

            },
            jump: {
                spriteSrc: './imgs/Huntress_2/Sprites/Jump.png',
                framesMax: 2

            },
            fall: {
                spriteSrc: './imgs/Huntress_2/Sprites/Fall.png',
                framesMax: 2
            },
            attack: {
                spriteSrc: './imgs/Huntress_2/Sprites/Attack.png',
                framesMax: 6
            },
            getHit: {
                spriteSrc: './imgs/Huntress_2/Sprites/Get Hit.png',
                framesMax: 3
            },
            death: {
                spriteSrc: './imgs/Huntress_2/Sprites/Death.png',
                framesMax: 10
            }
        },
        attackArea: {
            offset: {
                x: -170,
                y: 60
            },
            width: 180,
            height: 50
        }
    }
);


player1.draw();
player2.draw();

let timerID
let timer = 60

countDown();


animate();

window.addEventListener('keydown', (event) => {
    if (player2.isAlive) {
        switch (event.key) {
            //Player 2 controls
            // --- MOvement
            case 'ArrowUp':
                player2.lastKey = 'ArrowUp'
                if(playerInBoundsForJump(player2))
                     player2.velocity.y = JUMP_FORCE
                KEYS.ArrowUp.pressed = true
                break
            case 'ArrowRight':
                player2.lastKey = 'ArrowRight'
                KEYS.ArrowRight.pressed = true
                break
            case 'ArrowLeft':
                player2.lastKey = 'ArrowLeft'
                KEYS.ArrowLeft.pressed = true
                break
            // ---  Attack
            case ' ':
                // KEYS.Shift.pressed = true
                player2.attack()
                //player2.drawArrow();
                //player2.fireArrow();
                break
        }
    }

    if (player1.isAlive) {
        switch (event.key) {
            //player 1 controls
            case 'd':
                player1.lastKey = 'd'
                KEYS.d.pressed = true
                break
            case 'w':
                player1.lastKey = 'w'
                if(playerInBoundsForJump(player1))
                    player1.velocity.y = JUMP_FORCE
                KEYS.w.pressed = true
                break
            case 'a':
                player1.lastKey = 'a'
                KEYS.a.pressed = true
                break
            // ---  Attack
            case 'Shift':
                KEYS.Shift.pressed = true
                player1.attack()
                break
        }
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