import React from 'react';
import ReactTooltip from 'react-tooltip'

import logo from './Images/MitraHeader.png';
import './App.css';


class Header extends React.Component {
    render() {
      return         <div className="row header">
      <ReactTooltip />
      <div className="col-lg-2 col-lg-2 col-xl-2" onClick={ ()=>{this.props.changePage("Dashboard")}}>
        <img src={logo} />          
      </div>
      <div className="col-lg-9 col-lg-9 col-xl-9" >
        <div className="row">
          <div className="col-lg-1 col-lg-1 col-xl-1">
            <div className="btnNew" data-tip="New spreadsheet"  
               onClick={ ()=>{this.props.changePage("Grid")}}></div>
          </div>
          <div className="col-lg-1 col-lg-1 col-xl-1" >
            <div className="btnExisting" data-tip="Open existing spreadsheet"
              onClick={ ()=>{this.props.changePage("Existing")}}></div>
          </div>
          <div className="col-lg-1 col-lg-1 col-xl-1">
            <div className="btnGear" data-tip="Configuration" 
              onClick={ ()=>{this.props.changePage("Configuration")}}></div>
          </div>
        </div>
      </div>
         
    </div>;
    }
  }

  export default Header;
  
