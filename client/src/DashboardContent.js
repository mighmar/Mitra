import React from 'react';
import logo from './Images/MitraHeader.png';
import ContentRow from './ContentRow';
import './App.css';


class DashBoardContent extends React.Component {
    render() {
        //if(this.props.page=="Dashboard"){
            return(
            <div>
                <ContentRow heading="Recent"/>
                <ContentRow heading="Team log"/>
                <ContentRow heading="Introduction"
                    contentText="Mitra is a lightweight, opensource, online spreadsheet manipulation application that enables simultaneous work on the same sheet by multiple users. It uses React.js and Node.js as main technologies."/>
            </div>);
        
        //}else{
        //    return ("");
        //}
    }
  }

  export default DashBoardContent;
  
