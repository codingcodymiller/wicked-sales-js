import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'catalog',
        params: {}
      },
      message: null,
      isLoading: true
    };
    this.setView = this.setView.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
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
        return <ProductDetails params={this.state.view.params} />;
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="container">
          {this.getView()}
        </div>
      </>
    );
  }
}
