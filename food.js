
class Food {

    size = 7;
    static color = "rgb(200, 100, 150)";
    static shade_color = "rgb(150, 50, 100)";
    static hl_color = "rgb(250, 150, 200)";
    constructor(position) {
        this.position = position;
        this.hl_position = new Position(position.x - this.size * .1, position.y - this.size * .1);
    }

    tick() {
    }

    draw() {
        circle(this.position, this.size + 3, Food.shade_color)
        circle(this.position, this.size, Food.color)
        circle(this.hl_position, this.size * .7, Food.hl_color)
    }

    eat(fish) {
        this.size -= 1;
        for(let i = 0; i < 10; ++i)
            particles.push(new Particle(this.position));

        ++fish.count_food; 
    }
}

function clear_food() {
    for(let i = 0; i < foods.length; ++i)
        if(foods[i].size == 0) {
            foods.splice(i, 1)
            --i;
        }

    for(let i = 0; i < particles.length; ++i) {
        if(particles[i].size <= 0) {
            particles.splice(i, 1)
            --i;
        }
    }
}


class Particle {
    constructor(position) {
        this.position = new Position(position.x, position.y);
        this.velocity = Math.random() * 1 + 1;
        this.angle = Math.random() * 2 * Math.PI;
        this.size = Math.random() * 4 + 4;
        this.color = rgb(Math.random() * 40 + 150, Math.random() * 40 + 50, Math.random() * 40 + 100);
        
    }

    tick() {

        this.size -= .5;
        this.position.x += this.velocity * Math.cos(this.angle);
        this.position.y += this.velocity * Math.sin(this.angle);
    }

    draw() {
        circle(this.position, this.size, this.color);
    }
}