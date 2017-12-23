import React from 'react';
import logo from './Images/MitraHeader.png';
import ContentRow from './ContentRow';
import './App.css';


class ConfigurationContent extends React.Component {
    render() {
        if(this.props.page=="Configuration"){
            return(
            <div>
                <ContentRow heading="Personal"/>
                <ContentRow heading="Team"/>
            </div>);
        
        }else{
            return ("");
        }
    }
  }

  export default ConfigurationContent;
  
