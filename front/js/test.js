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


//On récupère le bon iD dans le panier
            // MES TESTS

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

            // FIND DE MES TESTS



			////////////////////////////////////////

			//Fonction pour supprimer un kanap du panier////////
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
						let findId = newBasket.filter(
							(e) => e.idSelectedProduct === idModif
						); //cherche id identiques
						//Puis on récupère la couleur
						let findColor = findId.find(
							(e) => e.colorSelectedProduct == colorModif
						); //retourne le premier même couleur
						let index = newBasket.indexOf(findColor); //renvoie -1 si non trouvé
						//On supprime le kanap du panier
						if (index >= 0) {
							newBasket.splice(index, 1);
						} else {
							messagePanierVide();
						}
						//On met a jour le LS / panier
						alert("article supprimé !");
						localStorage.setItem("kanapLs", JSON.stringify(newBasket));
						calculQteTotale(newBasket);
						calculPrixTotal(newBasket);
					}

/////////////////////////////////////////////////////////////////////////////////////


					

					/////////////////////////////////////////////////

					function calculPrixTotal() {
						const zoneTotalPrice = document.querySelector("#totalPrice");
						//for (let ligne of basketValue) {
						console.log("prix kanap :", kanapUnityPrice);
						let sousTotal = parseInt(item.quantity) * parseInt(kanapUnityPrice);
						finalTotalPrice.push(sousTotal);
						
						console.log("somme totale :", finalTotalPrice);
						localStorage.setItem("kanapLs", JSON.stringify(basketValue));
						zoneTotalPrice.textContent = finalTotalPrice;
					//};
					};
////////////////////////////////////////////////////////////////////////////////////////

let Kanap = {};
Kanap.cart = JSON.parse(localStorage.getItem('kanapLs'));
//Là tu fais le fetch, et pour chaque item de la réponse, tu ajoutes le prix dans les items de Kanap.cart
for (let i of this.cart) {
    const kanapId = i.idSelectedProduct;
	fetch(`http://localhost:3000/api/products/${kanapId}`)
		.then((res) => res.json())
		.then((canap) => {
			
			showBasket(i, canap);
		})
		.catch(function (err) {
			console.log(err);
		});
}
Kanap.display = function showBasket(localStorageData, apiData) {
    if (basketValue !== null) {
			console.log(basketValue);
			console.log("recup API :", apiData);

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
Kanap.calculateTotalPrice = function() {
  let total = 0;
  for(let item of this.cart) {
    total += item.price;
    return total;
  }
}

Kanap.UpdateTotals = function () {
  document.getElementById('totalNumber') = this.calculateTotalNumber();
  document.getElementById('totalPrice') = this.calculateTotalPrice();
}