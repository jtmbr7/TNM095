let gui;

function setup() {
    gui = new GUI();
    Seaurchin.spawnRandom(40);
    Food.spawnRandom(30);
}

function update() {
   
    gui.tick();
    if(gui.playButton.value) {
        Fish.tick();
        Particle.tick();

        Food.clear();
        Particle.clear();
        Fish.clear();
    }

    Particle.draw();
    Food.draw();
    Egg.draw();
    Seaurchin.draw();
    Fish.draw();
    gui.draw()
}

function newDay() {

    Fish.objects.forEach(fish => {
        ++fish.age;
        if(fish.age > 1) {
            fish.alive = false;
        }
        else {
            fish.tired = true;
            fish.energy = 0;
        }
    });
    Egg.hatch();
    Food.spawnRandom(10);
}