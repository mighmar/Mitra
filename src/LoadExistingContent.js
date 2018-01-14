import React from 'react';
import ContentRow from './ContentRow';
import './App.css';


class LoadExistingContent extends React.Component {
    render() {
            return(
            <div>
                <ContentRow heading="Existing documents"
                    contentText="First, Second.."/>
            </div>);
    }
  }

  export default LoadExistingContent;
  
