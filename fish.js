class Eyes {
    constructor(dx, dy, host) {
        this.host = host;
        this.size = host.size * .1;
        this.position = new Position(host.position.x + host.size * dx, host.position.y + host.size * dy)

        this.distance = this.position.distance(host.position);
        this.angle = this.position.angle(host.position, this.distance);
    }

    tick() {
        this.position.x = this.host.position.x + this.distance * Math.cos(this.angle + this.host.angle)
        this.position.y = this.host.position.y + this.distance * Math.sin(this.angle + this.host.angle)
    }

    draw() {
        circle(this.position, this.size, "rgb(0, 0, 0, 1)");
        circle(this.position.circulation(this.size * .5, Math.PI + this.host.angle), this.size, "rgb(0, 0, 0, 1)");
        circle(this.position, this.size * .8, "rgb(250, 250, 250, 1)");
        circle(this.position.circulation(this.size * .5, Math.PI + this.host.angle), this.size * .8, "rgb(0, 50, 150, 1)");
        circle(this.position, this.size * .6, "rgb(0, 150, 250, 1)");
        circle(this.position.circulation(this.size * .1, 0), this.size * .4, "rgb(50, 250, 250, 1)");
        circle(this.position.circulation(this.size * .5, 5*Math.PI/4), this.size * .3, "rgb(250, 250, 250, 1)");
    }
}

function normalize(v) {

    let k = 0;
    v.forEach(x => {k += Math.pow(x, 2)});
    let l = Math.sqrt(k);
    let newV = [];
    v.forEach(x => {newV.push(x/l)});
    return newV;
}

let light = [1/Math.sqrt(3), 1/Math.sqrt(3), -1/Math.sqrt(3)];
class Position {
    constructor(x, y, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    circulation(radius, angle) {

        return new Position(this.x + radius * Math.cos(angle), this.y + radius * Math.sin(angle));
    }

    distance(position) {
        return Math.sqrt(Math.pow(this.x - position.x, 2) + Math.pow(this.y - position.y, 2));
    }

    angle(position, distance = this.distance(position)) {

        let angle = Math.acos((this.x - position.x)/distance);
        if(this.y < position.y)
            angle = Math.PI * 2 - angle;

        return angle;
    }

}



class Fish {
    velocity = 3;
    joints = [];
    points = [];
    eyes = [];
    targetAngle;
    time_shift = {time: 0, threshold: 60 * 2};
    
    constructor(position, size, angle) {
        this.position = position;
        this.size = size;
        this.angle = angle;

        this.joints.push(new Joints(.6 * this.size, Math.PI + angle, this));
        this.joints.push(new Joints(.5 * this.size, Math.PI + angle, this.joints[0]));
        this.joints.push(new Joints(.4 * this.size, Math.PI + angle, this.joints[1]));
        this.joints.push(new Joints(.2 * this.size, Math.PI + angle, this.joints[2]));
        this.joints.push(new Joints(.5 * this.size, Math.PI + angle, this.joints[3]));

        this.eyes.push(new Eyes(.6, .3, this));
        this.eyes.push(new Eyes(.6, -.3, this));

        this.points.push(new Points(0, 0.001, this.size, this, .6));
        this.points.push(new Points(0, 0.001, this.size, this.joints[0], 1));
        this.points.push(new Points(0, 0.001, this.size, this.joints[1], .8));
        this.points.push(new Points(0, 0.001, this.size, this.joints[2], .4));
        this.points.push(new Points(0, 0.001, this.size, this.joints[3], .2));
        this.points.push(new Points(0, 0.001, this.size, this.joints[4]));
        this.points.push(new Points(0, .5, this.size, this));
        this.points.push(new Points(0, -.5, this.size, this));
        this.points.push(new Points(.9, .2, this.size, this));
        this.points.push(new Points(.9, -.2, this.size, this));
        this.points.push(new Points(.4, .6, this.size, this));
        this.points.push(new Points(.4, -.6, this.size, this));
        this.points.push(new Points(0, -.3, this.size, this.joints[0]));
        this.points.push(new Points(0, .3, this.size, this.joints[0]));
        this.points.push(new Points(0, -.2, this.size, this.joints[1]));
        this.points.push(new Points(0, .2, this.size, this.joints[1]));
        this.points.push(new Points(0, -.15, this.size, this.joints[2]));
        this.points.push(new Points(0, .15, this.size, this.joints[2]));
        this.points.push(new Points(0, -.1, this.size, this.joints[3]));
        this.points.push(new Points(0, .1, this.size, this.joints[3]));

        this.points.push(new Points(-.2, .6, this.size, this.joints[0], .2));
        this.points.push(new Points(-.7, .9, this.size, this));

        this.points.push(new Points(-.2, -.6, this.size, this.joints[0], .2));
        this.points.push(new Points(-.7, -.9, this.size, this));

        this.points.push(new Points(-.6, -.2, this.size, this.joints[4], 0));
        this.points.push(new Points(-.6, .2, this.size, this.joints[4], 0));
        this.points.push(new Points(-.9, 0, this.size, this.joints[4], .2));
        this.points.push(new Points(-.4, -.3, this.size, this.joints[4], .2));
        this.points.push(new Points(-.4, .3, this.size, this.joints[4], .2));
        this.points.push(new Points(-.4, -.5, this.size, this.joints[4], 0));
        this.points.push(new Points(-.4, .5, this.size, this.joints[4], 0));
        this.points.push(new Points(-.7, -.5, this.size, this.joints[4], 0));
        this.points.push(new Points(-.7, .5, this.size, this.joints[4], 0));
    }

    draw() {

        this.joints.forEach(joint => joint.draw());
        //circle(this.position, 10, "rgb(200, 0, 0, 1)");
        //circle(this.position.circulation(20, this.angle), 3, "rgb(200, 0, 0, 1)");
       

        Fish.vertices.forEach((vertex, i) =>{

            let p1 = this.points[vertex[0]];
            let p2 = this.points[vertex[1]];
            let p3 = this.points[vertex[2]];

            let Ax = p2.position.x - p1.position.x;
            let Ay = p2.position.y - p1.position.y;
            let Az = p2.position.z - p1.position.z;
            let Bx = p3.position.x - p1.position.x;
            let By = p3.position.y - p1.position.y;
            let Bz = p3.position.z - p1.position.z;
            let N = normalize([Ay * Bz - Az * By, Az * Bx - Ax * Bz, Ax * By - Ay * Bx]);

            
            let a = Math.acos(N[0] * light[0] + N[1] * light[1] + N[2] * light[2]/((Math.pow(N[0], 2) + Math.pow(N[1], 2) + Math.pow(N[2], 2)) * (Math.pow(light[0], 2) + Math.pow(light[1], 2) + Math.pow(light[2], 2))));
            let s = (Math.cos(a) + 1)/2 + .4;

            let c = Fish.colors[vertex[3]]
            let color = rgb(c[0] * s, c[1] * s, c[2] * s);

            if(i == 5)
                this.eyes[1].color = color;
            else if(i == 12)
                this.eyes[0].color = color;

            triangle(
                p1.position,
                p2.position,
                p3.position,
                color
                )
        });

        this.eyes.forEach(eye => eye.draw());
        //this.points.forEach(point => point.draw());
    }


    swim(speed) {

        this.velocity += speed;
    }

    setTargetAngle(angle) {

        if(Math.abs(this.angle - angle) > Math.PI) {
            
            this.targetAngle = {angle: angle, direction: Math.sign(this.angle - angle)};
        }
        
        else this.targetAngle = {angle: angle, direction: -Math.sign(this.angle - angle)};

    }

    wall_collision(){

        if(this.position.x < this.size) {
            this.position.x = this.size

            this.setTargetAngle(0);

        }
        
        else if(this.position.x > canvas.width - this.size) {
            this.position.x = canvas.width - this.size;
            this.setTargetAngle(Math.PI);
        }

        else if(this.position.y < this.size) {
            this.position.y = this.size
            this.setTargetAngle(Math.PI/2);
        }
        
        else if(this.position.y > canvas.height - this.size) {
            this.position.y = canvas.height - this.size;
            this.setTargetAngle(3*Math.PI/2);
        }
    }

    tick() {


        if(this.targetAngle < 0)
            this.targetAngle = Math.PI * 2 - this.targetAngle;
        this.time_shift.time += 1; //Increase time with 1 fps

        if (this.time_shift.time > this.time_shift.threshold) //If the time is more than 120 frames per second
        {
            this.setTargetAngle(this.angle + - Math.PI/2 + Math.PI * Math.random());
            this.time_shift.time = 0; //Reset time
        }

        this.wall_collision()

        if(this.targetAngle != undefined) {

            this.angle += .05 * this.targetAngle.direction;
            
            if(Math.abs(this.targetAngle.angle - this.angle) < .1) {
                this.targetAngle = undefined;
            }
        }

        if(this.angle > Math.PI * 2)
            this.angle -= 2 * Math.PI;
        else if(this.angle < 0)
            this.angle += 2 * Math.PI;

        this.position.x += this.velocity * Math.cos(this.angle);
        this.position.y += this.velocity * Math.sin(this.angle);
        this.joints.forEach(joint => joint.tick());
        this.points.forEach(point => point.tick());
        this.eyes.forEach(eye => eye.tick());
    }

    collision(fish) {

        let distance = this.position.distance(fish.position);

        if(distance < (this.size + fish.size))
        {
            let angle = this.position.angle(fish.position, distance);
            fish.position.x = this.position.x - (this.size + fish.size) * Math.cos(angle);
            fish.position.y = this.position.y - (this.size + fish.size) * Math.sin(angle);
        }

    }
}

Fish.colors = [
    [250, 115, 40],
    [255, 227, 157]
];

Fish.vertices = [
    [13, 20, 6, 1],
    [6, 20, 21, 1],
    [12, 7, 22, 1],
    [7, 23, 22, 1],
    [0, 8, 9, 0],
    [0, 9, 11, 0],
    [0, 11, 7, 0],
    [0, 7, 12, 0],
    [0, 12, 1, 0],
    [0, 1, 13, 0],
    [0, 13, 6, 0],
    [0, 6, 10, 0],
    [0, 10, 8, 0],
    [1, 12, 14, 0],
    [1, 14, 2, 0],
    [1, 2, 15, 0],
    [1, 15, 13, 0],
    [2, 14, 16, 0],
    [2, 16, 3, 0],
    [2, 3, 17, 0],
    [2, 17, 15, 0],
    [3, 16, 18, 0],
    [3, 18, 4, 0],
    [3, 4, 19, 0],
    [3, 19, 17, 0],
    [4, 18, 5, 0],
    [4, 5, 19, 0],
    [5, 24, 26, 1],
    [5, 26, 25, 1],
    [5, 25, 28, 1],
    [5, 28, 30, 1],
    [25, 32, 28, 1],
    [28, 32, 30,1],
    [5, 27, 24, 1],
    [5, 29, 27, 1],
    [24, 27, 31, 1],
    [27, 29, 31, 1]
];

class Joints {
    constructor(length, angle, host) {
        this.length = length;
        this.host = host;
        this.position = host.position.circulation(length, angle);
        this.fx = 1;
        this.fy = 0;
    }

    tick() {

        this.angle = this.host.position.angle(this.position);

        this.position = this.host.position.circulation(this.length, this.angle - Math.PI);

    }

    draw() {

        circle(this.position, 3, "rgb(0, 0, 200, 1)");
        line(this.position, this.host.position, "rgb(0, 200, 0, 1)");
    }
}

class Points {
    constructor(dx, dy, size, host, dz = 0) {
        this.host = host;
        this.position = new Position(host.position.x + size * dx, host.position.y + size * dy, host.position.z + size * dz);
        this.length = this.position.distance(host.position);
        this.angle = this.position.angle(host.position, this.length);
    }

    tick() {
        this.position.x = this.host.position.x + this.length * Math.cos(this.angle + this.host.angle);
        this.position.y = this.host.position.y + this.length * Math.sin(this.angle + this.host.angle);
    }

    draw() {
        circle(this.position, 2, "rgb(100, 100, 100, 1)");
    }
}