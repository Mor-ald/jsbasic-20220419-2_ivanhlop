import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

 
  constructor() {
  }

  async render() {
    let response = await fetch('products.json');
    this.products = await response.json();

    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3
    });
    this.productsGrid = new ProductsGrid(this.products);
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);


    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });

    document.body.addEventListener('product-add', ({ detail: productId }) => {
      let product = this.products.find(product => product.id == productId);
      this.cart.addProduct(product);
    });

    document.body.addEventListener('slider-change', ({ detail: value }) => {
      this.productsGrid.updateFilter({
        maxSpiciness: value
      });
    });

    document.body.addEventListener('ribbon-select', ({ detail: categoryId }) => {
      this.productsGrid.updateFilter({
        category: categoryId
      });
    });

    document.getElementById('nuts-checkbox').onchange = event => {
      this.productsGrid.updateFilter({
        noNuts: event.target.checked
      });
    };

    document.getElementById('vegeterian-checkbox').onchange = event => {
      this.productsGrid.updateFilter({
        vegeterianOnly: event.target.checked
      });
    };

    document.querySelector('[data-carousel-holder]').append(this.carousel.elem);
    document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem);
    document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);
    document.querySelector('[data-cart-icon-holder]').append(this.cartIcon.elem);
    document.querySelector('[data-products-grid-holder]').innerHTML = '';
    document.querySelector('[data-products-grid-holder]').append(this.productsGrid.elem);
  }

}