// Système de panier avec localStorage
(function () {

  const STORAGE_KEY = "aem_cart_v1";

  // Éléments du DOM
  const cartCountEl = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const cartEmptyEl = document.getElementById("cart-empty");

  /* ==========================================================
     Fonctions utilitaires
  ========================================================== */

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function getCount() {
    return readCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function formatPrice(n) {
    return Number(n).toFixed(2).replace(".00", "") + "€";
  }

  function updateCountUI() {
    if (cartCountEl) cartCountEl.textContent = getCount();
  }

  /* ==========================================================
     Rendu du panier
  ========================================================== */

  function renderCart() {
    const cart = readCart();

    if (!cartItemsEl || !cartTotalEl || !cartEmptyEl) return;

    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      cartEmptyEl.style.display = "block";
      cartTotalEl.textContent = "0€";
      return;
    }

    cartEmptyEl.style.display = "none";

    let total = 0;

    cart.forEach((item) => {
      total += item.qty * Number(item.price);

      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1">
          <div style="font-weight:600">${item.name}</div>
          <div style="color:#666">${formatPrice(item.price)} × ${item.qty}</div>
        </div>
        <div>
          <button data-id="${item.id}" class="cart-dec">-</button>
          <button data-id="${item.id}" class="cart-inc">+</button>
          <button data-id="${item.id}" class="cart-remove" 
                  style="display:block;margin-top:6px;color:#c23;background:transparent;border:0;cursor:pointer">
            Suppr
          </button>
        </div>
      `;

      cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = formatPrice(total);
  }

  /* ==========================================================
     Gestion du panier
  ========================================================== */

  function addToCart(item) {
    const cart = readCart();
    const found = cart.find((i) => i.id === item.id);

    if (found) {
      found.qty += 1;
    } else {
      cart.push({ qty: 1, ...item });
    }

    writeCart(cart);
    updateCountUI();
    renderCart();
  }

  function changeQty(id, delta) {
    const cart = readCart();
    const idx = cart.findIndex((i) => i.id === id);

    if (idx < 0) return;

    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);

    writeCart(cart);
    updateCountUI();
    renderCart();
  }

  function removeItem(id) {
    const cart = readCart().filter((i) => i.id !== id);
    writeCart(cart);
    updateCountUI();
    renderCart();
  }

  /* ==========================================================
     Events
  ========================================================== */

  document.addEventListener("click", function (e) {
    const target = e.target;

    // Bouton "Ajouter au panier"
    if (target.classList.contains("add-to-cart")) {

      const parent = target.closest(".product");
      const img = parent.querySelector("img").getAttribute("src");
      const priceText = parent.querySelector(".price").textContent.replace("€", "");

      const item = {
        id: target.dataset.id,
        name: parent.querySelector("h3").textContent,
        price: Number(priceText),
        image: img
      };

      addToCart(item);

      // Animation feedback
      target.textContent = "Ajouté";
      setTimeout(() => (target.textContent = "Ajouter au panier"), 800);
    }

    if (target.classList.contains("cart-inc")) changeQty(target.dataset.id, 1);
    if (target.classList.contains("cart-dec")) changeQty(target.dataset.id, -1);
    if (target.classList.contains("cart-remove")) removeItem(target.dataset.id);
  });

  // Ouverture / Fermeture du panier
  document.addEventListener("DOMContentLoaded", () => {
    updateCountUI();
    renderCart();

    const headerCart = Array.from(document.querySelectorAll(".headband"))
      .find((a) => a.textContent.includes("Panier"));

    if (headerCart && cartModal) {
      headerCart.addEventListener("click", (e) => {
        e.preventDefault();
        cartModal.classList.toggle("visible");
        cartModal.setAttribute("aria-hidden", !cartModal.classList.contains("visible"));
      });
    }

    // Vider panier
    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        updateCountUI();
        renderCart();
      });
    }

    // Commander
    const checkoutBtn = document.getElementById("checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        alert("Merci pour votre commande ! (Démo)");
        localStorage.removeItem(STORAGE_KEY);
        updateCountUI();
        renderCart();
        cartModal.classList.remove("visible");
      });
    }
  });

})();
