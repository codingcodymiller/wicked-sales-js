import React from 'react';
import CartSummaryItem from './cart-summary-item';

export default function CartSummary(props) {
  const cartItems = props.cart.map(item => <CartSummaryItem key={item.cartItemId} item={item} />);
  return (
    <div className="row">
      <div className="col-12 p-3">
        <button className="btn btn-secondary mb-2" onClick={() => props.setView('catalog', {})}>
          <i className="fas fa-arrow-left mr-2"></i>
          Back To Catalog
        </button>
        <h1>My Cart</h1>
      </div>
      <div className="col-12 p-3">
        {cartItems}
      </div>
    </div>
  );
}
