import React from 'react';
import ContentRow from './ContentRow';
import './App.css';
import {globalSheetsVisitedUnmount,visitedSheets, globalSheetsVisited} from './api';
import { withAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom'


export default withAuth (class LoadExistingContent extends React.Component {
    constructor(props){
        super(props);
        this.state={
            "sheetLinks":[]
        }
        globalSheetsVisited(this.globalHandleSheetsVisited.bind(this));

    }
    globalHandleSheetsVisited=(data)=>{
        this.setState({"sheetLinks":data});
        
    }
    async componentDidMount(){

        let username="";
        try{
            username= (await this.props.auth.getUser())["email"];

            visitedSheets(username);
        }catch(err){
            
        }
        
    }

    async componentWillUnmount(){
        globalSheetsVisitedUnmount();
    }
    render() {
        //alert(JSON.stringify(this.state.sheetLinks));

        return (<div className="row headerComponent">
        <div className="col-lg-2 col-lg-2 col-xl-2 recentDiv">
        Existing documents
        </div>
        <div className="col-lg-9 col-lg-9 col-xl-9 contentClass">
            {
                this.state.sheetLinks.map(it=>
                {
                    return (
                        <div>
                        <Link to={"grid/"+it["_id"]}> {it["name"]["name"]} </Link> <br/>
                        </div>)
                })
            }
        </div>
      </div>
      );
    }
  });

  
