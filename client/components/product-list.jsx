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
    const allProducts = this.state.products.map(product => <ProductListItem key={product.productId} product={product} />);
    return (
      <div className="row">
        {allProducts}
      </div>
    );
  }
}

export default ProductList;
