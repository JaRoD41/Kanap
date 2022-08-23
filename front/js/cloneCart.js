const zonePanier = document.querySelector("#cart__items");
const zoneItem = document.querySelectorAll(".cart__item");
const zoneImgKanap = document.querySelector(".cart__item__img");
const zoneNameColorPriceKanap = document.querySelector(
	".cart__item__content__description"
);

const formErrorMessage = "Merci de modifier votre saisie, SVP";
const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");
const zoneOrderButton = document.querySelector("#order");
/////////////fonction de récupération du panier///////////
function getBasket() {
	return JSON.parse(localStorage.getItem("kanapLs"));
}

let basketValue = getBasket(); // création du tableau qui contiendra les articles récupérés

//////////////////////////////////////////////////////////////////////////////////////////////////

function messagePanierVide() {
	const cartTitle = document.querySelector(
		"#limitedWidthBlock div.cartAndFormContainer > h1"
	); //emplacement du message
	const emptyCartMessage = "Oups ! Votre panier est vide !";
	cartTitle.textContent = emptyCartMessage;
	cartTitle.style.fontSize = "40px";

	document.querySelector(".cart__order").style.display = "none"; //masque le formulaire si panier vide
	document.querySelector(".cart__price").style.display = "none"; // masque le prix total si panier vide
}

let finalTotalPrice = [];

function showBasket() {
	if (basketValue !== null) {
		// tableau vide pour prix total hors de la boucle (fetch)
		for (let item of basketValue) {
			let kanapId = item.idSelectedProduct;
			fetch(`http://localhost:3000/api/products/${kanapId}`) //je ne selectionne QUE la partie du JSON qui m'interesse en fonction de l'id des articles du panier à fetch
				.then((res) => res.json())
				.then((canap) => {
					let kanapUnityPrice = canap.price;
					let basketValue = JSON.parse(localStorage.getItem("kanapLs"));
					let kanapQty = item.quantity;
					//let kanapPriceByLine = parseInt(kanapQty) * parseInt(kanapUnityPrice);
					let kanapImage = canap.imageUrl;
					let kanapName = canap.name;
					let kanapColor = item.colorSelectedProduct;

					calculQteTotale(basketValue);
					calculPrixTotal();
					console.log("quantité :", kanapQty);
					////////////////////////Fonction addition quantités pour Total////////////////

					function calculQteTotale(basketValue) {
						const zoneTotalQuantity = document.querySelector("#totalQuantity");
						let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
						for (let kanap of basketValue) {
							basketValue = getBasket();
							quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
							const reducer = (accumulator, currentValue) =>
								accumulator + currentValue; // addition des objets du tableau par reduce
							let qtyReduce = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
							zoneTotalQuantity.textContent = qtyReduce;
						}
					}

					/////////////////////  Calcul du prix total des articles  //////////////////////

					function calculPrixTotal() {
						const zoneTotalPrice = document.querySelector("#totalPrice");
						console.log("prix kanap :", kanapUnityPrice);
						let sousTotal = parseInt(item.quantity) * parseInt(kanapUnityPrice);
						finalTotalPrice.push(sousTotal);
						console.log("somme totale :", finalTotalPrice);
						localStorage.setItem("kanapLs", JSON.stringify(basketValue));
						zoneTotalPrice.textContent = finalTotalPrice;
					}

					/////////////////////concaténation dynamique des variables et HTML///////////////

					zonePanier.innerHTML += `<article class="cart__item" data-id="${kanapId}" data-color="${kanapColor}">
                <div class="cart__item__img">
                  <img src="${kanapImage}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${kanapName}</h2>
                    <p>${kanapColor}</p>
                    <p>${kanapUnityPrice} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanapQty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

					//création des fonctions de modif et suppression d'articles du panier////

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
								let findId = basketValue.filter(
									(e) => e.idSelectedProduct === idModif
								);
								//Puis on récupère la couleur
								let findColor = findId.find(
									(e) => e.colorSelectedProduct == colorModif
								);
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
					}

					//////////////////////////////////////////////////////////////////////////////////////////

					//Supprimer un kanap avec le bouton delete////////
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
					}

					function messagePanierVide() {
						const cartTitle = document.querySelector(
							"#limitedWidthBlock div.cartAndFormContainer > h1"
						); //emplacement du message
						const emptyCartMessage = "Oups ! Votre panier est vide !";
						cartTitle.textContent = emptyCartMessage;
						cartTitle.style.fontSize = "40px";

						document.querySelector(".cart__order").style.display = "none"; //masque le forulaire si panier vide
						document.querySelector(".cart__price").style.display = "none"; // masque le prix total si panier vide
					}

					/////////////////////////////////////////////////////////////////////////////////////////

					//Fonction pour supprimer un kanap du panier////////
					function removeFromBasket(idModif, colorModif, basketValue) {
						getBasket();
						//Suppression de l'affichage
						let elementToRemove = document.querySelector(
							`article[data-id="${idModif}"][data-color="${colorModif}"]`
						);
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
					}

					modifyQuantity();
					removeItem();
				}) // fin du fetch
				.catch(function (err) {
					console.log(err);
				});
		} /// fin de la boucle for
	} else {
		return messagePanierVide();
	}
}
/// accolade de fin de fonction affichage Panier

//On Push le panier dans le local Storage
localStorage.setItem("kanapLs", JSON.stringify(basketValue));

getBasket();

/////////////// on affiche le panier en appelant la fonction /////////////////
showBasket();
