class Fish{

    angle = Math.random() * 2 * Math.PI;
    moveAngle = this.angle;


    constructor(xpos, ypos, size, speed){
        this.xpos = xpos;
        this.ypos = ypos;
        this.size = size;
        this.speed = speed;
        
        this.time_shift = {time: 0, threshold: 60 * 2};
    }

    tick()
    {

        this.time_shift.time += 1; //Increase time with 1 fps
        if (this.time_shift.time > this.time_shift.threshold) //If the time is more than 120 frames per second
        {
            this.moveAngle = this.angle + Math.PI * 0.5 * Math.random(); //Give the object a new angle/direction 
            this.time_shift.time = 0; //Reset time
        }

        if (this.angle < this.moveAngle)
        {
            this.angle += 0.05;
        }

        if(this.angle > this.moveAngle)
        {
            this.angle -= 0.05;
        }

        //Update x and y position
        this.xpos += this.speed * Math.cos(this.angle); 
        this.ypos += this.speed * Math.sin(this.angle);

        //If statements that makes sure the object does not go beyond the canvas size
        if(this.xpos < 0)
        {
            this.moveAngle += 0;
            this.xpos = 0;
        }

        if(this.xpos > canvas.width)
        {
            this.moveAngle = Math.PI;
            this.xpos = canvas.width;
        }

        if(this.ypos < 0)
        {
            this.moveAngle = Math.PI/2;
            this.ypos = 0;   
        }

        if(this.ypos > canvas.height)
        {
            this.moveAngle = 3 * Math.PI/2;
            this.ypos = canvas.height;
        }

    }

    //When to fishes collides, the fish changes angle and swims in another direction
    collision(fish) {

        let distance = Math.sqrt(Math.pow(this.xpos-fish.xpos, 2) + Math.pow(this.ypos-fish.ypos, 2));

        if(distance < (this.size + fish.size))
        {
            console.log("HEJ");

            let angle = Math.acos((this.xpos - fish.xpos)/distance);

            

            fish.xpos = this.xpos + (this.size + fish.size) * Math.cos(angle);
            fish.ypos = this.ypos + (this.size + fish.size) * Math.sin(angle);
        }

    }

    draw()
    {
        circle(this.xpos, this.ypos, this.size, "rgb(200, 0, 0, 1)");
    }
    
}