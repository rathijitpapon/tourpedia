import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/styles/rsuite-default.css';
import "react-datepicker/dist/react-datepicker.css";
import logService from './services/logService';
import App from './App';

toast.configure();
logService.init();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
