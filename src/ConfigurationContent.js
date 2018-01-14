import React from 'react';
import logo from './Images/MitraHeader.png';
import ContentRow from './ContentRow';
import './App.css';


class ConfigurationContent extends React.Component {
    render() {
            return(
            <div>
                <ContentRow heading="Personal"/>
                <ContentRow heading="Team"/>
            </div>);
    }
  }

  export default ConfigurationContent;
  
