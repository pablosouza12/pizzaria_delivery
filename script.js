// script.js
const menuData = [
    { id: 1, type: 'pizza', name: 'Calabresa', price: 45.00, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', desc: 'Calabresa fatiada, cebola e queijo.' },
    { id: 2, type: 'pizza', name: 'Marguerita', price: 42.00, img: 'https://images.unsplash.com/photo-1573821663171-41ae7006d8b7?w=500', desc: 'Mussarela, tomate e manjericão fresco.' },
    { id: 3, type: 'pizza', name: 'Portuguesa', price: 48.00, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', desc: 'Presunto, ovos, cebola, azeitona e ervilha.' },
    { id: 4, type: 'pizza', name: 'Quatro Queijos', price: 50.00, img: 'https://images.unsplash.com/photo-1564936281291-294551497d81?w=500', desc: 'Mussarela, provolone, parmesão e gorgonzola.' },
    { id: 5, type: 'pizza', name: 'Pepperoni', price: 52.00, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', desc: 'Mussarela e fatias deliciosas de pepperoni.' },
    { id: 6, type: 'drink', name: 'Coca-Cola 1L', price: 12.00, img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500', desc: 'Gelada' },
    { id: 7, type: 'drink', name: 'Guaraná Antarctica 1L', price: 11.00, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', desc: 'O original do Brasil' },
    { id: 8, type: 'drink', name: 'Budweiser', price: 9.00, img: 'https://images.unsplash.com/photo-1614315584058-294b4b4550a1?w=500', desc: 'Long Neck' },
    { id: 9, type: 'drink', name: 'Cerveja Zero (Heineken 0.0)', price: 10.00, img: 'https://images.unsplash.com/photo-1614315584058-294b4b4550a1?w=500', desc: 'Sem álcool' }
];

let cart = [];

function renderMenu() {
    const pizzaMenu = document.getElementById('pizza-menu');
    const drinkMenu = document.getElementById('drink-menu');
    
    menuData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow overflow-hidden card-hover';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-bold">${item.name}</h3>
                <p class="text-gray-600 text-sm h-10 mt-1">${item.desc}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="font-bold text-green-600 text-lg">R$ ${item.price.toFixed(2)}</span>
                    <button onclick="addToCart(${item.id})" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Adicionar</button>
                </div>
            </div>
        `;
        if (item.type === 'pizza') pizzaMenu.appendChild(card);
        else drinkMenu.appendChild(card);
    });
}

function addToCart(id) {
    const item = menuData.find(p => p.id === id);
    const existing = cart.find(p => p.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...item, quantity: 1 });
    updateCart();
    
    // Auto-open sidebar on first item for UX
    document.getElementById('cart-sidebar').classList.remove('translate-x-full');
}

function updateCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let subtotal = 0;
    let count = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        count += item.quantity;
        container.innerHTML += `
            <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                <div>
                    <h4 class="font-bold">${item.name}</h4>
                    <p class="text-sm text-gray-500">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="changeQty(${index}, -1)" class="bg-gray-200 px-2 py-1 rounded">-</button>
                    <button onclick="changeQty(${index}, 1)" class="bg-gray-200 px-2 py-1 rounded">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById('cart-count').innerText = count;
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    
    calcTotal();
}

function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

function calcTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').innerText);
    const deliveryType = document.getElementById('delivery-type').value;
    let taxa = 0;
    
    if (deliveryType === 'entrega') {
        const bairroSelect = document.getElementById('bairro');
        if (bairroSelect.selectedIndex > 0) {
            taxa = parseFloat(bairroSelect.options[bairroSelect.selectedIndex].getAttribute('data-tax'));
        }
    }
    
    document.getElementById('delivery-fee').innerText = taxa.toFixed(2);
    document.getElementById('total').innerText = (subtotal + taxa).toFixed(2);
    
    validateCheckout(subtotal);
}

function validateCheckout(subtotal) {
    const btn = document.getElementById('checkout-btn');
    const deliveryType = document.getElementById('delivery-type').value;
    
    if (subtotal === 0) {
        btn.disabled = true;
        return;
    }
    
    if (deliveryType === 'entrega') {
        const bairro = document.getElementById('bairro').value;
        const rua = document.getElementById('rua').value.trim();
        const num = document.getElementById('numero').value.trim();
        btn.disabled = !(bairro && rua && num);
    } else {
        btn.disabled = false;
    }
}

// Events
document.getElementById('delivery-type').addEventListener('change', (e) => {
    const fields = document.getElementById('delivery-fields');
    fields.classList.toggle('hidden', e.target.value !== 'entrega');
    calcTotal();
});

document.getElementById('bairro').addEventListener('change', calcTotal);
document.getElementById('rua').addEventListener('input', () => calcTotal());
document.getElementById('numero').addEventListener('input', () => calcTotal());

document.getElementById('cart-btn').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.remove('translate-x-full');
});
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.add('translate-x-full');
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    // === ATENÇÃO === Substitua pelo SEU NÚMERO
    const phone = "5581999999999"; 
    let msg = `*NOVO PEDIDO* 🍕\n\n`;
    
    cart.forEach(item => {
        msg += `*${item.quantity}x* ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const deliveryType = document.getElementById('delivery-type').value;
    const subtotal = document.getElementById('subtotal').innerText;
    const taxa = document.getElementById('delivery-fee').innerText;
    const total = document.getElementById('total').innerText;

    msg += `\n*Subtotal:* R$ ${subtotal}`;
    
    if (deliveryType === 'entrega') {
        const bairro = document.getElementById('bairro').options[document.getElementById('bairro').selectedIndex].text;
        const rua = document.getElementById('rua').value;
        const num = document.getElementById('numero').value;
        msg += `\n*Taxa de Entrega:* R$ ${taxa}`;
        msg += `\n*Total:* R$ ${total}\n\n*Endereço de Entrega:*\nBairro: ${bairro}\nRua: ${rua}, Nº ${num}`;
    } else {
        msg += `\n*Total:* R$ ${total}\n\n*Retirada no Local*`;
    }
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
});

// Init
renderMenu();
