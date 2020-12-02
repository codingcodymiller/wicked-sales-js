import React from 'react';
import ProductListItem from './product-list-item';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    fetch('/api/products')
      .then(res => res.json())
      .then(products => this.setState({ products }));
  }

  render() {
    const allProducts = this.state.products.map(product => {
      return (
        <div key={product.productId} className="col-4 p-3">
          <ProductListItem product={product} />
        </div>
      );
    });
    return (
      <div className="row">
        {allProducts}
      </div>
    );
  }
}

export default ProductList;
