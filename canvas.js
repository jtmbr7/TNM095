

// -------------------- CANVAS -------------------- //
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

const ctx = canvas.getContext('2d');

let running = true;
function animate(currentTime) {

	if (key.Escape == "keydown")
		running = false;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	update();

	resetKeys();

	if (running)
		requestAnimationFrame(animate);
}

setup();
requestAnimationFrame(animate);