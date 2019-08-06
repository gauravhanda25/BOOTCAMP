import React, { Component } from 'react';
import Header from '../Guest/Header';
import Footer from '../Guest/Footer';
import { getToken, handleInvalidToken } from '../../Utils/services.js';
import config from '../../config.js';
import axios from 'axios';
const url = config.API_URL;

const layoutInstance = axios.create();
layoutInstance.defaults.headers.common['access-token'] = getToken();

class ARLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
            <div className="main protected">
                <Header/>
                {this.props.children}
                <Footer />
            </div>
        );
    }
}
export default ARLayout;
