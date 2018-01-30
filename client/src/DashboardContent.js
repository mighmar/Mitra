import React from 'react';
import logo from './Images/MitraHeader.png';
import ContentRow from './ContentRow';
import './App.css';


class DashBoardContent extends React.Component {
    render() {
        //if(this.props.page=="Dashboard"){
            let IntroductionText = "Mitra is a lightweight, opensource, online spreadsheet manipulation application that enables simultaneous work on the same sheet by multiple users."+
            " It uses React.js and Node.js as main technologies. Users can change style of cells (font and back color)."
            return(
            <div>
                <ContentRow heading="Team log"/>
                <ContentRow heading="Introduction"
                    contentText=""/>
            </div>);
        
        //}else{
        //    return ("");
        //}
    }
  }

  export default DashBoardContent;
  
