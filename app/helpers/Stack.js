function Stack() {
	this.items = [];
}

//adds an element at the end of the queue
Stack.prototype.push = function (e) {
	this.items.push(e);
};

// remove an element from the front of the queue and return it
Stack.prototype.pop = function () {
	this.items.pop();
	console.log(this.items);
};

// check if the queue is empty - boolean
Stack.prototype.isEmpty = function () {
	return this.items.length === 0;
};

// get the element at the front of the queue
Stack.prototype.peek = function () {
	return !this.isEmpty() ? this.items[0] : undefined;
};

//get the size of the stack - Number
Stack.prototype.length = function () {
	return this.items.length;
};

export default Stack;
