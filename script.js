// Alternar tema claro/escuro
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

function toggleTheme() {
    const isDark = body.hasAttribute('data-theme');
    if (isDark) {
        body.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀';
        localStorage.setItem('theme', 'dark');
    }
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀';
}

themeToggle.addEventListener('click', toggleTheme);

// Validação do formulário
const form = document.getElementById('contact-form');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    const nome = document.getElementById('nome');
    const nomeError = document.getElementById('nome-error');
    if (nome.value.trim() === '') {
        nomeError.style.display = 'block';
        nome.classList.add('error');
        isValid = false;
    } else {
        nomeError.style.display = 'none';
        nome.classList.remove('error');
    }

    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        emailError.style.display = 'block';
        email.classList.add('error');
        isValid = false;
    } else {
        emailError.style.display = 'none';
        email.classList.remove('error');
    }

    const telefone = document.getElementById('telefone');
    const telefoneError = document.getElementById('telefone-error');
    const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    if (!telefoneRegex.test(telefone.value)) {
        telefoneError.style.display = 'block';
        telefone.classList.add('error');
        isValid = false;
    } else {
        telefoneError.style.display = 'none';
        telefone.classList.remove('error');
    }

    const assunto = document.getElementById('assunto');
    const assuntoError = document.getElementById('assunto-error');
    if (assunto.value === '') {
        assuntoError.style.display = 'block';
        assunto.classList.add('error');
        isValid = false;
    } else {
        assuntoError.style.display = 'none';
        assunto.classList.remove('error');
    }

    const mensagem = document.getElementById('mensagem');
    const mensagemError = document.getElementById('mensagem-error');
    if (mensagem.value.trim() === '') {
        mensagemError.style.display = 'block';
        mensagem.classList.add('error');
        isValid = false;
    } else {
        mensagemError.style.display = 'none';
        mensagem.classList.remove('error');
    }

    if (isValid) {
        alert('Formulário enviado com sucesso!');
        form.reset();
    }
});

// Máscara de telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 0) value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    if (value.length > 10) value = value.replace(/(\d{5})(\d)/, '$1-$2');
    else if (value.length > 5) value = value.replace(/(\d{4})(\d)/, '$1-$2');
    e.target.value = value;
});

// Carrinho
let cart = [];
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const totalAmount = document.querySelectorAll('.total-amount');

function updateCartCount() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="50">
            <div>
                <h4>${item.title}</h4>
                <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        cartItems.appendChild(cartItem);
    });

    totalAmount.forEach(el => el.textContent = total.toFixed(2));

    // Eventos de remover
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            updateCartCount();
            renderCart();
        });
    });
}

function updateCart() {
    updateCartCount();
    renderCart();
}

// Adicionar ao carrinho
const addToCartButtons = document.querySelectorAll('.btn-primary:not(.btn-submit)');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productCard = this.closest('.product-card');
        const productId = productCard.dataset.id || Math.random().toString(36).substr(2, 9);
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productImg = productCard.querySelector('.product-image').src;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                title: productTitle,
                price: parseFloat(productPrice.replace(/[^\d,]/g, '').replace(',', '.')),
                image: productImg,
                quantity: 1
            });
        }

        updateCart();
        cartModal.style.display = 'block';
    });
});

// Abrir e fechar carrinho
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
});
closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// Tabs do carrinho
const tabs = document.querySelectorAll('.cart-tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const tabId = tab.dataset.tab + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Ir para checkout
document.querySelector('.go-to-checkout').addEventListener('click', () => {
    document.querySelector('.cart-tab[data-tab="checkout"]').click();
});

// Finalizar compra
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Compra finalizada com sucesso!');
    cart = [];
    updateCart();
    document.querySelector('.cart-tab[data-tab="cart"]').click();
    cartModal.style.display = 'none';
});