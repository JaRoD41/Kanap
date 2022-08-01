const zonePanier = document.querySelector("#cart__items");
const zoneImgKanap = document.querySelector(".cart__item__img");
const zoneNameColorPriceKanap = document.querySelector(".cart__item__content__description");
const zoneQuantityKanap = document.querySelector(
	".cart__item__content__settings__quantity"
);
const zoneDeleteKanap = document.querySelector(".deleteItem");
const zoneTotalQuantity = document.querySelector("#totalQuantity");
const zoneTotalPrice = document.querySelector("#totalPrice");
const formErrorMessage = "Merci de modifier votre saisie, SVP";
const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");
const zoneOrderButton = document.querySelector("#order");

/*<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="../images/product01.jpg" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom du produit</h2>
                    <p>Vert</p>
                    <p>42,00 €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>*/

//<p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : <span id="totalPrice"><!-- 84,00 --></span> €</p>
//<p id="firstNameErrorMsg"><!-- ci est un message d'erreur --></p>