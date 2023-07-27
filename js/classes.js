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
    constructor({ position, imgSrc }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image= new Image()
        this.image.src= imgSrc
        
    }

    draw() {
       canvasContext.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }

 
}

//Class representing a player
class Player {
    //Using properties in constructor
    constructor({ position, velocity, color, offset }) {
        this.position = position
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
    }

    draw() {
        canvasContext.fillStyle = this.color
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking) {
            //draw atack box
            canvasContext.fillStyle = 'yellow'
            canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += GRAVITY //adds accelaration 
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
}
