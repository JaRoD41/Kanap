const basketValue = getBasket();
const zonePanier = document.querySelector("#cart__items");
/////////////// déclaration de la fonction du fetch pour acceder aux infos Hors Scope/////////
function fetchApi() {    
let basketArrayFull = [];
for (const i of basketValue) {
	const kanapId = i.idSelectedProduct;
	fetch(`http://localhost:3000/api/products/${kanapId}`)
		.then((res) => res.json())
		.then((canap) => {
			showBasket(i, canap);
            const article = {    //création d'un objet qui va regrouper les infos nécessaires à la suite
							_id: canap._id,
							name: canap.name,
							price: canap.price,
							color: i.colorSelectedProduct,
							quantity: i.quantity,
							alt: canap.altTxt,
							img: canap.imageUrl,
						};
						basketArrayFull.push(article);
		})
		.catch(function (err) {
			console.log(err);
		});
}
for (let apicontent of basketArrayFull) {
    console.log("test donnees api :", apicontent);
};
	
return basketArrayFull;
};
const showBasket = (localStorageData, apiData) => {
	if (basketValue !== null) {
        zonePanier.innerHTML += `<article class="cart__item" data-id="${localStorageData.idSelectedProduct}" data-color="${localStorageData.colorSelectedProduct}">
                <div class="cart__item__img">
                  <img src= "${apiData.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${apiData.name}</h2>
                    <p>${localStorageData.colorSelectedProduct}</p>
                    <p>${apiData.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorageData.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

	} else {
		return messagePanierVide();
	}
};
//création des fonctions de modif et suppression d'articles du panier////

function getBasket() {  // fonction de récupération du LocalStorage//////
    return JSON.parse(localStorage.getItem("kanapLs"));
};

/// Initialisation des fonctions ///////////

//fetchApi();
calculQteTotale(basketValue);
calculPrixTotal();
removeItem();
removeFromBasket();
modifyQuantity();

//Fonction permettant de modifier le nombre d'éléments dans le panier
console.log("LS hors du fetch :", fetchApi());

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
				removeFromBasket(idModif, colorModif, basketValue);
				calculQteTotale(basketValue);
				calculPrixTotal();
			}
			localStorage.setItem("kanapLs", JSON.stringify(basketValue));
		});
	}
};

////////////////Supprimer un kanap avec le bouton delete////////

function removeItem() {
	const buttonsDelete = document.querySelectorAll(".deleteItem");
	for (let button of buttonsDelete) {
		button.addEventListener("click", function () {
			let basketValue = getBasket();
			//On récupère l'ID de la donnée modifiée
			let idModif = this.closest(".cart__item").dataset.id;
			//On récupère la couleur de la donnée modifiée
			let colorModif = this.closest(".cart__item").dataset.color;
			removeFromBasket(idModif, colorModif, basketValue);
			calculQteTotale(basketValue);
			calculPrixTotal();
		});
	}
};

////////////////Message si panier vide////////////////////

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

//////////////Fonction pour supprimer un kanap du panier////////

function removeFromBasket(idModif, colorModif, basketValue) {
	getBasket();
	//Suppression de l'affichage
	let elementToRemove = document.querySelector(
		`article[data-id="${idModif}"][data-color="${colorModif}"]`
	);
    console.log("elmt", elementToRemove);
	document.querySelector("#cart__items").removeChild(elementToRemove);
	//Suppression dans le local storage
	//On récupère le bon iD dans le panier
	let getKanap = basketValue.find(
		(product) =>
			product.idSelectedProduct === idModif &&
			product.colorSelectedProduct === colorModif
	);

	let index = basketValue.indexOf(getKanap);
	basketValue.splice(index, 1);
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));

	if (getBasket().length === 0) {
		localStorage.clear();
		return messagePanierVide();
	}
	//On met a jour le LS / panier
	alert("article supprimé !");
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
	calculQteTotale(basketValue);
	calculPrixTotal();
};

////////////////////////Fonction addition quantités et Prix pour Total////////////////

function calculQteTotale(basketValue) {
	const zoneTotalQuantity = document.querySelector("#totalQuantity");
	let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
	for (let kanap of basketValue) {
		basketValue = getBasket();
		quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
		const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
		let qtyReduce = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
		zoneTotalQuantity.textContent = qtyReduce;
        console.log("qté :", qtyReduce);
	}
};

function calculPrixTotal() {
	const zoneTotalPrice = document.querySelector("#totalPrice");
    finalTotalPrice = [];
    console.log("basketValue :", basketValue);
    console.log("fetchApi :", fetchApi().length);
    //fetchApi();
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