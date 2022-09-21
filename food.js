class Food{

    alive = true;
    radius = 10;

    constructor(position) {
        this.position = position;
    }

    tick() {

        if(this.alive == false) {
            console.log(this.fish)
            if(this.radius > 0)
                this.radius -= .2;

            if(this.radius <= 0) {
                this.eater.velocity = 2;
                this.radius = 0;
            }
        }
    }

    draw() {
        
        circle(this.position, this.radius, "Pink")
   
    }

  }

