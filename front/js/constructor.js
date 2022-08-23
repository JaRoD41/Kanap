class Product {
	constructor(data) {
		this._id = data._id;
		this.name = data.name;
		this.price = data.price;
		this.image = data.imageUrl;
		this.imageAlt = data.altTxt;
		this.description = data.description;
	}
	get id() {
		return this._id;
	}
	get name() {
		return this.name;
	}
	get price() {
		return this.price;
	}
	get image() {
		return this.image;
	}
	get imageAlt() {
		return this.imageAlt;
	}
	get description() {
		return this.description;
	}
}
