class Threat {

    size = 9;
    static color = "Black";
    
    constructor(position) {
        this.position = position;
    }

    tick() {
    }

    draw() {
        //drawStar(100,100, 15, 3, 1) 
        circle(this.position, this.size + 3, Threat.color)
    }

}
