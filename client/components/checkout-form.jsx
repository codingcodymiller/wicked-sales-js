import React from 'react';

export default class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCard: '',
      shippingAddress: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.placeOrder(this.state);
    this.reset();
  }

  reset() {
    this.setState({
      name: '',
      creditCard: '',
      shippingAddress: ''
    });
  }

  render() {
    const totalPrice = this.props.getCartTotalPrice();
    return (
      <div className="row">
        <div className="col-12 p-3">
          <form onSubmit={this.handleSubmit} onReset={this.reset}>
            <div className="form-text">
              <h1>Checkout</h1>
              <h4 className="text-secondary">{`Order Total: $${totalPrice}`}</h4>
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="creditCard">Credit Card</label>
              <input type="text" className="form-control" id="creditCard" name="creditCard" value={this.state.creditCard} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="shippingAddress">Shipping Address</label>
              <textarea className="form-control" id="shippingAddress" name="shippingAddress" rows="3" value={this.state.shippingAddress} onChange={this.handleChange}></textarea>
            </div>
            <div className="form-group d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={() => this.props.setView('catalog', {})}>
                <i className="fas fa-arrow-left mr-2"></i>
                Back To Catalog
              </button>
              <div>
                <button type="reset" className="btn btn-danger mx-1">Cancel</button>
                <button type="submit" className="btn btn-primary mx-1">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
