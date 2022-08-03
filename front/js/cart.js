const zonePanier = document.querySelector("#cart__items");
const zoneImgKanap = document.querySelector(".cart__item__img");
const zoneNameColorPriceKanap = document.querySelector(".cart__item__content__description");
const zoneQuantityKanap = document.querySelector(
	".cart__item__content__settings__quantity"
);
const zoneDeleteKanap = document.querySelector(".deleteItem");
const zoneTotalQuantity = document.querySelector("#totalQuantity");
const zoneTotalPrice = document.querySelector(".cart__price");
const formErrorMessage = "Merci de modifier votre saisie, SVP";
const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");
const zoneOrderButton = document.querySelector("#order");

//Création du tableau de récupération des articles du LS à injecter à la page Panier

function getBasket() { // fonction de récupération des articles de LS
	let basketValue = localStorage.getItem("kanapLs");
	if (basketValue == null) {
		return [];
	} else {
		return JSON.parse(basketValue);
	}
}

let tableauLsPourPanier = getBasket(); // création du tableau qui contiendra les articles récupérés

for (let item in tableauLsPourPanier) {
	let kanapId = tableauLsPourPanier[item].idSelectedProduct;
	fetch(`http://localhost:3000/api/products/${kanapId}`) //je ne selectionne QUE la partie du JSON qui m'interesse en fonction de l'id des articles du panier à fetch
  .then((res) => res.json())
			.then((canap) => {
				let kanapUnityPrice = canap.price;
				let kanapQty = JSON.parse(tableauLsPourPanier[item].quantity);
				let kanapImage = canap.imageUrl;
				let kanapName = canap.name;
				let totalPriceByKanap = parseInt(kanapUnityPrice) * parseInt(kanapQty); 
        //let FinalTotalPrice = 
        let kanapColor = tableauLsPourPanier[item].colorSelectedProduct;
				console.log(kanapColor);

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

        /*zoneTotalPrice.innerHTML = `<p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : <span id="totalPrice">${FinalTotalPrice}</span> €`;*/

//<p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>
			})};


