import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.getCartTotalPrice = this.getCartTotalPrice.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    this.getCartItems();
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(cart => this.setState({ cart }));
  }

  getCartTotalPrice() {
    return this.state.cart.reduce((total, item) => total + item.price, 0) / 100;
  }

  addToCart(product) {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    };
    fetch('/api/cart', config)
      .then(res => res.json())
      .then(item => {
        this.setState({
          cart: [...this.state.cart, item]
        });
      });
  }

  placeOrder(checkoutInfo) {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutInfo)
    };
    fetch('/api/orders', config)
      .then(res => res.json())
      .then(orderData => {
        this.setState({
          cart: [],
          view: {
            name: 'catalog',
            params: {}
          }
        });
      });
  }

  setView(name, params) {
    const view = { name, params };
    this.setState({ view });
  }

  getView() {
    const { view } = this.state;
    switch (view.name) {
      case 'catalog':
        return <ProductList setView={this.setView} />;
      case 'details':
        return <ProductDetails params={this.state.view.params} setView={this.setView} addToCart={this.addToCart} />;
      case 'cart':
        return <CartSummary setView={this.setView} cart={this.state.cart} getCartTotalPrice={this.getCartTotalPrice} />;
      case 'checkout':
        return <CheckoutForm setView={this.setView} placeOrder={this.placeOrder} getCartTotalPrice={this.getCartTotalPrice} />;
    }
  }

  render() {
    return (
      <>
        <Header cartItemCount={this.state.cart.length} setView={this.setView} />
        <div className="container">
          {this.getView()}
        </div>
      </>
    );
  }
}
