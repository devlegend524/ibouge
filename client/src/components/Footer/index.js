import React from 'react';

import './styles.scss';

const Footer = () => {
  return (
    <footer className="footer" ng-show="showFooter">
      <div className="container containerWidth">
        <div className="row">
          <div className="col-md-2 col-sm-2 col-xs-12 text-center hidden-xs"></div>
          <div className="col-md-8 col-sm-8 col-xs-12 text-center">
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
            <a href="/mission.html">Mission</a>
            <a href="/pressrelease.html">Press</a>
            <a href="/blog.html">Blog</a>
            <a href="/privacy.html">Privacy</a>
          </div>
          <div className="col-md-2 col-sm-2 col-xs-12 text-center hidden-xs"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
