function messagePanierVide() {
	const cartTitle = document.querySelector(
		"#limitedWidthBlock div.cartAndFormContainer > h1"
	); //emplacement du message
	const emptyCartMessage = "Oups ! Votre panier est vide !";
	cartTitle.textContent = emptyCartMessage;
	cartTitle.style.fontSize = "40px";

	document.querySelector(".cart__order").style.display = "none"; //masque le forulaire si panier vide
	document.querySelector(".cart__price").style.display = "none"; // masque le prix total si panier vide
};


function saveBasket(newBasket) {
	return JSON.stringify(localStorage.setItem("kanapLs", newBasket));
}

function getBasket() {
	return JSON.parse(localStorage.getItem("kanapLs"));
}

console.log("LS lenght :", newBasket.lenght);

alert(basketValue.lenght ?? "LS UNDEFINED...");