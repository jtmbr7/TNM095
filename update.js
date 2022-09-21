
let fishes = [];
let food = []; 

function setup() {
    
    for(let i = 0; i < 5; ++i)
    fishes.push(new Fish(new Position(300 + 100*i, 300), 20 + Math.random() * 10, 1));

    for(let i=0; i < 5; ++i)
    food.push(new Food(new Position(300 + 100*i, 300+100*i)));
  

}

function update() {

    for(let i = 0; i < fishes.length - 1; ++i) {
        for(let q = i + 1; q < fishes.length; ++q) {
            fishes[i].collision(fishes[q])
        }
    }

    fishes.forEach(fish => fish.tick());
    fishes.forEach(fish => fish.draw());

    food.forEach(food => food.tick());
    food.forEach(food => food.draw());

    fishes.forEach(fish => {

        for(let i = 0; i < food.length; ++i) {
            
            fish.collision_food(food[i])
        
        }
    });

    for(let i=0; i<food.length; ++i) {
        if(food[i].radius == 0) {
            food.splice(i,1)
            --i; 
            }
    }

    text({x:100,y:100},20,"Food:"+food.length,"Black")

    
// 


    if(key.d == "keydown")

        food[0].alive = false;

/*
    if(key.d == "keydown")
        fishes[0].angle += .1;
    if(key.a == "keydown")
        fishes[0].angle -= .1;
    if(key.w == "keydown")
        fishes[0].swim(.05);*/
}