import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};

    this.elem = createElement(`<div class="products-grid">
      <div class="products-grid__inner">
      </div>
      </div>`)

    let basket = this.elem.querySelector('.products-grid__inner');

    this.products.forEach(product => {
      let position = new ProductCard(product)
      basket.append(position.elem)
    });
  }

  updateFilter(filters) {
    this.filters = Object.assign(this.filters, filters);
    let basket = this.elem.querySelector('.products-grid__inner');
    basket.innerHTML = '';
    this.products.forEach((product) => {
      let add = true;

      if (product.nuts && this.filters.noNuts) add = false;
      if (!product.vegeterian && this.filters.vegeterianOnly) add = false;
      if (product.spiciness > this.filters.maxSpiciness) add = false;
      if (this.filters.category && this.filters.category !== product.category) add = false

      if (add) {
        let position = new ProductCard(product);
        basket.append(position.elem);
      }
    })
  }
}