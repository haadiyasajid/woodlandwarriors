//Class for x,y coordinates
class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}


//Class representing a sprite torender an image
class Sprite {
    //Using properties in constructor
    constructor({ position, imgSrc, scale=1, framesMax=1, offset = {x:0, y:0} }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image= new Image()
        this.image.src= imgSrc
        this.scale=scale
        this.framesMax= framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        canvasContext.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)
    }

    update() {
        //REWATCH SHOP ANIMATION PART OR 2:24:44 FOR THIS
        this.draw()
    }

 
}

//Class representing a player
class Player extends Sprite  {
    //Using properties in constructor
    constructor({ position, velocity, color, imgSrc, scale=1, framesMax=1 , offset = {x:0,y:0}, sprites}) {
        super({
            imgSrc,
            scale,
            framesMax,
            position,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset, //this is equivalent to offset=offset (same name)
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.lastKey
        this.sprites = sprites

        console.log (this.sprites)

        //const sprite refers to the key of each object (like a for-each loop)
        //sprite=idle, run, attack, etc
        for(const sprite in this.sprites) {
            this.sprites[sprite].image= new Image() //adding a new image property
            this.sprites[sprite].image.src = this.sprites[sprite].spriteSrc //Taking it form the sprites respective property
        }

       // console.log(this.sprites);

    }

    // draw() {
    //     canvasContext.fillStyle = this.color
    //     canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)

    //     if (this.isAttacking) {
    //         //draw atack box
    //         canvasContext.fillStyle = 'yellow'
    //         canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    //     }
    // }

    animateFrames() {
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold === 0 ) {
            if(this.framesCurrent < (this.framesMax-1)) {
                this.framesCurrent++;
            } else {
                this.framesCurrent=0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height-33) { //33 is the height of the ground
            this.velocity.y = 0;
        } else {
            this.velocity.y += GRAVITY //adds accelaration as the player moves down
        }
    }

    attack() {
        this.setSprite('attack')
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    //Change the sprite to a certain state
    //The if statements make sure the sprite state is switched only once (despite being repeatedly called in animate())
    setSprite(sprite) {
        if(this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax-1) {
            return
        }

      switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent=0;   //Reset current frame to 0, to remove flashes when switching between positions/sprites
                }
                break;
            case 'run':
                if (this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent=0;
                }
                break;
            case 'jump':
                if (this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent=0;
                }
                break;
            case 'fall' : 
            if (this.image != this.sprites.fall.image) {
                
                this.image = this.sprites.fall.image
                this.framesMax = this.sprites.fall.framesMax
                this.framesCurrent=0;
            }
            break;
            case 'attack' : 
            if (this.image != this.sprites.attack.image) {
                
                this.image = this.sprites.attack.image
                this.framesMax = this.sprites.attack.framesMax
                this.framesCurrent=0;
            }
            break;
        }
    }
}
