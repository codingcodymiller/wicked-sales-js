import React from 'react';

export default function CartSummaryItem({ item }) {
  return (
    <div className="card flex-row p-3 mb-2 align-items-center">
      <img className="card-img-left col-4 product-image" src={item.image} alt={item.name} />
      <div className="card-body col-8">
        <h5>{item.name}</h5>
        <p className="text-secondary">{`$${(Number(item.price) / 100).toFixed(2)}`}</p>
        <p>{item.shortDescription}</p>
      </div>
    </div>
  );
}
