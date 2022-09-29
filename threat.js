class Threat {

    size = 9;
    static color = "Black";
    
    constructor(position) {
        this.position = position;
    }

    tick() {
    }

    draw() {
        drawStar(this.position, 15, 3, 1)     
    }

}
