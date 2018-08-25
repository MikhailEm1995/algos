(function() {

	var NATURE_OF_CODE = window.NATURE_OF_CODE || {};

	function Vector(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	Vector.prototype.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	};

	Vector.prototype.sub = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
	}

	NATURE_OF_CODE.Vector = Vector;

	window.NATURE_OF_CODE = NATURE_OF_CODE;

}());