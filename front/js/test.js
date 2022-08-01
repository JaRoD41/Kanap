// fonction Constructor d'objets canapés
function kanapModelPanier(id, color, imgUrl, name, price, totalQty) {
	this.kanapId = id;
	this.kanapColor = color;
	this.kanapImage = imgUrl;
	this.kanapName = name;
	this.kanapUnityPrice = price;
	this.kanapQty = totalQty;
}

// Création d'un nouvel objet canapé
let exempleKanap1 = new kanapModelPanier(
	"3erette5554",
	"Blue",
	"http://localhost:3000/images/kanap01.jpeg",
	"Sinopé",
	2500,
	25
);

let exempleKanap2 = new kanapModelPanier(
	"65hjrhhju43",
	"Red",
	"http://localhost:3000/images/kanap02.jpeg",
	"Cyllène",
	1850,
	13
);
function getBasket() {
	let basketValue = localStorage.getItem("kanapLs");
	if (basketValue == null) {
		return [];
	} else {
		return JSON.parse(basketValue);
	}
}
// affichage en console
    let basketValue = getBasket()
    console.log(basketValue[1]);

