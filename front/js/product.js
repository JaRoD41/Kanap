    let url = new URL(location.href); //déclare une variable valant l'url de la page actuelle
	let kanapPageId = url.searchParams.get("id"); //récupère l'id contenu dans l'url de la page actuelle

    let zoneImgKanap = document.querySelector(".item__img");
    let nomKanap = document.querySelector("#title");
    let prixKanap = document.querySelector("#price");
    let speechKanap = document.querySelector("#description");
    let colorOptions = document.querySelector("#colors");
    let getProductQuantity = document.querySelector("#quantity");
    

    fetch("http://localhost:3000/api/products/" + kanapPageId) //je ne selectionne QUE la partie du JSON qui m'interesse en fonction de l'id du kanap concerné à fetch
			.then((res) => res.json())
			.then((object) => {
                let imgKanap = object.imageUrl;
                let nameKanap = object.name;
                let priceKanap = object.price;
                let descriptKanap = object.description;
                let colorsKanap = object.colors;
                
                for(let couleur of colorsKanap) {
                    colorOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
                };
                zoneImgKanap.innerHTML += `<img src="${imgKanap}" alt="Photographie d'un canapé">`;
                nomKanap.innerText += `${nameKanap}`;
                prixKanap.innerText += `${priceKanap} `;
                speechKanap.innerText += `${descriptKanap}`;
            });

// je crée une fonction déclenchée au clic sur le bouton ADDTOCART

                const button = document.getElementById("addToCart");

//---------------------------------------localStorage----------------------------------------------------           

//je crée une fonction de sauvegarde du panier
function saveBasket(basketValue) {
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
    alert("Produit ajouté au panier !");
}

//je crée une fonction de récupération du panier
function getBasket() {
	let basketValue = localStorage.getItem("kanapLs");
    if(basketValue == null){
        return [];
    }else{
        return JSON.parse(basketValue);
    }
}

//je crée une fonction d'ajout au panier
function addBasket(product){
    let basketValue = getBasket();
    let foundProducts = basketValue.find( 
			(item) => item.kanapPageId == product.kanapPageId && item.colorOptions.value == product.colorOptions.value
		); //si les produits du panier et les produits du LS ont même ID et même couleur
    if(foundProducts == undefined && colorOptions.value != "" &&
							getProductQuantity.value > 0 &&
							getProductQuantity.value <= 100){
        product.quantity = getProductQuantity.value;//modifier 1 en mettant la quantité dynamique 
        basketValue.push(product);
    }else{
        foundProducts.quantity++;
    }
    saveBasket(basketValue);
}

// liste des actions déclenchées au clic sur le bouton "ajouter"
				button.addEventListener("click", () => {
					
let basketValue = {
	idSelectedProduct: kanapPageId,
	colorSelectedProduct: colorOptions.value
};

//je crée une fonction de sauvegarde du panier
function saveBasket(basketValue) {
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
	alert("Produit ajouté au panier !");
}

//je crée une fonction de récupération du panier
function getBasket() {
	let basketValue = localStorage.getItem("kanapLs");
	if (basketValue == null) {
		return [];
	} else {
		return JSON.parse(basketValue);
	}
}

//je crée une fonction d'ajout au panier
function addBasket(product) {
	let basketValue = getBasket();
	let foundProducts = basketValue.find(
		(item) =>
			item.kanapPageId == product.kanapPageId &&
			item.colorSelectedProduct == product.colorSelectedProduct
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
					parseInt(foundProducts.quantity) + parseInt(getProductQuantity.value); //CUMUL Quantité si présent
					foundProducts.quantity = newQuantity;
	}
	saveBasket(basketValue);
	
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
                        addBasket(basketValue);
                        
				}});
