class Slider {
    constructor(position, property) {
        this.width = 130;
        this.height = 35;
        this.position = new Position(position.x - this.width/2, position.y);
        this.value = .5
        this.property = property;
    }

    tick() {

        if(mouse.Left == "mousedown"){
            let distance = mouse.position.distance({x: this.position.x + this.width * this.value, y: this.position.y + this.height/2});

            if(distance < this.height/2 && !mouse.locked)
                mouse.locked = this;

            if(mouse.locked == this) {
                
                this.value = (mouse.position.x - this.position.x) / this.width;

                if(this.value < 0)
                    this.value = 0;
                else if(this.value > 1)
                    this.value = 1;
            }
        }
    }

    draw() {

        bar({x: this.position.x - 2, y: this.position.y - 5}, this.width + 4, this.height + 10, "rgb(250, 250, 250, .5)");
        bar(this.position, this.width * this.value, this.height, "rgb(250, 250, 250, .5)");
        circle({x: this.position.x + this.width * this.value, y: this.position.y + this.height/2}, this.height/2, "rgb(250, 250, 250, 1)");
        image({x: this.position.x + this.value * this.width - 12.5, y: this.position.y + 5}, 1, this.property[0])
        
    }
}

class FishSpawner {
    size = 50;
    locked = false;
    holdcount = 0;
    color = "rgb(250, 250, 250, .4)"
    open = false;
    sliders = [];


    properties = [["size", 15, 40], ["maxSpeed", 1, 4], ["vision", 0, 200]]
    constructor(position) {
        this.position = position;
        this.newFish();

        for(let i = 0; i < 3; ++i)
            this.sliders.push(new Slider(new Position(this.position.x, this.position.y - this.size - 100 - 50 * i), this.properties[i]))

    }

    tick() {

        this.sliders.forEach(slider => this.fish[slider.property[0]] = slider.property[1] + slider.value * (slider.property[2] - slider.property[1]));

        let distance = this.position.distance(mouse.position);

        if(distance < this.size) {
            this.color = "rgb(250, 250, 250, .7)"
        }
        else this.color = "rgb(250, 250, 250, .4)"

        this.fish.velocity.value = 0;
        this.fish.angle = new Angle(0)
        
        if(mouse.locked != this) {
            this.fish.tick();
            this.fish.position.x = this.position.x
            this.fish.position.y = this.position.y
        }

        if(mouse.Left == "mousedown"){
            if(!mouse.locked && distance < this.size)
                mouse.locked = this;

            if(mouse.locked == this && this.holdcount < 10)
                ++this.holdcount;

            if(this.holdcount == 10) {
                this.fish.tick();
                this.fish.position.x = mouse.position.x
                this.fish.position.y = mouse.position.y
            }
        }
        else if(mouse.locked == this){

            if(this.holdcount == 10) {
                if(distance > this.size) {
                    fishes.push(this.fish);
                    this.newFish();
                }
                else this.newFish();
            }
            else this.open == true ? this.open = false : this.open = true

            this.holdcount = 0;
        }

    }

    newFish() {
        this.fish = new Fish(new Position(this.position.x, this.position.y), {size: 30, angle: new Angle(0)});
        this.fish.tick();
    }

    draw() {
        if(this.open) {
            
            rectangle({x: this.position.x - this.size * 2, y: this.position.y}, this.size * 4, - 280, "rgb(250, 250, 250, .2)");
            this.sliders.forEach(slider => slider.draw());
            this.sliders.forEach(slider => slider.tick());

        }

        circle(this.position, this.size, this.color)
        this.fish.draw();
    }
}