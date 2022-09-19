
var key = {}
onkeydown = onkeyup = function (e) { key[e.key] = e.type; }

let mouse = {};
onmousedown = onmouseup = function (e) {
	if (e.button == 0) mouse.Left = e.type;
	else if (e.button == 2) mouse.Right = e.type;
}

document.addEventListener("mousemove", function (e) {

	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

function resetKeys() {

	for (let element in key) {
		if (key[element] == "keyup") { key[element] = undefined; }
	}

	if (mouse.Right == "mouseup") mouse.Right = undefined;
	if (mouse.Left == "mouseup") mouse.Left = undefined;
	
	mouse.prevx = mouse.x;
	mouse.prevy = mouse.y;
}