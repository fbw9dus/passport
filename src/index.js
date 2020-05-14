import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Axios from 'axios';

import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom';

const AuthSuccess = ({match})=> {
  const { token } = match.params;
  Axios.defaults.headers.common['x-auth'] = token;
  localStorage.setItem('myauth',token);
  return <Redirect to="/"/>;
}

const CheckAuth = ({match})=> {
  const token = localStorage.getItem('myauth');
  if ( token ) {
    Axios.get('/auth/check')
    .then( result =>{

    })
  }
  return null;
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CheckAuth/>
      <Switch>
        <Route path="/token/:token" component={AuthSuccess} />
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
