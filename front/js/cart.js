const zonePanier = document.querySelector("#cart__items");
const zoneItem = document.querySelectorAll(".cart__item");
const zoneImgKanap = document.querySelector(".cart__item__img");
const zoneNameColorPriceKanap = document.querySelector(".cart__item__content__description");
const zoneQuantityKanap = document.querySelectorAll(
	".itemQuantity"
);
const zoneDeleteKanap = document.querySelectorAll(
	".cart__item__content__settings__delete"
);
const zoneTotalQuantity = document.querySelector("#totalQuantity");
const zoneTotalPrice = document.querySelector(".cart__price");
const formErrorMessage = "Merci de modifier votre saisie, SVP";
const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");
const zoneOrderButton = document.querySelector("#order");

/////////////////////////////CLASS Constructor de canapés/////////////////////////////

/*class kanapModelPanier{
	constructor(id, color, imgUrl, name, price, totalQty) {
	this.kanapId = id;
	this.kanapColor = color;
	this.kanapImage = imgUrl;
	this.kanapName = name;
	this.kanapUnityPrice = price;
	this.kanapQty = totalQty;
}
// Création d'un nouvel objet canapé
const exempleKanap1 = new kanapModelPanier(
	"3erette5554",
	"Blue",
	"http://localhost:3000/images/kanap01.jpeg",
	"Sinopé",
	2500,
	25
);*/
//Création du tableau de récupération des articles du LS à injecter à la page Panier

function getBasket() { // fonction de récupération des articles de LS
	let basketValue = localStorage.getItem("kanapLs");
	if (basketValue == null) {
		return [];
	} else {
		return JSON.parse(basketValue);
	}
};
console.log(zoneItem);
//Création d'une fonction de suppression d'articles du panier

function removeFromBasket(product){
  let basketValue = getBasket();
  basketValue = basketValue.filter(
		(p) =>
			p.kanapPageId == product.kanapPageId &&
			p.colorOptions.value != product.colorOptions.value
	);
  saveBasket(basketValue);
};

//Création d'une fonction pour modifier la quantité d'articles du panier

function changeQuantity(product,quantity){
  let basketValue = getBasket();
  let foundProducts = basketValue.find( 
			p => p.kanapPageId == product.kanapPageId && p.colorOptions.value == product.colorOptions.value
		); //si les produits choisis et du panier ont même ID et même couleur
    if(foundProducts == undefined){
      foundProducts.quantity += quantity;
      if(foundProducts.quantity <= 0) {
        removeFromBasket(foundProducts);
      }else{
        saveBasket(basketValue);
      }
    }
};


let tableauLsPourPanier = getBasket(); // création du tableau qui contiendra les articles récupérés
let finalTotalPrice = [];
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
				let kanapColor = tableauLsPourPanier[item].colorSelectedProduct;

				let basketValue = JSON.parse(localStorage.getItem("kanapLs"));



////////////////////////////////Fonction addition quantités pour Total////////////////

				let totalKanapQuantity = [];

				const additionQuantite = (basketValue) => {
					if (basketValue) {
						basketValue.forEach((kanap) => {
							totalKanapQuantity.push(kanap.quantity);
						});
					} else {
						totalKanapQuantity == 0;
					}
				};
				additionQuantite(basketValue);

/////////////////////  Calcul du prix total des articles  ///////////////////////////////

				finalTotalPrice.push(totalPriceByKanap);
				


				//zoneItem.setAttribute('data-prixLigneArticle', "");
				//let dataKanap = document.querySelectorAll(".cart__item").dataset.color;
				//console.log(dataKanap);

				

				/*zoneQuantityKanap.addEventListener("change", newValue);
console.log(zoneQuantityKanap);
function updateValue(e) {
	newValue = e.value;
	console.log("nouvelle valeur :", newValue);
}*/

				/*const productpicked = {
      id : idRecuperation,
      color: color.value,
      quantity : parseInt(quantity.value)
    };*/
				

//let balise = document.getElementsByClassName("cart__item");
//let articleKart = balise.closest("article");
//console.log(balise);
// On va lire les attributs data
//let dataId = balise.getAttribute("data-id");
//let dataCouleur = balise.getAttribute("data-color");
//console.log(dataId, dataCouleur);


				/////////////////////concaténation dynamique des variables et HTML///////////////////

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

				zoneTotalPrice.innerHTML = `<p>Total (<span id="totalQuantity">${eval(
					totalKanapQuantity.join("+")
				)}</span> articles) : <span id="totalPrice">${eval(finalTotalPrice.join("+"))}</span> €`;

				//<p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>
			})};


