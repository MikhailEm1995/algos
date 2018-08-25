(function() {

	var CANVAS = document.getElementById('canvas');
	var CTX = CANVAS.getContext('2d');

	var NATURE_OF_CODE = window.NATURE_OF_CODE || {};

	NATURE_OF_CODE.gausDistr = function(x, mu, sigma) {
		var power = -(Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));

		return (
			(1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, power)
		);
	};

	NATURE_OF_CODE.randomGaus = function() {
		var x, y, v, u;

		do {
			v = Math.random();
		} while (v === 0);

		do {
			u = Math.random();
		} while (u === 0);

		x = Math.sqrt(-2 * Math.log10(u)) * Math.cos(2 * Math.PI * v);
		y = Math.sqrt(-2 * Math.log10(u)) * Math.sin(2 * Math.PI * v);

		return { x: x, y: y };
	};

	NATURE_OF_CODE.goRandGausDots = function(ctx, max) {
		max = max || 100;
		var i = 0;
		var int = setInterval(function() {
			if (i === 1000) clearInterval(int);
			var rand = NATURE_OF_CODE.randomGaus();
			var x = rand.x * 100 + 200;
			var y = rand.y * 100 + 200;

			var rand2 = NATURE_OF_CODE.randomGaus();
			var firstColor = (rand.x * 100 + 50).toFixed();
			firstColor *= firstColor < 0 ? -1 : 1;
			var secondColor = (rand2.x * 100 + 50).toFixed();
			secondColor *= secondColor < 0 ? -1 : 1;
			var thirdColor = (rand.y * 100 + 50).toFixed();
			thirdColor *= thirdColor < 0 ? -1 : 1;
			var opacity = rand2.y;
			opacity *= ((opacity < 0 ? -1 : 1) + 0.2).toFixed(2);

			console.log('--------------');
			console.log('x: ', x);
			console.log('y: ', y);

			var grd = CTX.createRadialGradient(x, y, 5, x, y, 20);
			grd.addColorStop(0,`rgba(${firstColor}, ${secondColor}, ${thirdColor}, ${opacity})`);
			grd.addColorStop(1,"transparent");

			CTX.beginPath();
			CTX.arc(x, y, 20, 0, 2 * Math.PI);
			CTX.fillStyle = grd;
			CTX.fill();
			i += 1;
		}, 50);
	};

	NATURE_OF_CODE.goRandGausWalker = function(ctx, max) {
		max = max || 100;
		var x = 200, y = 200;

		var i = 0;
		var int = setInterval(function() {
			if (i === 1000) clearInterval(int);

			switch (true) {
				case x < 0:
					x += 15;
					break;
				case x > 400:
					x -= 15;
					break;
				case y < 0:
					y += 15;
					break;
				case y > 400:
					y -= 15;
			}

			CTX.fillStyle = '#000';
			CTX.fillRect(x, y, 3, 3);

			console.log('--------------');
			console.log('x: ', x);
			console.log('y: ', y);

			var rand = NATURE_OF_CODE.randomGaus();

			x += Number((rand.x * 10).toFixed());
			y += Number((rand.y * 10).toFixed());

			i += 1; 
		}, 50);
	};

	NATURE_OF_CODE.goGaus = function(ctx, max) {
		max = max || 100;

		var values = [];

		for (var i = 0; i < max; i += 1) {
			values.push(Number((Math.random() * 100).toFixed(2)));
		}

		var mu = values.reduce((prev, next) => prev + next, 0) / values.length;
		var sigma = Math.sqrt(
			values
				.map(value => Math.pow(value - mu, 2))
				.reduce((prev, next) => prev + next, 0) / values.length
		);

		var ys = [];

		for (var i = 0; i < 100; i += 1) {
			ys.push(NATURE_OF_CODE.gausDistr(i, 50, 10));
		}

		for (var i = 0; i < 100; i += 1) {
			CTX.fillStyle = '#000';
			CTX.fillRect(i, 100 - 1000 * ys[i], 1, 1);
		}

		console.log(mu);
		console.log(sigma);
		console.log(100 * ys.reduce((prev, next) => prev + next, 0));
	};
	// Monte Carlo Method
	NATURE_OF_CODE.uniformRandomWalker = function(ctx, max) {
		var R1x, R2x, R1y, R2y;
		var xDir, yDir;
		var x = 200, y = 200;

		var i = 0;
		var int = setInterval(() => {
			if (i === 1000) clearInterval(int);

			do {
				R1x = Math.random() * 10;
				R1x *= R1x < 0 ? -1 : 1;
				R2x = Math.random() * 10;
				R2x *= R2x < 0 ? -1 : 1;
			} while (R1x < R2x);
			do {
				R1y = Math.random() * 10;
				R1y *= R1y < 0 ? -1 : 1;
				R2y = Math.random() * 10;
				R2y *= R2y < 0 ? -1 : 1;
			} while (R1y < R2y);

			if (Math.random() < 0.5) R1x *= -1;
			if (Math.random() < 0.5) R1y *= -1;

			x += R1x;
			y += R1y;

			CTX.fillStyle = '#000';
			CTX.fillRect(x, y, 1, 1);

			i += 1;
		}, 50);		
	};

	NATURE_OF_CODE.perlinNoise = function() {
		function Lerp(a, b, t) {
		  return a + (b - a) * t;
		}

		function quanticCurve(t) {
		  return t * t * t * (t * (t * 6 - 15) +10);
		}

		function getPseudoRandomGradientVector(x, y) {
		  var v = Math.floor(Math.random() * 4);
		  
		  switch (v) {
		    case 0: return [1, 0];
		    case 1: return [-1, 0];
		    case 2: return [0, 1];
		    default: return [0, -1];  
		  }
		}

		function Dot(a, b) {
		  return a[0] * b[0] + a[1] * b[1];
		}

		function Noise(fx, fy) {
		  var left = Math.floor(fx);
		  var top = Math.floor(fy);
		  
		  var pointInQuadX = fx - left;
		  var pointInQuadY = fy - top;
		  
		  var topLeftGradient = getPseudoRandomGradientVector(left, top);
		  var topRightGradient = getPseudoRandomGradientVector(left + 1, top);
		  var bottomLeftGradient = getPseudoRandomGradientVector(left, top + 1);
		  var bottomRightGradient = getPseudoRandomGradientVector(left + 1, top + 1);
		  
		  var distanceToTopLeft = [pointInQuadX, pointInQuadY];
		  var distanceToTopRight = [pointInQuadX - 1, pointInQuadY];
		  var distanceToBottomLeft = [pointInQuadX, pointInQuadY - 1];
		  var distanceToBottomRight = [pointInQuadX - 1, pointInQuadY - 1];
		  
		  var tx1 = Dot(distanceToTopLeft, topLeftGradient);
		  var tx2 = Dot(distanceToTopRight, topRightGradient);
		  var bx1 = Dot(distanceToBottomLeft, bottomLeftGradient);
		  var bx2 = Dot(distanceToBottomRight, bottomRightGradient); 
		  
		  pointInQuadX = quanticCurve(pointInQuadX);
		  pointInQuadY = quanticCurve(pointInQuadY);
		  
		  var tx = Lerp(tx1, tx2, pointInQuadX);
		  var bx = Lerp(bx1, bx2, pointInQuadX);
		  var tb = Lerp(tx, bx, pointInQuadY);
		  
		  return tb;
		}

		/*let x = 200;
		let y = 200;*/

		/*
		setInterval(function() {
			let _1st = Math.random();
			let _2nd = Math.random();

			x += Noise(_1st, _2nd);
			y += Noise(_1st, _2nd);

			CTX.clearRect(0, 0, 400, 400)
			CTX.beginPath();
			CTX.arc(x, y, 50, 0, 2 * Math.PI, false);
			CTX.fillStyle = 'green';
			CTX.fill();
		}, 10);*/

		for (var i = 0, max = 400; i < max; i += 1) {
			for (var j = 0, len = 400; j < len; j += 1) {
				var x = Math.random();
				var y = Math.random();

				var color = 150 + Number((Noise(x, y).toFixed(2) * 100).toFixed());

				CTX.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';	
				CTX.fillRect(i, j, 1, 1);
			}
		}
	}

	NATURE_OF_CODE.monteCarlo = function() {
		function getStep() {
			while(true) {
				let r1 = Math.random();
				let r2 = Math.random();
				if (r2 < r1) return r1;
			} 
		}

		let x = 200;
		let y = 200;

		setInterval(function() {
			let stepsizeX = +(getStep() * 10).toFixed();
			let stepsizeY = +(getStep() * 10).toFixed();

			let isNegativeX = Math.random() < 0.5;
			let isNegativeY = Math.random() < 0.5;

			x += isNegativeX ? stepsizeX * (-1) : stepsizeX;
			y += isNegativeY ? stepsizeY * (-1) : stepsizeY;

			CTX.fillStyle = '#000';
			CTX.fillRect(x, y, 2, 2);
		}, 100);
	}

	NATURE_OF_CODE.Vector = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	NATURE_OF_CODE.Vector.prototype.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

	NATURE_OF_CODE.bouncingBall = function() {
		const location = new NATURE_OF_CODE.Vector(100, 100);
		const velocity = new NATURE_OF_CODE.Vector(2.5, 5);

		setInterval(function() {
			CTX.clearRect(0, 0, 400, 400);

			location.add(velocity);

			if ((location.x > 400) || (location.x < 0)) velocity.x *= -1;
			if ((location.y > 400) || (location.y < 0)) velocity.y *= -1;

			CTX.beginPath();
			CTX.arc(location.x, location.y, 10, 0, 2 * Math.PI, false); 
			CTX.fillStyle = 'green';
			CTX.fill();
		}, 10);
	}

	window.NATURE_OF_CODE = NATURE_OF_CODE;
}());
