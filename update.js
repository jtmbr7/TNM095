let gui;
let fishes = [];
let foods = [];
let particles = [];
let eggs = [];
let seaurchins = [];

function setup() {
    gui = new GUI();

    for(let i = 0; i < 10; ++i)
        seaurchins.push(new Seaurchin(new Position(Math.random() * canvas.width, Math.random() * canvas.height)));

    for(let i = 0; i < 10; ++i)
        foods.push(new Food(new Position(Math.random() * canvas.width, Math.random() * canvas.height)))
}

function update() {

   
    if(gui.playButton.value) {
        foods.forEach(food => food.tick());
        fishes.forEach(fish => fish.tick());
        particles.forEach(particle => particle.tick());
        eggs.forEach(egg => egg.tick());
        seaurchins.forEach(seaurchin => seaurchin.tick());
        clear_food();
    }

    particles.forEach(particle => particle.draw());
    foods.forEach(food => food.draw());
    eggs.forEach(egg => egg.draw());
    seaurchins.forEach(seaurchin => seaurchin.draw());
    fishes.forEach(fish => fish.draw());
    
    gui.tick();
    gui.draw()
}

function newDay() {

    let oldGen = fishes.length;
    eggs.forEach(egg => {
        fishes.push(new Fish(new Position(egg.position.x, egg.position.y), {
            vision: egg.parent.vision,
            maxSpeed: egg.parent.maxSpeed,
            size: egg.parent.size,
            smart: egg.parent.smart,
            r: egg.parent.r,
            g: egg.parent.g,
            b: egg.parent.b,
        }));
    });

    eggs = [];

    fishes.splice(0, oldGen);
}