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
                
				button.addEventListener("click", function () {
// je crée l'objet qui va récupérer les données du kanap selectionné
					const basketSelectedProduct = {
						idSelectedProduct: kanapPageId,
						colorSelectedProduct: colorOptions.value,
						quantitySelectedProduct: getProductQuantity.value
					};
					//Je crée la variable qui contiendra les produits envoyé au LS
					let localStorageProducts = JSON.parse(
						localStorage.getItem("LsProducts")
					);
					// Si le choix de couleur est vide
					if (colorOptions.value === "") {
						alert("Veuillez choisir une couleur, SVP");
					}
					// Si la quantité choisie est nulle ET si elle dépasse 100
					else if (
						getProductQuantity.value <= 0 ||
						getProductQuantity.value > 100
					) {
						alert("Veuillez sélectionner une quantité correcte, SVP");
					} else {
						// Si choix de couleur OK, quantité choisie OK et LS vide
						if (
							colorOptions.value != "" &&
							getProductQuantity.value > 0 &&
							getProductQuantity.value <= 100 ||
							localStorageProducts == null
						) {
							let localStorageProducts = [];
							// je crée un push pour ajouter les produits à ma variable
							localStorageProducts.push(basketSelectedProduct);
							localStorage.setItem(
								"LsProducts",
								JSON.stringify(localStorageProducts)
							);
							alert("Produit ajouté au panier !");
							console.log("PRODUIT SELECTIONNÉ => ", basketSelectedProduct);
						}
						else if (localStorageProducts != null) { //si le LS contient quelque chose
							let foundProducts = localStorageProducts.find(
								(article) =>
								article.kanapPageId === basketSelectedProduct.kanapPageId && 
								article.colorOptions === basketSelectedProduct.colorOptions
							);
							if (foundProducts) {
								let newQuantity = parseInt(foundProducts.getProductQuantity) + parseInt(basketSelectedProduct.getProductQuantity);
								foundProducts.getProductQuantity = newQuantity;
								
								localStorage.setItem(
									"LsProducts",
									JSON.stringify(localStorageProducts)
								);
								alert("Produit ajouté au panier !");
								localStorage.setItem("LsProducts", JSON.stringify(localStorageProducts));
								
							}else{
								localStorageProducts.push(basketSelectedProduct);
								localStorage.setItem(
									"LsProducts",
									JSON.stringify(localStorageProducts)
								);
							}
						}
					}
					
				});
    
