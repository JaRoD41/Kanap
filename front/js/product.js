let url = new URL(location.href); //déclare une variable valant l'url de la page actuelle
let kanapPageId = url.searchParams.get("id"); //récupère l'id contenu dans l'url de la page actuelle

let zoneImgKanap = document.querySelector(".item__img");
let nomKanap = document.querySelector("#title");
let prixKanap = document.querySelector("#price");
let speechKanap = document.querySelector("#description");
let colorOptions = document.querySelector("#colors");
let getProductQuantity = document.querySelector("#quantity");

fetch(`http://localhost:3000/api/products/${kanapPageId}`) //je ne selectionne QUE la partie du JSON qui m'interesse en fonction de l'id du kanap concerné à fetch
	.then((res) => res.json())
	.then((object) => {
		const imgKanap = object.imageUrl;
		const nameKanap = object.name;
		const priceKanap = object.price;
		const descriptKanap = object.description;
		const colorsKanap = object.colors;

		for (let couleur of colorsKanap) {
			colorOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
		}
		zoneImgKanap.innerHTML += `<img src="${imgKanap}" alt="Photographie d'un canapé">`;
		nomKanap.innerText += `${nameKanap}`;
		prixKanap.innerText += `${priceKanap} `;
		speechKanap.innerText += `${descriptKanap}`;

		// je crée une fonction déclenchée au clic sur le bouton ADDTOCART

		const button = document.getElementById("addToCart");

		//---------------------------------------localStorage----------------------------------------------------

		// liste des actions déclenchées au clic sur le bouton "ajouter"
		button.addEventListener("click", () => {
			let basketValue = {
				//initialisation de la variable basketValue
				idSelectedProduct: kanapPageId,
				nameSelectedProduct: nameKanap,
				colorSelectedProduct: colorOptions.value,
				quantity: getProductQuantity.value
			};

			//je crée une fonction de récupération du panier
			function getBasket() {
				let basketValue = JSON.parse(localStorage.getItem("kanapLs"));
				if (basketValue == null) {
					return [];
				} else {
					return basketValue
				}
			}

			//je crée une fonction d'ajout au panier
			function addBasket(product) {
				let basketValue = getBasket();
				let foundProducts = basketValue.find(
					/// on définit foundProducts comme l'article à trouver
					(item) =>
						item.kanapPageId === product.kanapPageId &&
						item.colorSelectedProduct === product.colorSelectedProduct
				); //si les produits du panier et les produits du LS ont même ID et même couleur

				if (
					foundProducts == undefined &&
					colorOptions.value != "" &&
					getProductQuantity.value > 0 &&
					getProductQuantity.value <= 100
				) {
					product.quantity = getProductQuantity.value;
					basketValue.push(product);
				} else {
					let newQuantity =
						parseInt(foundProducts.quantity) +
						parseInt(getProductQuantity.value); //CUMUL Quantité si présent
					foundProducts.quantity = newQuantity;
				}
				saveBasket(basketValue);
				console.log("found products :", foundProducts);
				console.log("canap ajouté :", product);
				console.log("contenu du LS :", basketValue);
				alert(
					`Le canapé ${nameKanap} ${colorOptions.value} a été ajouté en ${getProductQuantity.value} exemplaires à votre panier !`
				);
			}
			//je crée une fonction de sauvegarde du panier
			function saveBasket(basketValue) {
				localStorage.setItem("kanapLs", JSON.stringify(basketValue));
			}

			// Si le choix de couleur est vide
			if (colorOptions.value === "") {
				alert("Veuillez choisir une couleur, SVP");
			}
			// Si la quantité choisie est nulle OU si elle dépasse 100
			else if (
				getProductQuantity.value <= 0 ||
				getProductQuantity.value > 100
			) {
				alert("Veuillez sélectionner une quantité correcte, SVP");
			} else {
				//Si tout est OK, on envoie le panier au LS
				addBasket(basketValue);
			}
		});
	})
	.catch(function (err) {
		console.log(err);
	});
