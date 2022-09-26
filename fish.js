class Fish {

    colors = [
        {r: 255, g: 227, b:157},
        {r: 250, g: 115, b: 40}
    ];

    velocity = 0;
    acceleration = .03;
    angle = new Angle(Math.random() * Math.PI * 2);
    sway = {t: 0, speed: .1, length: .4};
    state = {value: "searching", data: {}};
    max_speed = 2;
    angle_shift = {time: 0, threshold: 60 * 2};
    turn_speed = .05;
    vision = 10 + 40 * Math.random();
    
    
    constructor(position, size) {

        this.position = position;
        this.size = size;

        this.skeleton = new Skeleton(this);
        this.eyes = [new Eye(this, 1, .4, -.3), new Eye(this, 2, .4, .3)]
    }

    tick() {

        this.state_behaviour();
        this.angle.normalize(); // Makes sure fishes angle (direction it swims in) is between 0 and 2 Pi
        this.fish_collision();
        this.wall_collision();
        this.calculate_targetAngle();

        this.position.move(this.velocity, this.angle.add(Math.sin(this.sway.t) * this.sway.length));

        this.skeleton.tick();
        this.eyes.forEach(eye => eye.tick());

    }

    draw() {
        draw_skin(this);
        this.eyes.forEach(eye => eye.draw());
        //this.skeleton.draw();
        ring(this.position, this.size + this.vision, 1, "rgb(0, 0, 200, .3)");
    }

    state_behaviour() {
        if(typeof this[this.state.value] == "function")
            this[this.state.value]();
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

        foods.forEach(food => {

            let distance = food.position.distance(this.position);
            if(distance < this.size + this.vision + food.size) {
                this.setState("eating", {food: food, locked: false, timer: {time: 60, threshold: 60}});
            }
        });
    }

    speed_up() {

        if(this.velocity < this.max_speed) {
            this.velocity += this.acceleration
        }
        else this.velocity = this.max_speed;
        this.sway.t += this.sway.speed * this.velocity;
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
        this.velocity = distance * .02;

        if(distance < this.size + food.size)
            this.velocity = 0;
        
        let timer = this.state.data.timer;
        ++timer.time;

        if(timer.time > timer.threshold) {
            food.eat(this);
            timer.time = 0;
        }
    }

    setState(state, data) {
        this.state = {value: state, data: data}
    }

    calculate_targetAngle() {

        if(this.targetAngle != undefined) {

            this.angle.value += this.turn_speed * this.targetAngle.direction;
            
            if(Math.abs(this.targetAngle.angle - this.angle.value) < .1) {
                this.targetAngle = undefined;
            }
        }
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
}