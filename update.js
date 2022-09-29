


class PlayButton {
    size = 80;
    value = false;
    colors = ["rgb(250, 250, 250, .5)"];
    constructor(position) {
        this.position = position;
    }

    tick() {

        if(mouse.position.x > this.position.x && mouse.position.x < this.position.x + this.size
        && mouse.position.y > this.position.y && mouse.position.y < this.position.y + this.size) {
            if(mouse.Left == "mousedown")
                this.colors[0] = "rgb(250, 250, 250, .3)"
            else this.colors[0] = "rgb(250, 250, 250, .8)"

            if(mouse.Left == "mouseup")
                this.value == true ? this.value = false : this.value = true
        }
        else this.colors[0] = "rgb(250, 250, 250, .5)"

    }

    draw() {

        rectangle(this.position, this.size, this.size, this.colors[0])
        
        if(this.value) {
            rectangle({x: this.position.x + this.size * .2, y: this.position.y + this.size * .2}, this.size * .2, this.size * .6, this.colors[0]);
            rectangle({x: this.position.x + this.size * .6, y: this.position.y + this.size * .2}, this.size * .2, this.size * .6, this.colors[0]);
        }
        else {
            triangle({x: this.position.x + this.size * .2, y: this.position.y + this.size * .2},
                {x: this.position.x + this.size * .2, y: this.position.y + this.size * .8},
                {x: this.position.x + this.size * .8, y: this.position.y + this.size * .5},
                this.colors[0]);
        }
    }
}
let playButton;

let fishSpawner;
let particles = [];
let foods = [];
let fishes = [];
function setup() {
    playButton = new PlayButton(new Position(canvas.width - 100, canvas.height - 100));
    fishSpawner = new FishSpawner(new Position(120, canvas.height - 70))
    for(let i = 0; i < 10; ++i)
        foods.push(new Food(new Position(Math.random() * canvas.width, Math.random() * canvas.height)))
}

let time = 60;


function update(dt) {

    ctx.beginPath();
    ctx.arc(canvas.width/2 + 200, 0, 100, 0, Math.PI/2);
    ctx.lineTo(canvas.width/2 - 200, 100)
    ctx.arc(canvas.width/2 - 200, 0, 100, Math.PI/2, Math.PI);
    ctx.fillStyle = "rgb(250, 250, 250, .5)"
    ctx.fill();
    if(playButton.value)
        time -= dt;

    if(time <= 0) {
        playButton.value = false;
    }


    bar({x: canvas.width/2 - 100, y: 30}, 200, 40, "rgb(250, 250, 250, .5)");

    text({x: canvas.width/2, y: 60}, 30, Math.round(time), "black", true)

    playButton.tick();
    playButton.draw();
    myDebugger();

    if(playButton.value) {
        foods.forEach(food => food.tick());
        fishes.forEach(fish => fish.tick());
        particles.forEach(particle => particle.tick());
    }

    clear_food();
    particles.forEach(particle => particle.draw());
    foods.forEach(food => food.draw());
    fishes.forEach(fish => fish.draw());


    fishSpawner.tick();
    fishSpawner.draw();
}