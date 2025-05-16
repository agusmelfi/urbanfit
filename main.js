import { products } from "./products.js";


let cart = [];

// Mostrar carrito
function toggleCart() {
  document.getElementById("cart").classList.toggle("visible");
}

document.getElementById("cart-link").addEventListener("click", (e) => {
  e.preventDefault();
  toggleCart();
});

document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart").classList.remove("visible");
});

document.getElementById("buy-cart").addEventListener("click", () => {
 
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const email = prompt("Enter your email to receive your resume:");
  if (!email || !email.includes("@")) {
    alert("Invalid email.");
    return;
  }

  const orderId = "UF-" + Math.floor(100000 + Math.random() * 900000);
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const orders = cart.map(item => ({
    name: item.name,
    price: item.price,
    units: 1 // o la cantidad que desees
  }));
  

  const templateParams = {
    email: email,
    order_id: orderId,
    orders: orders,
    cost: {
      total: total,
      tax: 0,
      shipping: 0
    }
  };
  

  emailjs.send('service_u6toczi', 'template_55h0lxc', templateParams)
    .then(() => {
      alert(`Purchase registered. Code: ${orderId}`);
      cart = [];
      updateCart();
    })
    .catch(err => {
      console.error("Error EmailJS:", err);
      alert("Error sending email.");
    });
});

document.addEventListener("click", (e) => {
  const cartEl = document.getElementById("cart");
  const link = document.getElementById("cart-link");
  if (
    !cartEl.contains(e.target) &&
    e.target !== link &&
    cartEl.classList.contains("visible")
  ) {
    cartEl.classList.remove("visible");
  }
});

// 👉 FUNCIONES PARA CARRITO

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartLink = document.getElementById('cart-link');

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
  cartLink.textContent = `Cart (${cart.length})`;
}

// 👉 RENDER PRODUCTOS

function renderProducts() {
  const grid = document.querySelector(".product-grid");
  grid.innerHTML = "";

  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = prod.category;

    card.innerHTML = `
      <img class="product-image" src="${prod.image}" alt="${prod.name}" />
      <h3>${prod.name}</h3>
      <p>$${prod.price}</p>
      <button data-id="${prod.id}">Add to Cart</button>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".product-card button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      addToCart(product);
    });
  });
}

// 👉 FILTRO POR CATEGORÍA

function setupCategoryFilter() {
  const filterButtons = document.querySelectorAll(".category-filter button");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".category-filter .active")?.classList.remove("active");
      btn.classList.add("active");

      const category = btn.dataset.category;
      const productCards = document.querySelectorAll(".product-card");

      productCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// 👉 INICIALIZAR
setupCategoryFilter();
renderProducts();