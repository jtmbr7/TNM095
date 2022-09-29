class Fish {

    static rangevalues = {
        size: [15, 40], 
        maxSpeed: [ 1, 4],
        vision: [20, 200],
        smart: [0, 1],
        r: [50, 200],
        g:  [50, 200],
        b: [50, 200]
    }

    colors = [
        {r: 255, g: 227, b:157},
        {r: 250, g: 115, b: 40}
    ];

    angle = new Angle(Math.random() * Math.PI * 2);
    sway = {t: 0, speed: .1, length: .4};
    angle_shift = {time: 0, threshold: 60 * 2};
    turn_speed = .05;
    state = {value: "searching", data: {}};
    foodCount = 0;
    // Genes
    vision = 10 + 40 * Math.random();
    velocity = {value: 0, acceleration: .02,};
    maxSpeed = 2;
    size = 30;
    energy = 100; 
    alive = true; 
    
    constructor(position, properties) {

        for(let prop in properties)
            this[prop] = properties[prop];

        this.position = position;

        this.skeleton = new Skeleton(this);
        this.eyes = [new Eye(this, 1, .4, -.3), new Eye(this, 2, .4, .3)]
    }

    tick() {

        this.state_behaviour();

        this.slow();

        this.fish_collision();
        this.wall_collision();
        this.calculate_targetAngle();

        // Updates the position of the fish
        this.position.move(this.velocity.value, this.angle.add(Math.sin(this.sway.t) * this.sway.length));

        // Makes sure fishes angle (direction it swims in) is between 0 and 2 Pi
        this.angle.normalize();
        this.skeleton.tick();
        this.eyes.forEach(eye => eye.tick());

        if(this.foodCount >= 5*this.size/27.5)
            this.layEgg();

        this.energy -= Math.pow(this.velocity.value, 2) * .0001;
        this.energy -= this.vision * .0001;
        if(this.energy < 0)
            this.alive = false; 
        this.energy -= Math.pow(this.size,2)*.0001; 
    }


    slow() {
        if(this.slowed) {
            if(this.velocity.value > .5)
                this.velocity.value = .5;
            this.slowed.time++;
            if(this.slowed.time > this.slowed.threshold)
                this.slowed = undefined;
        }
    }



    draw() {

        this.colors[1] = {r: this.r, g: this.g, b: this.b};
        draw_skin(this);
        this.eyes.forEach(eye => eye.draw());
        //this.skeleton.draw();
        bar({x: this.position.x + - 40, y: this.position.y - 80}, 80, 20, "rgb(250, 250, 250, 0.5)")
        bar({x: this.position.x + - 38, y: this.position.y - 75}, this.energy * .76, 10, "rgb(0, 64, 255, 1)")
        dashed_ring(this.position, this.size + this.vision, 1, "rgb(0, 0, 200, .3)");
    }

    /* ------------------------ BEHAVIOURS ------------------------ */
    state_behaviour() {
        if(typeof this[this.state.value] == "function")
            this[this.state.value]();
    }

    setState(state, data) {
        this.state = {value: state, data: data}
    }

    searching() {
        this.speed_up();

        if(this.targetAngle == undefined) {
            ++this.angle_shift.time;

            if(this.angle_shift.time > this.angle_shift.threshold) {
                this.setTargetAngle(Math.random() * Math.PI * 2);
                this.angle_shift.time = 0;
            }
        }

        fishes.forEach(fish => {

            if(fish != this) {
                let distance = fish.position.distance(this.position);
                if(distance < this.size + fish.size + this.vision) {
                    if(this.size/fish.size > 1.3)
                        this.setState("chasing", {fish: fish});
                    else if(this.size/fish.size < 0.77)
                        this.setState("fleeing", {fish: fish, timer: {time: 0, threshold: 60 * 3}});
                }
            } 
        });

        foods.forEach(food => {

            let distance = food.position.distance(this.position);
            if(distance < this.size + food.size + this.vision ) {
                this.setState("eating", {food: food, locked: false, timer: {time: 60, threshold: 60}});
            }
        });
    }

    eating() {

        this.sway.t += .05;
        let food = this.state.data.food;
        if(food.size == 0) {
            this.state = {value: "searching"};
            return;
        }

        this.setTargetAngle(this.position.angle(this.state.data.food.position));

        let distance = this.position.distance(food.position);

        if(distance < this.size + food.size)
            this.velocity.value = 0;
            else {this.speed_up()};
        
        let timer = this.state.data.timer;
        
        if(distance <= this.size + food.size) {
            ++timer.time;
    
            if(timer.time > timer.threshold) {
                food.eat(this);
                timer.time = 0;
            }
        }
    }

    chasing() {
        let fish = this.state.data.fish;
        
        let distance = this.position.distance(fish.position)

        if(distance <= this.size + fish.size) {
            fish.alive = false;
            this.foodCount += fish.size * 3 / 27.5;
            this.energy += fish.size * 40 / 27.5;
            this.setState("searching")
        } else {
            this.setTargetAngle(this.position.angle(fish.position, distance));
            this.speed_up();
        }

    }

    fleeing() {
        let fish = this.state.data.fish;
        let timer = this.state.data.timer;
        let distance = fish.position.distance(this.position);
        this.setTargetAngle(fish.position.angle(this.position, distance));
        this.speed_up();
        if(distance < this.vision + this.size) {
            timer.time = 0;
        }
        else {
            ++timer.time;
            if(timer.time > timer.threshold)
                this.setState("searching")
        }
    }

    energy() {

        

    }


    /* --------------------------------------------------------------------- */

    calculate_targetAngle() {

        if(this.targetAngle != undefined) {

            this.angle.value += this.turn_speed * this.targetAngle.direction;
            
            if(Math.abs(this.targetAngle.angle - this.angle.value) < .1) {
                this.targetAngle = undefined;
            }
        }
    }
    
    speed_up() {

        if(this.velocity.value < this.maxSpeed) {
            this.velocity.value += this.velocity.acceleration
        }
        else this.velocity.value = this.maxSpeed;
        this.sway.t += this.sway.speed * this.velocity.value;
    }

    setTargetAngle(angle) { // For setting the angle the fish should turn to

        while(angle < 0)
            angle += Math.PI * 2;
        while(angle > Math.PI * 2)
            angle -= Math.PI * 2;

        if(Math.abs(this.angle.value - angle) > Math.PI) {
            
            this.targetAngle = {angle: angle, direction: Math.sign(this.angle.value - angle)};
        }
        
        else this.targetAngle = {angle: angle, direction: -Math.sign(this.angle.value - angle)};

    }

    wall_collision(){ // Collision with walls

        if(this.position.x < this.size) {
            this.position.x = this.size
            this.setTargetAngle(Math.sign(Math.PI - this.angle.value) * Math.random() * (Math.PI/2));
        }
        
        else if(this.position.x > canvas.width - this.size) {
            this.position.x = canvas.width - this.size;
            this.setTargetAngle(Math.PI - Math.sign(Math.PI - this.angle.value) * Math.random() * (Math.PI/2));
        }

        if(this.position.y < this.size) {
            this.position.y = this.size
            this.setTargetAngle(Math.PI/2 + Math.sign(3*Math.PI/2 - this.angle.value) * Math.random() * (Math.PI/2));
        }
        
        else if(this.position.y > canvas.height - this.size) {
            this.position.y = canvas.height - this.size;
            this.setTargetAngle(3 * Math.PI/2 + Math.sign(Math.PI/2 - this.angle.value) * Math.random() * (Math.PI/2));
        }
    }
    
    fish_collision() { // Collision with other fishes
        
        for(let i = fishes.indexOf(this) + 1; i < fishes.length; ++i) {

            let fish = fishes[i]
            let d = this.position.distance(fish.position);
        
            if (d < this.size + fish.size ) {
                let a = fish.position.angle(this.position, d);
    
                let position = new Position(
                    ((fish.position.x + this.position.x) / 2) + (this.size + fish.size) * Math.cos(a) * .5,
                    ((fish.position.y + this.position.y) / 2) + (this.size + fish.size) * Math.sin(a) * .5);
    
                fish.position = new Position(
                    ((fish.position.x + this.position.x) / 2) + (this.size + fish.size) * Math.cos(a + Math.PI) * .5,
                    ((fish.position.y + this.position.y) / 2) + (this.size + fish.size) * Math.sin(a + Math.PI) * .5);
    
                this.position = position
            }
        }
    }

    layEgg() {
        this.foodCount -= 5*this.size/27.5;
        eggs.push(new Egg(this));
    }
}

class Egg {

    colors = ["rgb(200, 60, 30)", "rgb(150, 10, 0)", "rgb(250, 110, 60)"]
    size = 7;
    constructor(fish) {
        this.parent = fish;
        this.size = fish.size * .2
        let a = fish.angle.value - Math.PI;
        this.position = new Position(fish.position.x + Math.cos(a) * fish.size * .4, fish.position.y + Math.sin(a) * fish.size * .4);

    }

    tick() {

    }

    draw() {
        circle(this.position, this.size, this.colors[1])
        circle(this.position, this.size * .8, this.colors[0])
        circle({x: this.position.x - this.size * .2, y: this.position.y  - this.size * .2}, this.size * .5, this.colors[2])
    }
}