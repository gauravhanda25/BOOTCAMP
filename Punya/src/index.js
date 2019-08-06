import React from 'react';
import 'bootstrap';
import ReactDOM from 'react-dom';
import "./assets/scss/style.scss";
import thunk from 'redux-thunk';
import reducer from './Reducers/IndexReducer';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {Redirect, BrowserHistory, Switch} from 'react-router';
import { Router, Route, Link, withRouter } from "react-router-dom";
import Home from './Components/Home/Home.js';
import PunyaLayout from './Containers/Layouts/PunyaLayout.js';
import { isLoggedIn, getUser } from './Utils/services';

import { createBrowserHistory } from 'history';

import * as serviceWorker from './serviceWorker';

const store = createStore(
	reducer,
	applyMiddleware(thunk)
);

function auth() {
	let user = JSON.parse(getUser());
	return isLoggedIn();
}
function userRole() {
	let user = JSON.parse(getUser());
	return user.user_role_id
}
const PublicRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		!auth() ? (
			<Component {...props} />
		) :
			<Redirect to={{
				pathname: '/home',
				state: { from: props.location }
			}} />

	)} />
)

const history = createBrowserHistory();
// Get the current location.
const location = history.location;
// create listener
history.listen((location, action) => {
	let interval = (location.pathname == "/appointment/calendar") ? 500 : 100
	// let footer = document.getElementById('protected-footer-fixed');
	// if(footer != null && footer != undefined){
	// 	setTimeout(function(){
	// 		let rootHeight = document.getElementById('root').clientHeight;
	// 		let footerHeight = document.getElementById('protected-footer-fixed').clientHeight;
	//
	// 		if((rootHeight + footerHeight) > window.innerHeight){
	// 			footer.classList.remove('footer-fixed')
	// 		} else {
	// 			footer.classList.add('footer-fixed')
	// 		}
	// 	}, interval)
	// }

})

ReactDOM.render((
  <Provider store={store}>
    <Router history={history} >
	    <PunyaLayout>
	        <Switch>
		        <Route path="/home" component={Home} />
				
				<Redirect from="/*" to="/home" />
	        </Switch>
	  	</PunyaLayout>
  	</Router>
  </Provider>),
     document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
