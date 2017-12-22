import React from 'react';
import logo from './Images/MitraHeader.png';
import './App.css';


class Header extends React.Component {
    render() {
      return         <div className="row header">
      <div className="col-lg-2 col-lg-2 col-xl-2" onClick={ ()=>{this.props.changePage("Dashboard")}}>
        <img src={logo} />          
      </div>
      <div className="col-lg-9 col-lg-9 col-xl-9" >
        <div className="row">
          <div className="col-lg-1 col-lg-1 col-xl-1" 
               onClick={ ()=>{this.props.changePage("Grid")}}>
            <div className="btnNew"></div>
          </div>
          <div className="col-lg-1 col-lg-1 col-xl-1" >
            <div className="btnExisting"
              onClick={ ()=>{this.props.changePage("Existing")}}></div>
          </div>
          <div className="col-lg-1 col-lg-1 col-xl-1" 
              onClick={ ()=>{this.props.changePage("Configuration")}}>
            <div className="btnGear"></div>
          </div>
        </div>
      </div>
         
    </div>;
    }
  }

  export default Header;
  
