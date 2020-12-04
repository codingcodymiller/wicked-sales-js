import React from 'react';

function Header(props) {
  return (
    <nav className="navbar navbar-dark bg-dark justify-content-between">
      <span className="navbar-brand">
        <i className="fas fa-lg fa-book-dead mx-2"></i>
        Wicked Sales
      </span>
      <ul className="navbar-nav">
        <li className="nav-item">
          <span className="nav-link d-flex align-items-center pointer">
            <i className="fas fa-shopping-cart mx-2"></i>
            <span className="badge badge-light">{props.cartItemCount}</span>
          </span>
        </li>
      </ul>
    </nav>
  );
}
export default Header;
