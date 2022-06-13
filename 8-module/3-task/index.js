const isEarlyAdded = (items, product) => !items
  .find((item) => item.product.id === product.id);

const getIndex = (items, id) => items.findIndex((item) => item.product.id === id);

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    let newProduct;

    if (isEarlyAdded(this.cartItems, product)) {
      newProduct = { product, count: 1 };
      this.cartItems = [...this.cartItems, newProduct];
    } else {
      const index = getIndex(this.cartItems, product.id);
      newProduct = { ...this.cartItems[index], count: this.cartItems[index].count + 1 };
      this.cartItems = [...this.cartItems.slice(0, index), newProduct, ...this.cartItems.slice(index + 1)];
    }

    this.onProductUpdate(newProduct);
  }

  updateProductCount(productId, amount) {
    const index = getIndex(this.cartItems, productId);
    const newProductCount = this.cartItems[index].count += amount;
    const newProduct = { ...this.cartItems[index], count: newProductCount };

    if (newProductCount === 0) {
      this.cartItems = [...this.cartItems.slice(0, index), ...this.cartItems.slice(index + 1)];
    } else {
      this.cartItems = [...this.cartItems.slice(0, index), newProduct, ...this.cartItems.slice(index + 1)];
    }

    this.onProductUpdate(newProduct);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((totalCount, item) => totalCount += item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((totalPrice, item) => totalPrice += item.count * item.product.price, 0);
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}