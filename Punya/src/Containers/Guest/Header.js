import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {
        return (
            <header className="main_menu home_menu">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <nav className="navbar navbar-expand-lg navbar-light">
                      <a className="navbar-brand" href="index.html"> PUNYA</a>
                      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="ti-menu" />
                      </button>
                      <div className="collapse navbar-collapse main-menu-item justify-content-end" id="navbarSupportedContent">
                        <ul className="navbar-nav align-items-center">
                          <li className="nav-item">
                            <a className="nav-link" href="index.html">Home</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="about.html">about</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="Causes.html">Causes</a>
                          </li>
                          <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Pages
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                              <a className="dropdown-item" href="Event.html">Event</a>
                              <a className="dropdown-item" href="elements.html">Elements</a>
                            </div>
                          </li>
                          <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="blog.html" id="navbarDropdown_1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              blog
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown_1">
                              <a className="dropdown-item" href="blog.html">blog</a>
                              <a className="dropdown-item" href="single-blog.html">Single blog</a>
                            </div>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="contact.html">Contact</a>
                          </li>
                          <li className="d-none d-lg-block">
                            <a className="btn_2" href="#">learn more</a>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </header>

          );
    }
}

export default Header;
