const CANVAS = document.querySelector('#scene');
CANVAS.width = 640;
CANVAS.height = 360;
const ctx = CANVAS.getContext('2d');

function Walker() {
	this.x = Number(CANVAS.width) / 2;
	this.y = Number(CANVAS.height) / 2;
}

Walker.prototype.display = function() {
	ctx.fillRect(this.x, this.y, 1, 1);
	ctx.fillStyle = 'black';
};

Walker.prototype.step = function() {
	let stepx = Math.floor(Math.random() * 3);
	let stepy = Math.floor(Math.random() * 3);

	let directions = [-1, 0, 1];

	this.x += directions[stepx];
	this.y += directions[stepy];
};

const w = new Walker();

setInterval(function() {
	w.display();
	w.step();
}, 10);
