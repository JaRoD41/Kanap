const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
/////////////// déclaration de la fonction du fetch pour acceder aux infos Hors Scope/////////
async function fetchApi() {    
let basketArrayFull = [];
let basketClassFull = JSON.parse(localStorage.getItem("kanapLs"));
if (basketClassFull !== null) {
for (let g = 0; g < basketClassFull.length; g++) {
	await fetch("http://localhost:3000/api/products/" + basketClassFull[g].idSelectedProduct)
		.then((res) => res.json())
		.then((canap) => {
			const article = {
				//création d'un objet qui va regrouper les infos nécessaires à la suite
				_id: canap._id,
				name: canap.name,
				price: canap.price,
				color: basketClassFull[g].colorSelectedProduct,
				quantity: basketClassFull[g].quantity,
				alt: canap.altTxt,
				img: canap.imageUrl,
			};
			basketArrayFull.push(article);
		})
		.catch(function (err) {
			console.log(err);
		});
}
}
return basketArrayFull;
};

//////////// fonction d'affichage du DOM ////////////////////

async function showBasket() {
	const responseFetch = await fetchApi();
	const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
	if (basketValue !== null && basketValue.length !== 0) {
		const zonePanier = document.querySelector("#cart__items");
		responseFetch.forEach((product) => {
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

async function modifyQuantity() {
	await fetchApi();
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
			let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
			if (this.value > 0) {
				findColor.quantity = this.value;
				//On Push le panier dans le local Storage
				localStorage.setItem("kanapLs", JSON.stringify(basketValue));
				calculQteTotale();
				calculPrixTotal();
			} else {
				calculQteTotale();
				calculPrixTotal();
			}
			localStorage.setItem("kanapLs", JSON.stringify(basketValue));
		});
	}
};

////////////////Supprimer un kanap avec le bouton delete////////

async function removeItem() {
	await fetchApi();
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
			const getSection = document.querySelector("#cart__items");
			getSection.removeChild(event.target.closest("article"));
			alert("article supprimé !");
			calculQteTotale();
			calculPrixTotal();
		});
	});
	if (getBasket() !== null && getBasket().length === 0) {
		localStorage.clear();
		return messagePanierVide();
	}
};
removeItem();

/// Initialisation des fonctions ///////////

initialize();
async function initialize() {
let basketArrayFull = fetchApi();
showBasket();
removeItem();
modifyQuantity();

calculQteTotale();
calculPrixTotal();
};

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
	if (basketValue === null || basketValue.length === 0) {
		messagePanierVide();
	} else {
	for (let kanap of basketValue) {
		//basketValue = getBasket();
		quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
		const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
		zoneTotalQuantity.textContent = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	}
}};

async function calculPrixTotal() {
	const responseFetch = await fetchApi();
	let basketValue = getBasket();
	const zoneTotalPrice = document.querySelector("#totalPrice");
    finalTotalPrice = [];
    for (let p = 0; p < responseFetch.length; p++) {
	let sousTotal = parseInt(responseFetch[p].quantity) * parseInt(responseFetch[p].price);
	finalTotalPrice.push(sousTotal);

	const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des prix du tableau par reduce
	zoneTotalPrice.textContent = finalTotalPrice.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
}};

modifyQuantity();
removeItem();


//On Push le panier dans le local Storage
localStorage.setItem("kanapLs", JSON.stringify(basketValue));

///////////////// FORMULAIRE ///////////////////////////////////////////////

// déclaration des différentes zones d'input et de messages d'erreur //

const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");
//const orderForm = document.getElementsByClassName("cart__order__form");

const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

// déclaration des regex de contrôle des inputs du formulaire //

const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const regexLastName = regexFirstName;
const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/;
const regexCity = regexFirstName;
const regexEmail = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

// écoute du clic sur le bouton COMMANDER //

const zoneOrderButton = document.querySelector("#order");

zoneOrderButton.addEventListener("click", function(e) {
	e.preventDefault(); // on empeche le formulaire de fonctionner par defaut si aucun contenu

	// recupération des inputs du formulaire //

	let checkFirstName = inputFirstName.value;
	let checkLastName = inputLastName.value;
	let checkAddress = inputAddress.value;
	let checkCity = inputCity.value;
	let checkEmail = inputEmail.value;

	// mise en place des conditions de validation des champs du formulaire //

function orderValidation() {
	let basketValue = getBasket();

	// si une erreur est trouvée, un message est retourné et la valeur false également //

	if (regexFirstName.test(checkFirstName) == false || checkFirstName === null) {
		zoneFirstNameErrorMsg.innerHTML = "Merci de renseigner votre prénom";
		return false;
	} else if (
		regexLastName.test(checkLastName) == false ||
		checkLastName === null
	) {
		zoneLastNameErrorMsg.innerHTML = "Merci de renseigner votre nom de famille";
		return false;
	} else if (
		regexAddress.test(checkAddress) == false ||
		checkAddress === null
	) {
		zoneAddressErrorMsg.innerHTML =
			"Merci de renseigner une adresse valide (Numéro, voie, nom de la voie, code postal)";
		return false;
	} else if (regexCity.test(checkCity) == false || checkCity === null) {
		zoneCityErrorMsg.innerHTML = "Merci de renseigner un nom de ville valide";
		return false;
	} else if (regexEmail.test(checkEmail) == false || checkEmail === null) {
		zoneEmailErrorMsg.innerHTML =
			"Merci de renseigner une adresse email valide";
		return false;
	}
	// si tous les champs du formulaire sont correctement remplis //
	else {
		// on crée un objet contact pour l'envoi par l'API //

		let contact = {
			firstName: checkFirstName,
			lastName: checkLastName,
			address: checkAddress,
			city: checkCity,
			email: checkEmail,
		};

		// on crée un tableau vide qui va récupérer les articles du panier à envoyer à l'API //

		let products = [];

		// la requête POST ne prend en compte QUE l'ID des produits du panier //
		// On ne push donc QUE les ID des canapés du panier dans le tableau créé //

		for (let canapId of basketValue) {
			products.push(canapId.idSelectedProduct);
		}

		// on crée l'objet contenant les infos de la commande //

		let finalOrderObject = { contact, products };

		// récupération de l'ID de commande après fetch POST vers API   //

		const orderId = fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			body: JSON.stringify(finalOrderObject),
			headers: {
				"Content-type": "application/json",
			},
		});
		orderId.then(async function (response) {
			const retour = await response.json();
			window.location.href = `confirmation.html?orderId=${retour.orderId}`;
			}) // réponse de l'API //
			
				
			
			
				//window.location.href = `confirmation.html?orderId=${data.orderId}`;
			//}) //renvoi vers la page de confirmation avec l'ID de commande //

			
	}
}

orderValidation();
});



