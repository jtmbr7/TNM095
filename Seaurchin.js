class Seaurchin {

    size = 20;
    colors = ["rgb(100, 0, 100)", "rgb(150, 50, 150)", "rgb(200, 100, 200)"];
    spikes = [];

    constructor(position) {
        this.position = position;

        this.spikes.push(Math.round(Math.random() * 10) + 15);
        for(let i = 0; i < 2; ++i)
            this.spikes.push(this.spikes[i] - (2 + Math.round(Math.random() * 3)));
    }

    tick() {
        fishes.forEach(fish => {
            let distance = this.position.distance(fish.position);

            if(distance < this.size + fish.size + fish.vision) {
                
                if(distance < this.size + fish.size) {
                    fish.slowed = {time: 0, threshold: 2*60};
                }
            }
        });
    }

    draw() {
        for(let i = 0; i < this.spikes.length; ++i)
            drawStar(this.position, this.spikes[i], this.size * (1 - .2 * i), this.size * (.4 - .2 * i), this.colors[i]);   
    }

}