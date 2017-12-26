import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RegisterLogin from './RegisterLogin';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<RegisterLogin />, document.getElementById('root'));
registerServiceWorker();
