

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

