const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
/////////////// déclaration de la fonction du fetch pour acceder aux infos Hors Scope/////////
async function fetchApi() {    
let basketArrayFull = [];
let BasketClassFull = JSON.parse(localStorage.getItem("kanapLs"));
console.log(BasketClassFull);
for (g = 0; g < BasketClassFull.length; g++) {
	await fetch("http://localhost:3000/api/products/" + BasketClassFull[g].idSelectedProduct)
		.then((res) => res.json())
		.then((canap) => {
			//showBasket(i, canap);
			const article = {
				//création d'un objet qui va regrouper les infos nécessaires à la suite
				_id: canap._id,
				name: canap.name,
				price: canap.price,
				color: BasketClassFull[g].colorSelectedProduct,
				quantity: BasketClassFull[g].quantity,
				alt: canap.altTxt,
				img: canap.imageUrl,
			};
			basketArrayFull.push(article);
		})
		.catch(function (err) {
			console.log(err);
		});
}
return basketArrayFull;
};

/// Initialisation des fonctions ///////////

initialize();
async function initialize() {
let basketArrayFull = fetchApi();
showBasket(basketArrayFull);
removeItem();
modifyQuantity();

calculQteTotale();
calculPrixTotal();
};
//////////// fonction d'affichage du DOM ////////////////////

function showBasket(basketArrayFull) {
	const zonePanier = document.querySelector("#cart__items");
	if (basketValue !== null) {
		basketArrayFull.map((product) => { ///// ERREUR ICI !!! ////////
        zonePanier.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src= "${product.img}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
	});
	} else {
		return messagePanierVide();
	}
};
//création des fonctions de modif et suppression d'articles du panier////

function getBasket() {  // fonction de récupération du LocalStorage//////
    return JSON.parse(localStorage.getItem("kanapLs"));
};

//Fonction permettant de modifier le nombre d'éléments dans le panier

function modifyQuantity() {
	const quantityInCart = document.querySelectorAll(".itemQuantity");
	for (let input of quantityInCart) {
		input.addEventListener("change", function () {
			//écoute du changement de qty
			let basketValue = getBasket();
			//On récupère l'ID de la donnée modifiée
			let idModif = this.closest(".cart__item").dataset.id;
			//On récupère la couleur de la donnée modifiée
			let colorModif = this.closest(".cart__item").dataset.color;
			//On récupère le bon iD dans le panier
			let findId = basketValue.filter((e) => e.idSelectedProduct === idModif);
			//Puis on récupère la couleur
			let findColor = findId.find((e) => e.colorSelectedProduct == colorModif);
			if (this.value > 0) {
				findColor.quantity = this.value;
				//On Push le panier dans le local Storage
				localStorage.setItem("kanapLs", JSON.stringify(basketValue));
				calculQteTotale(basketValue);
				calculPrixTotal();
			} else {
				calculQteTotale(basketValue);
				calculPrixTotal();
			}
			localStorage.setItem("kanapLs", JSON.stringify(basketValue));
		});
	}
};

////////////////Supprimer un kanap avec le bouton delete////////

function removeItem() {
	let kanapDelete = document.querySelectorAll(".deleteItem");
	kanapDelete.forEach((article) => {
		article.addEventListener("click", function (event) {
			let basketValue = getBasket();
			//On récupère l'ID de la donnée modifiée
			const idDelete = event.target.closest("article").getAttribute("data-id");
			console.log("id modifié", idDelete);
			//On récupère la couleur de la donnée modifiée
			const colorDelete = event.target
				.closest("article")
				.getAttribute("data-color");
			const searchDeleteKanap = basketValue.find(
				(element) => element.idSelectedProduct == idDelete && element.colorSelectedProduct == colorDelete
			);
			basketValue = basketValue.filter(
				(item) => item != searchDeleteKanap
			);
			localStorage.setItem("kanapLs", JSON.stringify(basketValue));
			alert("article supprimé !");
			calculQteTotale(basketValue);
			calculPrixTotal();
		});
	});
	if (getBasket().length === 0) {
		localStorage.clear();
		return messagePanierVide();
	}
};
removeItem();

//////////////// fonction de création d'un tableau regroupant les infos du fetch ET du LS////////

/*function makeKanapArray(canap, i) {
	
	const article = {
		//création d'un objet qui va regrouper les infos nécessaires à la suite
		_id: canap._id,
		name: canap.name,
		price: canap.price,
		color: i.colorSelectedProduct,
		quantity: i.quantity,
		alt: canap.altTxt,
		img: canap.imageUrl,
	};
	basketArrayFull.push(article);
	return basketArrayFull
};*/

//////////////// Message si panier vide ////////////////////

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

////////////////////////Fonction addition quantités et Prix pour Total////////////////

function calculQteTotale() {
	let basketValue = getBasket();
	const zoneTotalQuantity = document.querySelector("#totalQuantity");
	let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
	for (let kanap of basketValue) {
		//basketValue = getBasket();
		quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
		const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
		let qtyReduce = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
		zoneTotalQuantity.textContent = qtyReduce;
        console.log("qté :", qtyReduce);
	}
};

function calculPrixTotal() {
	let basketValue = getBasket();
	const zoneTotalPrice = document.querySelector("#totalPrice");
    finalTotalPrice = [];
    console.log("basketValue :", basketValue);
    for (let p = 0; p < basketValue.length; p++) {
	let sousTotal = parseInt(basketValue[p].quantity) //* parseInt(produitsApi[p].price); A COMPLETER
	finalTotalPrice.push(sousTotal);
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
	zoneTotalPrice.textContent = finalTotalPrice;
}};

modifyQuantity();
removeItem();

//On Push le panier dans le local Storage
localStorage.setItem("kanapLs", JSON.stringify(basketValue));

///////////////// FORMULAIRE ///////////////////////////////////////////////

//<p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>