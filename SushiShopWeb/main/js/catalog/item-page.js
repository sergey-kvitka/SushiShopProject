header();
fillHeader().then();

let params = new URLSearchParams(window.location.search);

let itemNameParam = params.get('name');

let errors = document.getElementById('errors');
let ifError = document.getElementById('if-error');
let ifErrorA = document.getElementById('if-error-a');

let itemInfo = document.getElementById('item-info');

if (itemNameParam == null) {
    window.location.href = 'catalog.html';
} else {
    getItemInfo(itemNameParam).then(item => {
        errors.style = 'display: none';
        itemInfo.style = 'display: flex';
        showItem(item);
    }).catch(_ => {
        itemInfo.style = 'display: none';
        errors.style = 'display: flex';
        ifError.innerText = 'Ошибка: товар "' + capitalize(itemNameParam) + '" не найден';
        ifErrorA.innerText = 'Перейти в каталог';
        ifErrorA.href = 'catalog.html'
    });
}
let itemName, itemDesc, itemPrice, itemCategory, itemImage,
    foodInfoContainer, itemAmount, itemWeight, itemCalories, itemIngredients, shopCartCont;

function showItem(item) {
    itemName = document.getElementById('item-name');
    itemDesc = document.getElementById('item-desc');
    itemPrice = document.getElementById('item-price');
    itemCategory = document.getElementById('item-category');
    itemImage = document.getElementById('item-img');

    itemName.innerText = capitalize(item['item']['name']);
    let description = item['item']['description'].trim();
    itemDesc.innerText = 'Описание: ' + (description === '' ? 'отсутствует' : description);
    itemPrice.innerText = `Цена: ${item['item']['price']} ₽`;
    itemCategory.innerText = 'Категория: ' + item['item']['category']['name'];
    itemImage.src = imgPathByImgName(item['item']['imagePath']);
    itemImage.addEventListener('error', function (event) {
        event.target.src = 'img/error/no-pictures.png';
    });

    foodInfoContainer = document.getElementById('food-info-cont');
    console.log(item['item']['category']['hyperCategory']);
    if (item['item']['category']['hyperCategory'] === 'food') {
        foodInfoContainer.style = 'display: flex';

        itemAmount = document.getElementById('item-amount');
        itemWeight = document.getElementById('item-weight');
        itemCalories = document.getElementById('item-calories');
        itemIngredients = document.getElementById('item-ingredients');

        itemAmount.innerText = `Количество объектов в товаре: ${item['amount']} шт.`;
        itemWeight.innerText = `Вес: ${item['weight']} грамм`;
        itemCalories.innerText = `Калории: ${item['calories']} ккал (на 100 грамм)`;
        itemIngredients.innerText = `Ингредиенты: ${
            item['ingredients'].map(ingredient => ingredient['name']).join(', ')}`;
    }
    else foodInfoContainer.style = 'display: none';

    shopCartCont = document.getElementById('item-shop-cart-cont')
    shopCartCont.classList.add(COST_INFO);

    let remove = document.createElement('div');
    remove.innerHTML = '❌';
    remove.title = 'Удалить товар из корзины';
    remove.style = 'cursor: pointer;'
    remove.addEventListener('click', () => deleteFromShopCart(item));
    let amountInput = document.createElement('input');
    amountInput.setAttribute('type', 'number');
    amountInput.value = '1';
    let addToShoppingCart = document.createElement('button');
    addToShoppingCart.innerHTML = 'Добавить в корзину';
    addToShoppingCart.classList.add(ADD_TO_SHOPCART);
    addToShoppingCart.classList.add('beauty-button');
    addToShoppingCart.style = 'width: 200px';
    addToShoppingCart.addEventListener('click', () => {
        getActiveRoles().then(res => {
            let length_ = res.length;
            let isAuthorized = false;
            for (let i = 0; i < length_; i++) {
                if (res[i] === 'ROLE_USER') {
                    isAuthorized = true;
                    break;
                }
            }
            if (isAuthorized) {
                addToShopCart(item, amountInput.value);
            }
            else {
                let goToAuthorization = confirm('Для добавления товаров в корзину необходимо войти в аккаунт.' +
                    ' Перейти на страницу авторизации?');
                if (goToAuthorization) {
                    window.location.href = 'authorization.html';
                }
            }
        });

    });
    shopCartCont.appendChild(remove);
    shopCartCont.appendChild(amountInput);
    shopCartCont.appendChild(addToShoppingCart);
}

async function getItemInfo(itemName) {
    let url = getUrl(Endpoints.GET_ITEM_BY_NAME) + '?' + new URLSearchParams({name: itemName});
    const response = await fetch(url);
    return response.json();
}