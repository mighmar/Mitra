import React from 'react';
import ContentRow from './ContentRow';
import './App.css';


class LoadExistingContent extends React.Component {
    render() {
        if(this.props.page=="Existing"){
            return(
            <div>
                <ContentRow heading="Existing documents"
                    contentText="First, Second.."/>
            </div>);
        
        }else{
            return ("");
        }
    }
  }

  export default LoadExistingContent;
  
