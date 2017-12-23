import React from 'react';
import './App.css';


class ContentRow extends React.Component {
    render() {
        let content = null;
        if(this.props.contentText!=undefined){
            content=<div className="textRowContent">{this.props.contentText}</div>
        }else{
            content="";
        }
      return (<div className="row headerComponent">
                <div className="col-lg-2 col-lg-2 col-xl-2 recentDiv">
                {this.props.heading}
                </div>
                <div className="col-lg-9 col-lg-9 col-xl-9 contentClass">
                    {content}
                </div>
              </div>
              )
    }
  }

  export default ContentRow;
  
