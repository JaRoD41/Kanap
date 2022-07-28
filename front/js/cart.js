//j'ajoute le contenu de mon objetcbasketSelectedProduct à l'intérieur du tableau du Local Storage
//localStorage.setItem("LsProducts", JSON.stringify(localStorageProducts));


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
						}
						else{
                             // Si les valeurs de choix de couleur ET la quantité choisie sont OK
					        if (
						        colorOptions.value != "" &&
						        getProductQuantity.value > 0 &&
						        getProductQuantity.value <= 100 &&
                                localStorageProducts == null
					        ) {
										let localStorageProducts = [];
										// je crée un push pour ajouter les produits à ma variable
										localStorageProducts.push(basketSelectedProduct);
										console.log(
											"PRODUIT SELECTIONNÉ => ",
											basketSelectedProduct
										);
									}

                        }
						
						
						
					

console.log("PRODUIT SELECTIONNÉ => ", basketSelectedProduct); // SINON