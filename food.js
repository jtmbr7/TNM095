
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
    }
}

function clear_food() {
    for(let i = 0; i < foods.length; ++i)
        if(foods[i].size == 0) {
            foods.splice(i, 1)
            --i;
        }
}