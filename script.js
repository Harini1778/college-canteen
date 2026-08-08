// ==========================================
// FIREBASE
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAaK7JO2Yn7Erq2V_qReXJdfwYHyUpaedA",
    authDomain: "smart-queue-canteen.firebaseapp.com",
    projectId: "smart-queue-canteen",
    storageBucket: "smart-queue-canteen.firebasestorage.app",
    messagingSenderId: "22268898480",
    appId: "1:22268898480:web:33571d22ba947b18b19f75",
    measurementId: "G-Y1NLR0DT0Z"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// TIME
// ==========================================

let hour = new Date().getHours();

let menuItems = [];


// ==========================================
// CART
// ==========================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// FIREBASE MENU
// ==========================================

async function loadMenuFromFirebase() {

    try {

        const querySnapshot =
            await getDocs(collection(db, "menu"));

        let firebaseItems = [];

        querySnapshot.forEach((doc) => {

            const data = doc.data();

            if (
                data.name &&
                data.price !== undefined
            ) {

                firebaseItems.push([
                    data.name,
                    data.price
                ]);

            }

        });

        console.log(
            "Firebase menu:",
            firebaseItems
        );

        createTimeBasedMenu(firebaseItems);

    }

    catch (error) {

        console.error(
            "Firebase error:",
            error
        );

        createTimeBasedMenu([]);

    }

}


// ==========================================
// TIME-BASED MENU
// ==========================================

function createTimeBasedMenu(firebaseItems) {

    // BREAKFAST
    if (hour >= 7 && hour < 11) {

        menuItems = [

            ["Idli", 20],
            ["Dosa", 40],
            ["Pongal", 35],
            ["Poori", 40],
            ["Vada", 15],
            ["Tea", 10],
            ["Coffee", 15]

        ];

    }


    // BETWEEN BREAKFAST AND LUNCH
    else if (hour >= 11 && hour < 12) {

        menuItems = [];

    }


    // LUNCH
    else if (hour >= 12 && hour < 15) {

        menuItems = [

            ["Meals", 80],
            ["Variety Rice", 70],
            ["Fried Rice", 90],
            ["Chapati", 40],
            ["Veg Biryani", 100],
            ["Curd Rice", 50]

        ];

    }


    // SNACKS
    else if (hour >= 15 && hour < 18) {

        menuItems = [

            ["Samosa", 20],
            ["Bajji", 20],
            ["Puffs", 30],
            ["Sandwich", 50],
            ["French Fries", 60],
            ["Fresh Juice", 40]

        ];

    }


    // DINNER
    else {

        menuItems = [

            ["Parotta", 45],
            ["Noodles", 80],
            ["Idiyappam", 50]

        ];

    }


    // USE FIREBASE PRICES
    menuItems =
        menuItems.map(item => {

            const firebaseItem =
                firebaseItems.find(
                    food => food[0] === item[0]
                );


            if (firebaseItem) {

                return [
                    firebaseItem[0],
                    firebaseItem[1]
                ];

            }

            return item;

        });


    startPage();

}


// ==========================================
// IMAGE PATHS
// ==========================================

function getImage(name) {

    const images = {

        "Idli": "images/idli.png",
        "Dosa": "images/dosa.png",
        "Pongal": "images/pongal.png",
        "Poori": "images/poori.png",
        "Vada": "images/vada.png",
        "Tea": "images/tea.png",
        "Coffee": "images/coffee.png",

        "Meals": "images/meals.png",
        "Variety Rice": "images/variety_rice.png",
        "Fried Rice": "images/fried_rice.png",
        "Chapati": "images/chapati.png",
        "Veg Biryani": "images/veg_biryani.png",
        "Curd Rice": "images/curd_rice.png",

        "Samosa": "images/samosa.png",
        "Bajji": "images/bajji.png",
        "Puffs": "images/puffs.png",
        "Sandwich": "images/sandwich.png",
        "French Fries": "images/french_fries.png",
        "Fresh Juice": "images/fresh_juice.png",

        "Parotta": "images/parotta.png",
        "Noodles": "images/noodles.png",
        "Idiyappam": "images/idiyappam.png"

    };


    return images[name];

}


// ==========================================
// START PAGE
// ==========================================

function startPage() {

    // MENU PAGE
    const menu =
        document.getElementById("menuItems");


    if (menu) {

        renderMenu();


        const viewCartBtn =
            document.getElementById(
                "viewCartBtn"
            );


        if (menuItems.length === 0) {

            if (viewCartBtn) {

                viewCartBtn.style.display =
                    "none";

            }

        }

        else {

            if (viewCartBtn) {

                viewCartBtn.style.display =
                    "block";

            }

            updateFooterBanner();

        }

    }


    // CART PAGE
    if (
        window.location.pathname.includes(
            "cart.html"
        )
    ) {

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        if (cart.length === 0) {

            window.location.href =
                "menu.html";

        }

        else {

            renderCart();

        }

    }


    // CONFIRMATION PAGE
    if (
        window.location.pathname.includes(
            "confirm.html"
        )
    ) {

        showConfirmation();

    }

}


// ==========================================
// ORDER FOOD BUTTON
// ==========================================

function setupOrderButton() {

    const orderBtn =
        document.getElementById(
            "orderBtn"
        );


    if (!orderBtn) return;


    orderBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "cart"
            );


            cart = [];


            window.location.href =
                "menu.html";

        }
    );

}


// ==========================================
// RENDER MENU
// ==========================================

function renderMenu() {

    const menu =
        document.getElementById(
            "menuItems"
        );


    if (!menu) return;


    menu.innerHTML = "";


    // NO MENU
    if (menuItems.length === 0) {

        menu.innerHTML = `

            <div style="
                text-align:center;
                padding:45px 20px;
            ">

                <h2>
                    🍽️ Breakfast is over!
                </h2>

                <p style="font-size:18px;">

                    Lunch starts at
                    <strong>12:00 PM</strong>

                </p>

                <p style="font-size:18px;">

                    Please come back at
                    12:00 PM 😊

                </p>

            </div>

        `;

        return;

    }


    // FOOD ITEMS
    menuItems.forEach(item => {

        const itemName =
            item[0];

        const itemPrice =
            item[1];


        const currentInCart =
            cart.find(
                c => c.name === itemName
            );


        const qty =
            currentInCart
                ? currentInCart.quantity
                : 0;


        const imgUrl =
            getImage(itemName);


        menu.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-details">

                    <img
                        src="${imgUrl}"
                        alt="${itemName}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${itemName}
                        </h3>

                        <p>
                            ₹${itemPrice}
                        </p>

                    </div>

                </div>


                <div class="cart-qty-control">

                    <button
                        onclick="decreaseQtyMenu('${itemName}')">
                        −
                    </button>


                    <span class="qty-count">
                        ${qty}
                    </span>


                    <button
                        onclick="addItem('${itemName}', ${itemPrice})">
                        +
                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================================
// ADD ITEM
// ==========================================

function addItem(name, price) {

    const found =
        cart.find(
            item => item.name === name
        );


    if (found) {

        found.quantity++;

    }

    else {

        cart.push({

            name: name,
            price: price,
            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderMenu();

    updateFooterBanner();

}


// ==========================================
// DECREASE FROM MENU
// ==========================================

function decreaseQtyMenu(name) {

    const item =
        cart.find(
            i => i.name === name
        );


    if (!item) return;


    if (item.quantity > 1) {

        item.quantity--;

    }

    else {

        cart =
            cart.filter(
                i => i.name !== name
            );

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderMenu();

    updateFooterBanner();

}


// ==========================================
// UPDATE VIEW CART
// ==========================================

function updateFooterBanner() {

    const viewCartBtn =
        document.getElementById(
            "viewCartBtn"
        );


    if (!viewCartBtn) return;


    let totalItems = 0;

    let totalAmount = 0;


    cart.forEach(item => {

        totalItems +=
            item.quantity;


        totalAmount +=
            item.price *
            item.quantity;

    });


    viewCartBtn.innerHTML =
        `View Cart (${totalItems}) - ₹${totalAmount}`;

}


// ==========================================
// GO TO CART
// ==========================================

function goToCart() {

    if (cart.length === 0) {

        alert(
            "Please select at least one food item."
        );

        return;

    }


    window.location.href =
        "cart.html";

}


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const total =
        document.getElementById(
            "total"
        );


    if (!cartItems) return;


    cartItems.innerHTML = "";


    let totalAmount = 0;


    cart.forEach(item => {

        const imgUrl =
            getImage(item.name);


        cartItems.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-details">

                    <img
                        src="${imgUrl}"
                        alt="${item.name}"
                    >


                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>


                        <p>
                            ₹${item.price} ×
                            ${item.quantity}
                        </p>

                    </div>

                </div>


                <div class="cart-qty-control">

                    <button
                        onclick="decreaseQty('${item.name}')">
                        −
                    </button>


                    <span class="qty-count">
                        ${item.quantity}
                    </span>


                    <button
                        onclick="increaseQty('${item.name}')">
                        +
                    </button>

                </div>

            </div>

        `;


        totalAmount +=
            item.price *
            item.quantity;

    });


    if (total) {

        total.innerHTML =
            `<span>Total Amount</span>
             <span>₹${totalAmount}</span>`;

    }

}


// ==========================================
// INCREASE CART QUANTITY
// ==========================================

function increaseQty(name) {

    const item =
        cart.find(
            i => i.name === name
        );


    if (item) {

        item.quantity++;

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderCart();

}


// ==========================================
// DECREASE CART QUANTITY
// ==========================================

function decreaseQty(name) {

    const item =
        cart.find(
            i => i.name === name
        );


    if (!item) return;


    if (item.quantity > 1) {

        item.quantity--;

    }

    else {

        cart =
            cart.filter(
                i => i.name !== name
            );

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    if (cart.length === 0) {

        window.location.href =
            "menu.html";

        return;

    }


    renderCart();

}


// ==========================================
// PLACE ORDER
// ==========================================

function placeOrder() {

    if (cart.length === 0) {

        alert(
            "Please select food items first."
        );

        return;

    }


    const name =
        document.getElementById(
            "studentName"
        ).value;


    const reg =
        document.getElementById(
            "registerNo"
        ).value;


    if (
        name.trim() === "" ||
        reg.trim() === ""
    ) {

        alert(
            "Please enter Name and Register Number"
        );

        return;

    }


    localStorage.setItem(
        "studentName",
        name
    );


    localStorage.setItem(
        "registerNo",
        reg
    );


    let totalOrders =
        parseInt(
            localStorage.getItem(
                "totalOrders"
            )
        ) || 0;


    totalOrders++;


    localStorage.setItem(
        "totalOrders",
        totalOrders
    );


    localStorage.setItem(
        "myOrderPosition",
        totalOrders
    );


    if (
        !localStorage.getItem(
            "completedOrders"
        )
    ) {

        localStorage.setItem(
            "completedOrders",
            0
        );

    }


    window.location.href =
        "confirm.html";

}


// ==========================================
// CONFIRMATION PAGE
// ==========================================

function showConfirmation() {

    const orderNumber =
        Math.floor(
            Math.random() * 900
        ) + 100;


    const orderId =
        document.getElementById(
            "orderId"
        );


    const student =
        document.getElementById(
            "student"
        );


    const reg =
        document.getElementById(
            "reg"
        );


    if (orderId) {

        orderId.innerHTML =
            "#C" + orderNumber;

    }


    if (student) {

        student.innerHTML =
            localStorage.getItem(
                "studentName"
            ) || "";

    }


    if (reg) {

        reg.innerHTML =
            localStorage.getItem(
                "registerNo"
            ) || "";

    }


    updateWaitingTime();

}


// ==========================================
// UPDATE WAITING TIME
// ==========================================

function updateWaitingTime() {

    const myPosition =
        parseInt(
            localStorage.getItem(
                "myOrderPosition"
            )
        ) || 1;


    const completedOrders =
        parseInt(
            localStorage.getItem(
                "completedOrders"
            )
        ) || 0;


    let peopleAhead =
        myPosition -
        completedOrders -
        1;


    if (peopleAhead < 0) {

        peopleAhead = 0;

    }


    const estimatedTime =
        10 +
        (peopleAhead * 5);


    const now =
        new Date();


    now.setMinutes(
        now.getMinutes() +
        estimatedTime
    );


    let hours =
        now.getHours();


    let minutes =
        now.getMinutes();


    const ampm =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


    hours =
        hours
            ? hours
            : 12;


    minutes =
        minutes < 10
            ? "0" + minutes
            : minutes;


    const pickup =
        document.getElementById(
            "pickup"
        );


    if (pickup) {

        pickup.innerHTML =
            `🕒 ${hours}:${minutes} ${ampm} (${estimatedTime} mins)`;

    }

}


function gotFood() {

    alert("Great! Your order has been collected 😊");

    localStorage.setItem(
        "myOrderCompleted",
        "yes"
    );

    localStorage.removeItem("cart");

    const button =
        document.getElementById("gotFoodBtn");

    if (button) {

        button.innerHTML =
            "✅ Food Collected";

        button.disabled = true;
    }
}


// ==========================================
// GO HOME
// ==========================================

function goHome() {

    localStorage.removeItem(
        "cart"
    );


    window.location.href =
        "index.html";

}


// ==========================================
// CLEAR CART
// ==========================================

function clearCart() {

    localStorage.removeItem(
        "cart"
    );


    cart = [];


    window.location.href =
        "menu.html";

}


// ==========================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================

window.addItem =
    addItem;

window.goToCart =
    goToCart;

window.increaseQty =
    increaseQty;

window.decreaseQty =
    decreaseQty;

window.decreaseQtyMenu =
    decreaseQtyMenu;

window.placeOrder =
    placeOrder;

window.gotFood =
    gotFood;

window.goHome =
    goHome;

window.clearCart =
    clearCart;


// ==========================================
// START AFTER HTML LOADS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupOrderButton();

        const gotFoodBtn =
            document.getElementById("gotFoodBtn");

        if (gotFoodBtn) {
            gotFoodBtn.addEventListener(
                "click",
                gotFood
            );
        }

        loadMenuFromFirebase();

    }
);