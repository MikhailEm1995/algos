var CANVAS = document.getElementById('canvas');
var CTX = CANVAS.getContext('2d');

CANVAS.addEventListener('mousemove', function(e) {

	const mouse = new NATURE_OF_CODE.Vector(e.offsetX, e.offsetY);
	const center = new NATURE_OF_CODE.Vector(0, 0);

	mouse.sub(center);

	/*CTX.fillStyle = '#fff';
	CTX.fillRect(0, 0, 400, 400);*/

	CTX.clearRect(0, 0, 400, 400);

	CTX.beginPath();
	CTX.moveTo(0, 0);
	CTX.lineTo(mouse.x, mouse.y);
	CTX.stroke();
});