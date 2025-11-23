// Simple cart implementation using localStorage
(function(){
  const STORAGE_KEY = 'aem_cart_v1';
  const cartCountEl = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartEmptyEl = document.getElementById('cart-empty');

  function readCart(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]') }catch(e){ return [] }
  }
  function writeCart(cart){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

  function getCount(){ return readCart().reduce((s,it)=>s+it.qty,0); }

  function formatPrice(n){ return n + '€'; }

  function updateCountUI(){ if(cartCountEl) cartCountEl.textContent = getCount(); }

  function renderCart(){
    const cart = readCart();
    cartItemsEl.innerHTML = '';
    if(cart.length===0){ cartEmptyEl.style.display = 'block'; cartTotalEl.textContent = '0€'; return }
    cartEmptyEl.style.display = 'none';
    let total = 0;
    cart.forEach(item=>{
      total += item.qty * Number(item.price);
      const row = document.createElement('div'); row.className='cart-item';
      row.innerHTML = `
        <img src="${item.image||'Maillot 1.png'}" alt="${item.name}">
        <div style="flex:1">
          <div style="font-weight:600">${item.name}</div>
          <div style="color:#666">${formatPrice(item.price)} x ${item.qty}</div>
        </div>
        <div>
          <button data-id="${item.id}" class="cart-dec" style="margin-right:6px">-</button>
          <button data-id="${item.id}" class="cart-inc">+</button>
          <button data-id="${item.id}" class="cart-remove" style="display:block;margin-top:6px;color:#c23;background:transparent;border:0;cursor:pointer">Suppr</button>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });
    cartTotalEl.textContent = formatPrice(total);
  }

  function addToCart(item){
    const cart = readCart();
    const found = cart.find(i=>i.id===item.id);
    if(found){ found.qty += 1 } else { cart.push(Object.assign({qty:1},item)); }
    writeCart(cart); updateCountUI(); renderCart();
  }

  function changeQty(id,delta){
    const cart = readCart();
    const idx = cart.findIndex(i=>i.id===id); if(idx<0) return;
    cart[idx].qty += delta; if(cart[idx].qty<=0) cart.splice(idx,1);
    writeCart(cart); updateCountUI(); renderCart();
  }

  function removeItem(id){ const cart = readCart().filter(i=>i.id!==id); writeCart(cart); updateCountUI(); renderCart(); }

  // wire add-to-cart buttons
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t.classList && t.classList.contains('add-to-cart')){
      const id = t.dataset.id; const name = t.dataset.name; const price = t.dataset.price;
      addToCart({id,name,price});
      // show brief confirmation
      t.textContent = 'Ajouté'; setTimeout(()=>t.textContent='Ajouter au panier',800);
    }

    if(t.classList && t.classList.contains('cart-inc')){ changeQty(t.dataset.id,1); }
    if(t.classList && t.classList.contains('cart-dec')){ changeQty(t.dataset.id,-1); }
    if(t.classList && t.classList.contains('cart-remove')){ removeItem(t.dataset.id); }
  });

  // cart open/close: click on Panier in header toggles modal
  document.addEventListener('DOMContentLoaded', ()=>{
    updateCountUI(); renderCart();
    const headerCart = Array.from(document.querySelectorAll('.headband')).find(a=>a.textContent.trim().startsWith('Panier'));
    if(headerCart){ headerCart.addEventListener('click', function(e){ e.preventDefault(); cartModal.classList.toggle('visible'); cartModal.setAttribute('aria-hidden', !cartModal.classList.contains('visible')); }); }
    // clear and checkout
    document.getElementById('clear-cart').addEventListener('click', ()=>{ localStorage.removeItem(STORAGE_KEY); updateCountUI(); renderCart(); });
    document.getElementById('checkout').addEventListener('click', ()=>{ alert('Merci pour votre commande ! (demo)'); localStorage.removeItem(STORAGE_KEY); updateCountUI(); renderCart(); cartModal.classList.remove('visible'); });
  });

})();
