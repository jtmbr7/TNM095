class Seaurchin {

    size = 9;
    colors = [ 'rgb(100, 0, 100)', "rgb(150, 50, 150"];
    angle = new Angle(Math.random() * Math.PI * 2)
    angle_shift = {time: 0, threshold: 60 * 2};
    turn_speed = .1;
    velocity = .2;

    constructor(position) {
        this.position = position;
    }

    tick() {
        this.angle.normalize();
        this.position = new Position(this.position.x + Math.cos(this.angle.value) * this.velocity, this.position.y + Math.sin(this.angle.value) * this.velocity)
        this.calculate_targetAngle();
        if(this.targetAngle == undefined) {
            ++this.angle_shift.time;

            if(this.angle_shift.time > this.angle_shift.threshold) {
                this.setTargetAngle(Math.random() * Math.PI * 2);
                this.angle_shift.time = 0;
            }
        }

        fishes.forEach(fish => {
            let distance = this.position.distance(fish.position);
            if(distance < this.size + fish.size) {
                if (fish.slowed == undefined) {
                    fish.energy -= 5; 
                }
                fish.slowed = {time: 0, threshold: 2*60};
                
            }
        });
        this.wall_collision();
    }

    draw() {
        drawStar(this.position, 15, 3, 1, this.colors[0])     
        drawStar(this.position, 10, 2, 1, this.colors[1])     
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

    calculate_targetAngle() {

        if(this.targetAngle != undefined) {

            this.angle.value += this.turn_speed * this.targetAngle.direction;
            
            if(Math.abs(this.targetAngle.angle - this.angle.value) < .1) {
                this.targetAngle = undefined;
            }
        }
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

}