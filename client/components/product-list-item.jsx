import React from 'react';

function ProductListItem({ product }) {
  return (
    <div className="card">
      <img className="card-img-top product-image" src={product.image} alt={product.name} />
      <div className="card-body">
        <h4>{product.name}</h4>
        <p className="text-secondary">{`$${(Number(product.price) / 100).toFixed(2)}`}</p>
        <p>{product.shortDescription}</p>
      </div>
    </div>
  );
}

export default ProductListItem;
