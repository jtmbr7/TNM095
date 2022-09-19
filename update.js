
let myFishes = [];

function setup() {
   
    for(let i = 0; i < 14; i++)
    {
        min = Math.ceil(canvas.width);
        max = Math.floor(canvas.height);
        myFishes.push(new Fish(Math.random() * min, Math.random() * max, 25, Math.floor(Math.random() * 5 + 1)));
    }    
}

function update() {

    for (let i = 0; i < myFishes.length; i++)
    {
        myFishes[i].tick();
        myFishes[i].draw();

        for(let q = i + 1; q < myFishes.length; ++q) {
            myFishes[i].collision(myFishes[q]);
        }
    }
    

}