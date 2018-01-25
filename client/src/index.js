import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RegisterLogin from './RegisterLogin';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route} from 'react-router-dom'
import DashboardContent from './DashboardContent';
import Header from './Header';
import GridContent from './GridContent';
import LoadExistingContent from './LoadExistingContent';
import ConfigurationContent from './ConfigurationContent';
import {addUser} from './api';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Login from './Login';
import Home from './Home';


function onAuthRequired({history}) {
    history.push('/login');
  }

//ReactDOM.render(<App />, document.getElementById('root'));
addUser();
alert(window.location.origin + '/implicit/callback');
ReactDOM.render(
<BrowserRouter >
    <div>
    <Security issuer='https://dev-868306.oktapreview.com/oauth2/default'
                  client_id='0oadrm1qnzouySu6O0h7'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired} >
        <Route path="/" component={Header}/>
        <Route path="/" exact={true} component={Home}/>
        <SecureRoute exact={true} path="/dashboard" component={DashboardContent}/>
        <SecureRoute  path="/grid/" component={GridContent}/>
        <SecureRoute  path="/grid/:sheetId" component={GridContent}/>
        <SecureRoute  path="/existing" component={LoadExistingContent}/>
        <SecureRoute  path="/configuration" component={ConfigurationContent}/>
        <Route path='/login' render={() => <Login baseUrl='https://dev-868306.oktapreview.com' />} />
        <Route path='/implicit/callback' component={ImplicitCallback} />
    </Security>
    </div>
</BrowserRouter>,document.getElementById('root'));

registerServiceWorker();
