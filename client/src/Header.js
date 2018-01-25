import React from 'react';
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import logo from './Images/MitraHeader.png';
import './App.css';
import { withAuth } from '@okta/okta-react';



export default withAuth(class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }
  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }
    render() {
      const button = this.state.authenticated ?
      <button onClick={this.props.auth.logout}>Logout</button> :
      <button onClick={this.props.auth.login}>Login</button>;

      

      if(this.state.authenticated){
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
                <div className="col-lg-8 col-lg-8 col-xl-8">
                </div>
                <div className="col-lg-1 col-lg-1 col-xl-1">
                  <div className="btnExit" onClick={this.props.auth.logout}> </div>
                </div>
              </div>
            </div>
              
          </div>;
      }else{
        return <div>
            </div>;
      }
    }
  });

  
