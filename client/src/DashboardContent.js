import React from 'react';
import logo from './Images/MitraHeader.png';
import ContentRow from './ContentRow';
import './App.css';
import { withAuth } from '@okta/okta-react';



export default withAuth(class DashBoardContent extends React.Component {
    constructor(props){
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
        //if(this.props.page=="Dashboard"){
            return(
            <div>
                <ContentRow heading="Recent"/>
                <ContentRow heading="Team log"/>
                <ContentRow heading="Introduction"
                    contentText="Mitra is a lightweight, opensource, online spreadsheet manipulation application that enables simultaneous work on the same sheet by multiple users. It uses React.js and Node.js as main technologies."/>
                {button}
            </div>);
        
        //}else{
        //    return ("");
        //}
    }
  });

 // export default DashBoardContent;
  
