const ITEM_CATALOG_CONTAINER = 'item-catalog-cont';

const ITEM_CATALOG_HEADER = 'item-catalog-header';

const ITEM_TILE = 'item-tile-class'

const INGREDIENT_LIST = 'ingredient-list';

const ITEM_INFO = 'item-info';

const COST_INFO = 'cost-info';

const REMOVE_FROM_SHOPCART = 'remove-from_shop-cart';

const ADD_TO_SHOPCART = 'add-to-shop-cart';

const CATEGORY_BUTTON = 'category-button';

const LOCALHOST = 1468;

const NAME_REGEX = /^[a-zA-Zа-яА-Я'\- ]+$/

const USERNAME_REGEX = /^[a-zA-Z\-_.0-9]+$/

const HAS_TWO_LETTERS_REGEX = /[A-Za-zа-яА-Я](.{0,30})[A-Za-zа-яА-Я]/

const HAS_LATIN_LETTER_REGEX = /[A-Za-z]/

class Endpoints {
    static GET_CATALOG_ITEMS = 'catalog/getAllCatalogItems';
    static GET_CATEGORIES = 'catalog/getCategories';
    static GET_ITEM_BY_NAME = 'catalog/getCatalogItemByName';
    static GET_ITEM_BY_ID = 'catalog/getCatalogItemById';
    static GET_INGREDIENTS = 'catalog/getIngredients';
    static GET_LIST_OF_ITEMS_BY_IDS = 'catalog/getListOfCatalogItemsByIds';

    static REG_ENDPOINT = 'auth/register';
    static LOGIN_ENDPOINT = 'auth/login';
    static ACTIVE_ROLES_ENDPOINT = 'auth/activeRoles';

    static SAVE_FOOD = 'catalog/saveFood';
    static SAVE_EXTRA_ITEM = 'catalog/saveExtraItem';
    static SAVE_INGREDIENT = 'catalog/saveIngredient';
    static SAVE_CATEGORY = 'catalog/saveCategory';

    static DELETE_CATALOG_ITEM = 'catalog/deleteCatalogItem';

    static CREATE_ORDER = 'catalog/saveOrder';

    static GET_ORDERS = 'catalog/getOrders';
    static GET_ORDERS_BY_USER_ID = 'catalog/getOrdersByUserId';

    static DELETE_ORDER = 'catalog/deleteOrder';
    static DELETE_INGREDIENT = 'catalog/deleteIngredient';
    static DELETE_CATEGORY = 'catalog/deleteCategory';
}

function getUrl(endpoint) {
    return `http://localhost:${LOCALHOST}/api/${endpoint}`;
}

function isFoodCategory(category) {
    return FOOD_CATEGORIES.includes(category);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const IMG_NAME_BEGINNING = 'DOWNLOADEDD';

function imgPathByImgName(name) {
    if (name.length < 11) {
        console.log(`img\\${name}`);
        return `img\\${name}`;
    }

    let slice = name.slice(0, 11);
    console.log(slice);
    if (slice === IMG_NAME_BEGINNING) {
        console.log(`D:\\Main\\Downloads\\${name}`);
        return `D:\\Main\\Downloads\\${name}`;
    }
    console.log(`img\\${name}`);
    return `img\\${name}`;
}

const HEADER_ID = 'header-generated-in-global-id';

function header() {
    let header = document.createElement('div');
    header.id = HEADER_ID;
    header.classList.add('header');
    document.body.appendChild(header);
}
async function fillHeader() {
    let header = document.getElementById(HEADER_ID);
    header.innerHTML = '';

    let catalogLink = document.createElement('a');
    catalogLink.href = 'catalog.html';
    catalogLink.innerText = 'Каталог';
    let createLink = document.createElement('a');
    createLink.href = 'itemUpdateCreate.html?mode=create';
    createLink.innerText = 'Создать товар';

    let authLink = document.createElement('a');
    authLink.innerText = 'Войти';
    authLink.style = 'color: yellow; cursor: pointer';
    authLink.addEventListener('click', () => {
        console.log('log out...');
        clearLSAuthData();
        window.location.replace('authorization.html')
    });
    let logOutLink = document.createElement('a');
    logOutLink.innerText = 'Выйти';
    logOutLink.style = 'color: yellow; cursor: pointer';
    logOutLink.addEventListener('click', () => {
        console.log('log out...');
        clearLSAuthData();
        window.location.replace('authorization.html')
    });

    let shopCartLink = document.createElement('a');
    shopCartLink.href = 'shoplist.html';
    shopCartLink.innerText = 'Корзина';
    let ordersLink  = document.createElement('a');
    ordersLink.href = 'orders.html';
    ordersLink.innerText = 'Ваши заказы';
    let allOrdersLink  = document.createElement('a');
    allOrdersLink.href = 'orders.html?admin=true';
    allOrdersLink.innerText = 'Все заказы';
    let ingrsLink  = document.createElement('a');
    ingrsLink.href = 'ingredients.html';
    ingrsLink.innerText = 'Ингредиенты';
    let categoryLink  = document.createElement('a');
    categoryLink.href = 'categories.html';
    categoryLink.innerText = 'Категории';

    let profileName = document.createElement('p');
    profileName.style = 'max-width: 250px; cursor: pointer';
    profileName.title = `Имя: ${getFirstName()}\nФамилия: ${getLastName()}\nЛогин: ${getUsername()}`;
    profileName.innerText = `${getFirstName()} ${getLastName()}`;

    getActiveRoles().then(roles => {
        console.log(roles);
        if (roles.includes('ROLE_ADMIN')) {
            header.appendChild(catalogLink);
            header.appendChild(createLink);
            header.appendChild(ingrsLink);
            header.appendChild(categoryLink);
            header.appendChild(allOrdersLink);
            header.appendChild(ordersLink);
            header.appendChild(shopCartLink);
            header.appendChild(profileName);
            header.appendChild(logOutLink);
            return;
        }
        if (roles.includes('ROLE_USER')) {
            header.appendChild(catalogLink);
            header.appendChild(shopCartLink);
            header.appendChild(ordersLink);
            header.appendChild(profileName);
            header.appendChild(logOutLink);
            return;
        }
            header.appendChild(catalogLink);
            header.appendChild(authLink);
    });
}

const USERNAME_KEY = 'sushi-shop-username-local-storage'
const TOKEN_KEY = 'sushi-shop-bearer-token-local-storage';
const USER_ID_KEY = 'sushi-shop-user-id-local-storage';
const FIRSTNAME_KEY = 'sushi-shop-first-name-local-storage';
const LASTNAME_KEY = 'sushi-shop-last-name-local-storage';

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setUsername(username) {
    localStorage.setItem(USERNAME_KEY, username);
}

function getUsername() {
    return localStorage.getItem(USERNAME_KEY);
}

function setUserId(id) {
    localStorage.setItem(USER_ID_KEY, id);
}

function getUserId() {
    return localStorage.getItem(USER_ID_KEY);
}


function getFirstName() {
    return localStorage.getItem(FIRSTNAME_KEY);
}

function setFirstName(firstName) {
    localStorage.setItem(FIRSTNAME_KEY, firstName);
}

function getLastName() {
    return localStorage.getItem(LASTNAME_KEY);
}

function setLastName(lastName) {
    localStorage.setItem(LASTNAME_KEY, lastName);
}

function clearLSAuthData() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(FIRSTNAME_KEY);
    localStorage.removeItem(LASTNAME_KEY);
}

async function getCategories() {
    const response = await fetch(getUrl(Endpoints.GET_CATEGORIES), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

async function getIngredients() {
    const response = await fetch(getUrl(Endpoints.GET_INGREDIENTS), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

async function getActiveRoles() {
    const response = await fetch(getUrl(Endpoints.ACTIVE_ROLES_ENDPOINT), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer_${getToken()}`
        }
    });
    return await response.json();
}

async function logOutIfNoRole(role) {
    getActiveRoles().then(result => {
        try {
            if (!result.includes(role)) {
                window.location.href = 'authorization.html';
            }
        } catch {
        }
    });
}

const MAX_ITEM_ORDER_AMOUNT = 10;

function saveShopCart(shopCart) {
    localStorage.setItem('ls-basket-' + getUsername(), JSON.stringify(shopCart));
}

function getShopCart() {
    let shopCart = localStorage.getItem('ls-basket-' + getUsername());
    if (shopCart == null) return {};
    return JSON.parse(shopCart);
}

function clearShopCart() {
    localStorage.setItem('ls-basket-' + getUsername(), JSON.stringify({}));
}

function addToShopCart(item, amount) {
    amount = +amount;
    if (amount === 0) {
        notify('Укажите количество добавляемых в корзину товаров');
        return;
    }
    if (amount % 1 !== 0) {
        notify('Количество добавляемых товаров должно быть целым');
        return;
    }
    if (amount < 0) {
        notify('Количество добавляемых товаров не должно быть отрицательным');
        return;
    }
    let shopCart = getShopCart();
    let currentAmount = shopCart[item.item.id];
    if (currentAmount === undefined) currentAmount = 0;
    if (amount + currentAmount > MAX_ITEM_ORDER_AMOUNT) {
        notify(`Товар не добавлен в корзину: превышено максимальное количество ` +
        `одинаковых товаров в заказе (${MAX_ITEM_ORDER_AMOUNT}).`);
        return;
    }
    currentAmount += amount;
    shopCart[item.item.id] = currentAmount;
    saveShopCart(shopCart);
    notify(`Товар (${capitalize(item.item.name)}, ${amount}шт.) добавлен в корзину.`);
}

function deleteFromShopCart(item) {
    let shopCart = getShopCart();
    if (!(shopCart[item.item.id] === undefined)) {
        delete shopCart[item.item.id];
        saveShopCart(shopCart);
        notify(`Товар "${capitalize(item.item.name)}" удалён из корзины.`);
    }
}

function notify(text) {
    let previousNotifications = document.getElementsByClassName('notification');
    for (let i = 0; i < previousNotifications.length; i++) {
        let element = previousNotifications.item(i);
        element.parentNode.removeChild(element);
    }
    let notification = document.createElement('div');
    let textElem = document.createElement('p');
    let loading = document.createElement('div');
    notification.classList.add('notification');
    textElem.innerText = text;
    notification.appendChild(textElem);
    notification.appendChild(loading);
    notification.addEventListener('click', () => {
        notification.parentNode.removeChild(notification);
    });
    document.body.appendChild(notification);
    setTimeout(() => loading.style = 'margin-left: -400px;', 200);
    setTimeout(() => notification.parentNode.removeChild(notification), 6000);
}