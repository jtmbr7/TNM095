class Seaurchin {

    size = 9;
    static color = "Black";
    
    constructor(position) {
        this.position = position;
    }

    tick() {
        fishes.forEach(fish => {
            let distance = this.position.distance(fish.position);
            if(distance < this.size + fish.size) {
                fish.slowed = {time: 0, threshold: 2*60};
            }
        });
    }

    draw() {
        drawStar(this.position, 15, 3, 1)     
    }

}