logOutIfNoRole('ROLE_USER').then();

header();
fillHeader().then();

let shopCart;
let ids;

function getIds() {
    shopCart = getShopCart();
    ids = [];
    for (let id in shopCart) {
        if (Object.prototype.hasOwnProperty.call(shopCart, id)) {
            ids.push(+id);
        }
    }
}

let itemsAndAmount = [];

let shopCartTable = document.getElementById('shop-cart-table');

loadItemsById().then();

async function loadItemsById() {
    getIds();
    const response = await fetch(getUrl(Endpoints.GET_LIST_OF_ITEMS_BY_IDS), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    });
    response.json().then(items => {
        let length = items.length;
        itemsAndAmount = [];
        for (let i = 0; i < length; i++) {
            try {
                itemsAndAmount.push([items[i], shopCart[items[i]['item']['id']]]);
            } catch (e) {
                console.log(`${items[i]} ${e.message}`);
            }
        }
        showShopCart();
        main();
    });
}

let orderButton = document.getElementById('create-order-btn');
orderButton.addEventListener('click', createOrder);

let phoneInput = document.getElementById('create-order-phone-input');
let addressInput = document.getElementById('create-order-address-input');
let commentInput = document.getElementById('create-order-comment-input');

let phoneError = document.getElementById('order-phone-message');
let addressError = document.getElementById('order-address-message');
let commentError = document.getElementById('order-comment-message');

function main() {

}

function createOrder() {
    let isOk = true;
    let phoneNumber = validatePhoneNumber(phoneInput.value.trim());
    if (phoneNumber == null) {
        phoneError.innerText = 'Неверный формат номера телефона (Номер должен начинаться ' +
            'с 7/+7/8 и заканчиваться на 10 цифр; допустимые знаки: скобки, дефисы, точки и пробелы).'
        isOk = false;
    } else phoneError.innerText = '';

    let address = addressInput.value.trim();
    if (address.length < 7 || address.length > 100) {
        addressError.innerText = 'Адрес должен быть не короче 7 символов и не длиннее 100 символов.';
        isOk = false;
    } else addressError.innerText = '';

    let comment = commentInput.value.trim();
    if (comment.length > 200) {
        commentError.innerText = 'Длина комментария не должна превышать 200 символов.';
        isOk = false;
    } else commentError.innerText = '';

    if (itemsAndAmount.length === 0) {
        notify('Добавьте товары в корзину, чтобы оформить заказ!');
        isOk = false;
    }

    if (!isOk) return;

    let order = {
        'userId': getUserId(),
        'username': getUsername(),
        'firstName': getFirstName(),
        'lastName': getLastName(),
        'date': null,
        'phoneNumber': phoneNumber,
        'address': address,
        'comment': comment
    };
    let orderItems = [];
    itemsAndAmount.forEach(pair => {
        let item = pair[0];
        orderItems.push({
            'itemId': item['item']['id'],
            'name': item['item']['name'],
            'category': item['item']['category']['name'],
            'price': +item['item']['price'],
            'amount': +pair[1]
        });
    });
    order['items'] = orderItems;

    logOutIfNoRole('ROLE_USER').then(async _ => {
        await fetch(getUrl(Endpoints.CREATE_ORDER), {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(order)
        }).then(__ => {
           notify('Заказ успешно оформлен!');
        });
    });
}

function showShopCart() {
    getIds();
    if (itemsAndAmount.length === 0) {
        shopCartTable.innerHTML = 'Корзина пуста';
        shopCartTable.style = 'background: none;';
    } else {
        shopCartTable.innerHTML = '';
        addShopCartRow('Наименование товара', 'Категория',
            'Цена', 'Количество товаров в корзине', true, 'Действие');
        let totalAmount = 0;
        let totalPrice = 0;
        let itemAmount = 0;
        itemsAndAmount.forEach(pair => {
            itemAmount++;
            let item = pair[0];
            let amount = pair[1];
            let price = +item['item']['price'];
            addShopCartRow(capitalize(item['item']['name']),
                capitalize(item['item']['category']['name']), (price * amount) + ' ₽', +amount, false,
                true, item);
            totalAmount += amount;
            totalPrice += price * amount;
        });
        addShopCartRow(`Позиций в корзине: ${itemAmount}`, 'Итого',
            totalPrice + ' ₽', totalAmount, true, false);
    }
}

function addShopCartRow(itemName, category, price, amount, bold, deleteRow = null, item = null) {
    let itemNameElem = document.createElement('div');
    itemNameElem.innerHTML = bold ? `<b>${itemName}</b>` : itemName;
    if (item != null) {
        itemNameElem.classList.add('clickable');
        itemNameElem.addEventListener('click', () => {
            window.location.href = 'item.html?name=' + item.item.name;
        });
    }
    let categoryElem = document.createElement('div');
    categoryElem.innerHTML = bold ? `<b>${category}</b>` : category;
    let priceElem = document.createElement('div');
    priceElem.innerHTML = bold ? `<b>${price}</b>` : price;
    let amountElem = document.createElement('div');
    amountElem.innerHTML = bold ? `<b>${amount}</b>` : amount;
    let action = document.createElement('div');
    if (typeof deleteRow === 'string') {
        action.innerHTML = bold ? `<b>${deleteRow}</b>` : deleteRow;
    } else {
        action.innerHTML = '❌';
        action.classList.add('shopCartDeleteBtn');
        if (deleteRow === true) {
            action.title = 'Удалить позицию из корзины';
            action.addEventListener('click', () => {
                deleteFromShopCart(item);
                notify(`Позиция "${itemName}" удалена из корзины`);
                loadItemsById().then();
            });
        } else {
            action.title = 'Очистить корзину';
            action.addEventListener('click', () => {
                clearShopCart();
                notify('Корзина очищена');
                loadItemsById().then();
            });
        }
    }

    shopCartTable.appendChild(itemNameElem);
    shopCartTable.appendChild(categoryElem);
    shopCartTable.appendChild(amountElem);
    shopCartTable.appendChild(priceElem);
    shopCartTable.appendChild(action);
}

function validatePhoneNumber(str) {
    str = (str + '').replace(/([() \-.])/gm, '');
    if (!/^((\+7|7|8)+[0-9]{10})$/.test(str)) return null;
    if (str.charAt(0) === '+') str = str.slice(1);
    return '8' + str.slice(1);
}

