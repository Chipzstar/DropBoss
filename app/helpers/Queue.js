function Queue() {
	this.items = [];
}

//adds an element at the end of the queue
Queue.prototype.enqueue = function (e) {
	this.items.push(e);
};

// remove an element from the front of the queue and return it
Queue.prototype.dequeue = function () {
	this.items.shift();
	console.log(this.items)
};

// check if the queue is empty - boolean
Queue.prototype.isEmpty = function () {
	return this.items.length === 0;
};

// get the element at the front of the queue
Queue.prototype.peek = function () {
	return !this.isEmpty() ? this.items[0] : undefined;
};

//get the size of the queue - Number
Queue.prototype.length = function() {
	return this.items.length;
}

export default Queue;
