logOutIfNoRole('ROLE_USER').then();

header();
fillHeader().then();

let params = new URLSearchParams(window.location.search);

let isAdmin = params.get('admin');

let orders = [];

let ordersHeader = document.getElementById('orders-h1');
let noOrders = document.getElementById('if-no-orders');

if (isAdmin === 'true') {
    logOutIfNoRole('ROLE_ADMIN').then(async _ => {
        console.log("ordersHeader.innerText = 'Все заказы';")
        ordersHeader.innerHTML = 'Все заказы';
        await (await fetch(getUrl(Endpoints.GET_ORDERS))).json().then(orders_ => {
            // console.log(orders_);
            let length = orders_.length;
            for (let i = 0; i < length; i++) {
                orders.push(orders_[i]);
            }
            main();
        });
    });
} else {
    console.log("ordersHeader.innerText = 'Ваши заказы заказы';")
    ordersHeader.innerHTML = 'Ваши заказы';
    loadOrdersById().then();
}

async function loadOrdersById() {
    await (await fetch(getUrl(Endpoints.GET_ORDERS_BY_USER_ID + '/' + getUserId()))).json()
        .then(orders_ => {
            console.log(orders_);
            let length = orders_.length;
            for (let i = 0; i < length; i++) {
                orders.push(orders_[i]);
            }
            main();
        });
}

let ordersListElem;



function main() {
    if (orders.length === 0) {
        noOrders.innerHTML = 'Нет заказов';
        return;
    }
    noOrders.innerHTML = '';

    orders.sort((o1, o2) => compareDates(o1['date'], o2['date']));

    ordersListElem = document.getElementById('orders-list');
    orders.forEach(order => {

        ordersListElem.appendChild(createOrderTable(order));
    });
}

function createOrderTable(order) {
    let orderElem = document.createElement("div");
    orderElem.classList.add('orderElem');

    let headCont = document.createElement('div');
    headCont.classList.add('order-head-cont');
    let deleteBtn = document.createElement('p');
    deleteBtn.innerText = '❌';
    deleteBtn.title = 'Отменить заказ';
    deleteBtn.addEventListener('click', async () => {
        getActiveRoles().then(roles => {
            if (roles === []) window.location.href = 'authorization.html';
            if (roles.includes('ROLE_ADMIN') && isAdmin) {
                let continueDeleting = confirm(`Вы хотите отменить заказ пользователя ${
                    order['firstName']} ${order['lastName']
                } от ${beautifyDate(new Date(Date.parse(order['date'])))}. Продолжить?`);
                if (continueDeleting) {
                    fetch(getUrl(Endpoints.DELETE_ORDER + '/' + order['id']), {method: 'DELETE'})
                        .then(_ => {
                            orderElem.parentNode.removeChild(orderElem);
                            orders.splice(orders.indexOf(order), 1);
                            if (orders.length === 0) {
                                noOrders.innerHTML = 'Нет заказов';
                            }
                            notify(`Заказ пользователя ${
                                order['firstName']} ${order['lastName']
                            } от ${beautifyDate(new Date(Date.parse(order['date'])))} отменён.`);
                        });
                }
            } else {
                let continueDeleting = confirm(`Вы хотите отменить заказ от ${
                    beautifyDate(new Date(Date.parse(order['date'])))}. Продолжить?`);
                if (continueDeleting) {
                    fetch(getUrl(Endpoints.DELETE_ORDER + '/' + order['id']), {method: 'DELETE'})
                        .then(_ => {
                            orderElem.parentNode.removeChild(orderElem);
                            orders.splice(orders.indexOf(order), 1);
                            if (orders.length === 0) {
                                noOrders.innerHTML = 'Нет заказов';
                            }
                            notify(`Заказ от ${
                                beautifyDate(new Date(Date.parse(order['date'])))} отменён.`);
                        });
                }
            }
        });
    });

    let orderId = document.createElement('h5');
    orderId.innerHTML = `ID заказа: ${order['id']}`;
    let orderUser = document.createElement('h3');
    orderUser.innerHTML = `Заказ пользователя ${order['firstName']} ${order['lastName']} (${order['username']})`;
    let orderDate = document.createElement('h4');
    let number = Date.parse(order['date']);
    orderDate.innerHTML = `Заказ от ${beautifyDate(new Date(number))}`;

    let orderTable = document.createElement('div');
    orderTable.classList.add('order-table');
    let nameHeader = document.createElement('div');
    let categoryHeader = document.createElement('div');
    let amountHeader = document.createElement('div');
    let priceHeader = document.createElement('div');
    nameHeader.innerHTML = '<b>Наименование товара</b>';
    orderTable.appendChild(nameHeader);
    categoryHeader.innerHTML = '<b>Категория</b>';
    orderTable.appendChild(categoryHeader);
    amountHeader.innerHTML = '<b>Количество товаров в корзине</b>';
    orderTable.appendChild(amountHeader);
    priceHeader.innerHTML = '<b>Цена</b>';
    orderTable.appendChild(priceHeader);

    let orderItems = order['items'];
    let length = orderItems.length;
    let positionsAmount = 0;
    let itemsAmount = 0;
    let totalPrice = 0;
    for (let i = 0; i < length; i++) {
        let item = orderItems[i];
        let name = document.createElement('div');
        name.innerHTML = capitalize(item['name']);
        name.classList.add('clickable');
        name.addEventListener('click', () => {
            window.location.href = 'item.html?name=' + item['name'];
        });
        let category = document.createElement('div');
        category.innerHTML = capitalize(item['category']);
        let amountValue = +item['amount'];
        let priceValue = +item['price'];
        let amount = document.createElement('div');
        amount.innerHTML = amountValue;
        let price = document.createElement('div');
        let priceOfPosition = priceValue * amountValue;
        price.innerHTML = priceOfPosition + ' ₽';
        positionsAmount++;
        itemsAmount += amountValue;
        totalPrice += priceOfPosition;
        orderTable.appendChild(name);
        orderTable.appendChild(category);
        orderTable.appendChild(amount);
        orderTable.appendChild(price);
    }
    nameHeader = document.createElement('div');
    categoryHeader = document.createElement('div');
    amountHeader = document.createElement('div');
    priceHeader = document.createElement('div');
    nameHeader.innerHTML = `<b>Позиций в корзине: ${positionsAmount}</b>`;
    orderTable.appendChild(nameHeader);
    categoryHeader.innerHTML = '<b>Итого</b>';
    orderTable.appendChild(categoryHeader);
    amountHeader.innerHTML = `<b>${itemsAmount}</b>`;
    orderTable.appendChild(amountHeader);
    priceHeader.innerHTML = `<b>${totalPrice} ₽</b>`;
    orderTable.appendChild(priceHeader);

    let address = document.createElement('h3');
    address.innerText = `Адрес: ${order['address']}`;
    let phoneNumber = document.createElement('h3');
    phoneNumber.innerText = `Номер телефона: ${beautifyPhoneNumber(order['phoneNumber'])}`;
    let comment = document.createElement('p');
    comment.innerText = `Комментарий к заказу: <${order['comment']}>`;

    orderDate.classList.add('text-elem');
    orderId.classList.add('text-elem');
    phoneNumber.classList.add('text-elem');
    address.classList.add('text-elem');
    comment.classList.add('text-elem');

    headCont.appendChild(orderUser);
    headCont.appendChild(deleteBtn);
    orderElem.appendChild(headCont);
    orderElem.appendChild(orderDate);
    orderElem.appendChild(orderId);
    orderElem.appendChild(orderTable);
    orderElem.appendChild(phoneNumber);
    orderElem.appendChild(address);
    if (order['comment'].trim().length !== 0)
        orderElem.appendChild(comment);
    return orderElem;
}

function twoChars(char) {
    char = `${char}`;
    if (char.length === 1) {
        return '0' + char;
    }
    return char;
}

function beautifyPhoneNumber(number) {
    return `+7(${number.slice(1, 4)}) ${number.slice(4, 7)}-${number.slice(7, 9)}-${number.slice(9)}`;
}

function beautifyDate(date) {
    return `${
        twoChars(date.getDate())
    }.${
        twoChars(date.getMonth() + 1)
    }.${
        date.getFullYear()
    } ${
        twoChars(date.getHours())
    }:${
        twoChars(date.getMinutes())
    }`;
}

function compareDates(date1, date2) {
    date1 = +Date.parse(date1);
    date2 = +Date.parse(date2);
    if (date1 < date2) return 1;
    if (date1 > date2) return -1;
    if (date2 === date1) return 0;

}