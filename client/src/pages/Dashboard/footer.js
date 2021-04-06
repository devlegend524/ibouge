import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container containerWidth">
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12 text-center hidden-xs"></div>
          <div className="col-md-4 col-sm-4 col-xs-12 text-center">
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/mission">Mission</Link>
            <Link to="/technology">Technology</Link>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12 text-center hidden-xs"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
