import React from 'react';

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
  }

  componentDidMount() {
    fetch(`/api/products/${this.props.productId}`)
      .then(res => res.json())
      .then(product => this.setState({ product }));
  }

  render() {
    const { product } = this.state;
    if (!product) return <h1>Loading...</h1>;
    return (
      <div className="row">
        <div className="card col-12 mt-3">
          <div className="card-body d-flex flex-wrap">
            <div className="col-12 p-3">
              <button className="btn btn-secondary">
                <i className="fas fa-arrow-left mr-2"></i>
                Back To List
              </button>
            </div>
            <img className="product-image col-5" src={product.image} alt={product.name} />
            <div className="col-7 mt-3">
              <h4>{product.name}</h4>
              <p className="text-secondary">{`$${(Number(product.price) / 100).toFixed(2)}`}</p>
              <p>{product.shortDescription}</p>
            </div>
            <div className="col-12 mt-4">{product.longDescription}</div>
          </div>
        </div>
      </div>
    );
  }
}
