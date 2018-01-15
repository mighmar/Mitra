import React from 'react';
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import logo from './Images/MitraHeader.png';
import './App.css';


class Header extends React.Component {
    render() {
      return         <div className="row header">
      <ReactTooltip />
      <div className="col-lg-2 col-lg-2 col-xl-2" /*onClick={ ()=>{this.props.changePage("Dashboard")}}*/>
        <Link to="/">
        <img src={logo} />   
        </Link>       
      </div>
      <div className="col-lg-9 col-lg-9 col-xl-9" >
        <div className="row">
          <div className="col-lg-1 col-lg-1 col-xl-1">
          <Link to="grid">
            <div className="btnNew" data-tip="New spreadsheet"  
               /*onClick={ ()=>{this.props.changePage("Grid")}}*/> </div></Link>
          </div>
          <div className="col-lg-1 col-lg-1 col-xl-1" >
            <Link to="/existing">
            <div className="btnExisting" data-tip="Open existing spreadsheet"
              /*onClick={ ()=>{this.props.changePage("Existing")}}*/><Link to="existing"/></div> </Link>
          </div>
          <div className="col-lg-1 col-lg-1 col-xl-1">
            <Link to="/configuration">
            <div className="btnGear" data-tip="Configuration" 
              /*onClick={ ()=>{this.props.changePage("Configuration")}}*/><Link to="configuration"/></div> </Link>
          </div>
        </div>
      </div>
         
    </div>;
    }
  }

  export default Header;
  
