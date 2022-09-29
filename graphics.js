
function loadImage(url) {
	return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}
  
function image(x, y, s, ref) {
	var img = document.getElementById(ref);
	ctx.drawImage(img, x, y, img.width * s, img.height * s);
}
  
function pyt(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
  
function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
  
function distance3(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}
  
function rgb(r, g, b, a = 1) {
	return "rgb("+r+","+g+","+b+","+a+")";
}
  
function rectangle(x, y, w, h, c) {
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
}
  
function border(x, y, w, h, c, t = 1) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + w, y);
	ctx.lineTo(x + w, y + h);
	ctx.lineTo(x, y + h);
	ctx.closePath();
	ctx.strokeStyle = c;
	ctx.lineWidth = t;
	ctx.stroke();
}
  
function text(position, size, sentence, color) {
	ctx.font = size + "px Arial";
	ctx.fillStyle = color;
	ctx.fillText(sentence, position.x, position.y);  
} 
  
function hexagon(x, y, s, c, a_start = 0) {
  
	let a = 6.28/6;
	for(let i = 0; i < 6; ++i) {
		triangle(
			x, y,
			x + s * Math.cos(a * i + a_start), y + s * Math.sin(a * i + a_start),
			x + s * Math.cos(a * (1+i) + a_start), y + s * Math.sin(a * (1+i) + a_start),
			c
		);
	}
}
  
function frame(x, y, w, h, t, c) {
	ctx.fillStyle = c;
	ctx.fillRect(x - t, y - t, w + t * 2, t);
	ctx.fillRect(x - t, y, t, h + t);
	ctx.fillRect(x + w, y, t, h + t);
	ctx.fillRect(x, y + h, w, t);
}
  
function circle(position, radius, color) {
	ctx.beginPath();
	ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

  
function ring(position, s, t, c) {
	ctx.beginPath();
	ctx.arc(position.x, position.y, s + t/2, 0, 2 * Math.PI);
	ctx.lineWidth = t;
	ctx.strokeStyle = c;
	ctx.stroke();
}
  
function triangle(p1, p2, p3, color) {
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.lineTo(p3.x, p3.y);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

function line(position_start, position_end, color, t = 4) {
	ctx.beginPath();
	ctx.moveTo(position_start.x, position_start.y);
	ctx.lineTo(position_end.x, position_end.y);
	ctx.lineWidth = t;
	ctx.strokeStyle = color;
	ctx.stroke();
}


function drawStar(position, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = position.x;
    var y = position.y;
    var step = Math.PI / spikes;

    ctx.beginPath();
    
    ctx.moveTo(position.x, position.y - outerRadius)

    for (i = 0; i < spikes; i++) {
        x = position.x + Math.cos(rot) * outerRadius;
        y = position.y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = position.x + Math.cos(rot) * innerRadius;
        y = position.y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(position.x, position.y - outerRadius)
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle='black';
    ctx.stroke();
    ctx.fillStyle='black';
    ctx.fill();
}



