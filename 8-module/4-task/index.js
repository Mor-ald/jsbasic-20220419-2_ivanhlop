import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) return;

    let findedCartItem = this.cartItems.find(cart => cart.product.id === product.id);
    if (findedCartItem) {
      findedCartItem.count++;
      this.onProductUpdate(findedCartItem);
    }
    else {
      let newCartItem = {
        product: product,
        count: 1,
      };
      this.cartItems.push(newCartItem);
      this.onProductUpdate(newCartItem);
    }
  }

  updateProductCount(productId, amount) {
    let findedCartItem = this.cartItems.find(cart => cart.product.id === productId);
    findedCartItem.count += amount;
    this.cartItems = this.cartItems.filter(cart => cart.count !== 0);

    this.onProductUpdate(findedCartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;

    for (let currentCart of this.cartItems) {
      totalCount += currentCart.count;
    }

    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;

    for (let currentCart of this.cartItems) {
      totalPrice += currentCart.product.price * currentCart.count;
    }

    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
      2
    )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.open();
    this.modal.setTitle("Your order");

    for (let currentCart of this.cartItems) {
      let renderedCartHTML = this.renderProduct(currentCart.product, currentCart.count);
      this.modal.setBody(renderedCartHTML);

      let btnPlus = renderedCartHTML.querySelector('.cart-counter__button_plus');
      btnPlus.addEventListener('click', () => {
        this.updateProductCount(renderedCartHTML.dataset.productId, 1);
      });

      let btnMinus = renderedCartHTML.querySelector('.cart-counter__button_minus');
      btnMinus.addEventListener('click', () => {
        this.updateProductCount(renderedCartHTML.dataset.productId, -1);
      });
    }

    let form = this.renderOrderForm();
    this.modal.setBody(form);

    form.addEventListener('submit', (event) => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (!document.body.classList.contains('is-modal-open'))
      return;

    let modal = document.querySelector('.modal');
    if (this.cartItems.length === 0) {
      modal.parentElement.removeChild(modal);
      return;
    }

    let productCount = modal.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-counter__count`);
    let productPrice = modal.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-product__price`);
    let infoPrice = modal.querySelector(`.cart-buttons__info-price`);

    productCount.innerHTML = cartItem.count;
    productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
  }

  onSubmit(event) {
    event.preventDefault();
    let cartForm = document.querySelector('.cart-form');
    let cartFormData = new FormData(cartForm);
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: cartFormData
    }).then(() => {
      this.modal.setTitle('Success!');
      this.cartItems = [];
      this.modal.setBody(this.renderSuccess());
    });
  };

  renderSuccess() {
    return createElement(`
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>
    `);
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}