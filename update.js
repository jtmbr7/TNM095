let particles = [];
let fishes = [];
let foods = [];
let food = []; 
let threats = []; 
let threat = []; 

function setup() {

    for(let i = 0; i < 10; ++i)
        fishes.push(new Fish(new Position(Math.random() * canvas.width, Math.random() * canvas.height), 20));

    for(let i = 0; i < 10; ++i)
        foods.push(new Food(new Position(Math.random() * canvas.width, Math.random() * canvas.height)));

    for(let i = 0; i < 10; ++i)
        threats.push(new Threat(new Position(Math.random() * canvas.width, Math.random() * canvas.height)));
}

function update() {

    myDebugger(); 
    threats.forEach(threat => threat.tick());
    threats.forEach(threat => threat.draw());
    
    foods.forEach(food => food.tick());
    fishes.forEach(fish => fish.tick());
    particles.forEach(particle => particle.tick());

    clear_food();
    particles.forEach(particle => particle.draw());
    foods.forEach(food => food.draw());
    fishes.forEach(fish => fish.draw());

}