

let memory = [];
let selectedFish = undefined;
let row = 0;
function myDebugger() {

    fishes.forEach(fish =>{
        if(mouse.Left == "mouseup" && fish.position.distance({x: mouse.x, y: mouse.y}) < fish.size) {
            selectedFish = fish;
        }
    });

    if(key.ArrowDown == "keyup" && row < Object.keys(selectedFish).length - 1) {
        row += 1;
    }

    if(key.ArrowUp == "keyup" && row > 0) {
        row -= 1;
    }

    if(key.ArrowRight == "keyup" && selectedFish[Object.keys(selectedFish)[row]].length > 1) {
        memory.push(selectedFish);
        selectedFish = selectedFish[Object.keys(selectedFish)[row]];
        row = 0;
    }

    if(key.ArrowLeft == "keyup" && memory.length > 0) {
        selectedFish = memory[0];
        memory.splice(0, 1);
        row = 0;
    }

    if(selectedFish) {
        let i = 0;
        for(let prop in selectedFish) {
            let c = "rgb(0, 0, 0, 1)";
            if(i == row)
                c = "rgb(0, 200, 0, 1)";
            text({x: 50, y: 50 + 20 * i}, 15, prop + ": " + selectedFish[prop], c);
    
            ++i;
        }
    }
}