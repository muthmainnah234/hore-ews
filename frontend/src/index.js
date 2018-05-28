import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

import Phone from './components/Phone';
import Dashboard from './components/Dashboard';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path='/' component={App} />
      <Route path='/phone' component={Phone} />
      <Route path='/dashboard' component={Dashboard} />
    </div>
  </Router>, document.getElementById('root'));
registerServiceWorker();
