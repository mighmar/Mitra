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

//ReactDOM.render(<App />, document.getElementById('root'));
addUser();
ReactDOM.render(
<BrowserRouter >
    <div>
        <Route path="/" component={Header}/>
        <Route exact={true} path="/" component={DashboardContent}/>
        <Route path="/grid/" component={GridContent}/>
        <Route path="/existing" component={LoadExistingContent}/>
        <Route path="/configuration" component={ConfigurationContent}/>
    </div>
</BrowserRouter>,document.getElementById('root'));

registerServiceWorker();
