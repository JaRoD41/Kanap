const zonePanier = document.querySelector("#cart__items");
const zoneItem = document.querySelectorAll(".cart__item");
const zoneImgKanap = document.querySelector(".cart__item__img");
const zoneNameColorPriceKanap = document.querySelector(
	".cart__item__content__description"
);
const quantityInCart = document.querySelectorAll(".itemQuantity");
const zoneTotalQuantity = document.querySelector("#totalQuantity");
const zoneTotalPrice = document.querySelector("#totalPrice");
const formErrorMessage = "Merci de modifier votre saisie, SVP";
const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");
const zoneOrderButton = document.querySelector("#order");

//je crée une fonction de récupération du panier
function getBasket() {
	return JSON.parse(localStorage.getItem("kanapLs"));
	}
 let basketValue = getBasket();// création du tableau qui contiendra les articles récupérés
//let finalTotalPrice = [];
function showBasket() {
	if (basketValue != null) {
		for (let item of basketValue) {
	let kanapId = item.idSelectedProduct;
	fetch(`http://localhost:3000/api/products/${kanapId}`) //je ne selectionne QUE la partie du JSON qui m'interesse en fonction de l'id des articles du panier à fetch
		.then((res) => res.json())
		.then((canap) => {
			let kanapUnityPrice = canap.price;
			let kanapQty = JSON.parse(item.quantity);
			let kanapImage = canap.imageUrl;
			let kanapName = canap.name;
			let kanapColor = item.colorSelectedProduct;
			let newBasket = JSON.parse(localStorage.getItem("kanapLs"));
			calculQteTotale(newBasket);
			calculPrixTotal(newBasket);

			////////////////////////Fonction addition quantités pour Total////////////////

			console.log("newBasket :", newBasket);
			function calculQteTotale(newBasket) {
				let quantityInBasket = [];
				for (let kanap of newBasket) {
					newBasket = getBasket();
					let total = 0;
					quantityInBasket.push(parseInt(kanap.quantity));
					let qtyReduce = quantityInBasket.reduce(
						(previousValue, currentValue) => previousValue + currentValue,
						total
					);
					zoneTotalQuantity.textContent = qtyReduce;
				}
			}

			/////////////////////  Calcul du prix total des articles  //////////////////////

			function calculPrixTotal(newBasket) {
				newBasket = getBasket();
				let finalTotalPrice = [];
				for (let kanap of newBasket) {
					//newBasket = getBasket();
					console.log("canapé affiché :", kanap);
					finalTotalPrice.push(
						parseInt(canap.price) * parseInt(kanap.quantity)
					);
					let total = 0;
					let totalReduce = finalTotalPrice.reduce(
						(previousValue, currentValue) => previousValue + currentValue,
						total
					);
					console.log("total avant reduce :", finalTotalPrice);
					zoneTotalPrice.textContent = totalReduce;
				}
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
				let quantityInCart = document.querySelectorAll(".itemQuantity");
				for (let input of quantityInCart) {
					input.addEventListener("change", function () {
						//écoute du changement de qty
						let newBasket = getBasket();
						//On récupère l'ID de la donnée modifiée
						let idModif = this.closest(".cart__item").dataset.id;
						console.log("idItem :", idModif);
						console.log("qty modifiée :", input.value);
						//On récupère la couleur de la donnée modifiée
						let colorModif = this.closest(".cart__item").dataset.color;
						//On récupère le bon iD dans le panier
						let findId = newBasket.filter(
							(e) => e.idSelectedProduct === idModif
						);
						//Puis on récupère la couleur
						let findColor = findId.find(
							(e) => e.colorSelectedProduct == colorModif
						);
						if (this.value > 0) {
							findColor.quantity = this.value;
							//On Push le panier dans le local Storage
							localStorage.setItem("kanapLs", JSON.stringify(newBasket));
							calculQteTotale(newBasket);
							calculPrixTotal(newBasket);
						} else {
							removeFromBasket(idModif, colorModif, newBasket);
							calculQteTotale(newBasket);
							calculPrixTotal(newBasket);
						}
					});

					console.log("qty modifiée :", input.value);
				}
			}

			//////////////////////////////////////////////////////////////////////////////////////////

			//Supprimer un kanap avec le bouton delete
			function removeItem() {
				let buttonsDelete = document.querySelectorAll(".deleteItem");
				for (let button of buttonsDelete) {
					button.addEventListener("click", function () {
						let newBasket = getBasket();
						//On récupère l'ID de la donnée modifiée
						let idModif = this.closest(".cart__item").dataset.id;
						//On récupère la couleur de la donnée modifiée
						let colorModif = this.closest(".cart__item").dataset.color;
						removeFromBasket(idModif, colorModif, newBasket);
						calculPrixTotal(newBasket);
					});
				}
			}

			/////////////////////////////////////////////////////////////////////////////////////////

			//Fonction pour supprimer un kanap du panier
			function removeFromBasket(idModif, colorModif, newBasket) {
				getBasket();
				//Suppression de l'affichage
				let elementToRemove = document.querySelector(
					`article[data-id="${idModif}"][data-color="${colorModif}"]`
				);
				console.log("kanap à virer :", elementToRemove);
				document.querySelector("#cart__items").removeChild(elementToRemove);
				//Suppression dans le local storage
				//On récupère le bon iD dans le panier
				let findId = newBasket.filter((e) => e.idSelectedProduct === idModif); //cherche id identiques
				//Puis on récupère la couleur
				let findColor = findId.find(
					(e) => e.colorSelectedProduct == colorModif
				); //retourne le premier même couleur
				let index = newBasket.indexOf(findColor); //renvoie -1 si non trouvé
				//On supprime le kanap du panier
				if (index >= 0) {
					newBasket.splice(index, 1);
				}
				//On met a jour le LS / panier
				alert("article supprimé !");
				localStorage.setItem("kanapLs", JSON.stringify(newBasket));
				calculQteTotale(newBasket);
				calculPrixTotal(newBasket);
			}
			modifyQuantity();
			removeItem();

			
		}) // fin du fetch
		.catch(function (err) {
			console.log(err);
		});
		}; /// fin de la boucle for
	};
	}; /// accolade de fin de fonction affichage Panier


/////////////// on affiche le panier en appelant la fonction /////////////////
showBasket();


///////////////// FORMULAIRE ///////////////////////////////////////////////

//<p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>