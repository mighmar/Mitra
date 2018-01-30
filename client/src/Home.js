// src/Home.js

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import './App.css';
import ContentRow from './ContentRow';


export default withAuth(class Home extends Component {
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
    if (this.state.authenticated === null) return null;

    const button = this.state.authenticated ?
        "" :
      <button className="welcomeButton" onClick={this.props.auth.login}>I want to start right away!</button>;
    

      if(this.state.authenticated){
        return(
            <div>
                <ContentRow heading="Introduction"
                    contentText="Mitra is a lightweight, opensource, online spreadsheet manipulation application that enables simultaneous work on the same sheet by multiple users. It uses React.js and Node.js as main technologies."/>

                <ContentRow heading="Team log"/>
            </div>);
      }else{
        return (
            <div className="welcomeDiv">
                <div className="welcomeLogo">
                </div>
              {button}
            </div>
          );
      }
   


  }
});