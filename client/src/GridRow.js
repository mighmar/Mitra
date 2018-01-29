import React from 'react';
import './App.css';
import { cellStyleChange } from './api';

const indexArray = function indexArray(len){
    let array = new Array(len);
    for (let i = 0; i < len; i++) {
            array[i]=i;
    }
    return array;
}

class GridRow extends React.Component {
    constructor(props){
        super(props);
        this.state={};


    }
    handleCellValueChange= (event)=>{
        let key = event.target.id;
        //provera da li je dozvoljena promena (poziv servera)        
        this.setState({key:event.target.innerHTML});
    }
    arrayIndex = indexArray(27);
    extend=function(extended, obj){
        for (const key in obj) {
             var element = obj[key];
             extended[key]=element;   
        }
        return extended;
    }
    render() {
        let cellClass = "defaultCell";
        let cellValue = "";
        let cellUserStyle = {};
        let cellStyle ={};
        let cellStyleRow={};
        let cellStyleFinal={};
        let renderUserStyle = this.props.rowUserStyles==undefined?{}:this.props.rowUserStyles; //{ 'border-style':'solid', 'border-color':'lightBlue'};
        let renderValue=this.props.rowValues==undefined?{}:this.props.rowValues;
        //console.log(JSON.stringify(this.props.rowUserStyles));
        return(<tr>
            {this.arrayIndex.map(el=>{
                cellClass = "defaultCell"
                if(this.props.rowid==0 && el>0)
                    cellClass = "firstColumnCell";
                else if(this.props.rowid>0 && el<1){
                    cellClass = "firstRowCell";
                } 
                cellValue = renderValue[el]==undefined?"":renderValue[el];
                //stil korisnika
                cellUserStyle = renderUserStyle[el]==undefined?{}:renderUserStyle[el];
                
                cellStyleRow = this.props.gridStyles[this.props.rowid];
                cellStyle = cellStyleRow===undefined? {}: cellStyleRow[el];
                //console.log(JSON.stringify(cellUserStyle));

                cellStyle = cellStyle===undefined?{}: cellStyle;  
                cellStyleFinal= {};
                cellStyleFinal = this.extend(cellStyleFinal, cellUserStyle);
                cellStyleFinal= this.extend(cellStyleFinal,cellStyle);
                //console.log(JSON.stringify(cellStyleFinal));


                if(this.props.rowid==0 || el==0 || Object.keys(cellUserStyle).length!=0 && !(this.props.userRowCol.row===this.props.rowid && el===this.props.userRowCol.col)){
                    
                    
                    return <td style={cellStyleFinal} className={cellClass}>
                        <div id={this.props.rowid+"-"+el} suppressContentEditableWarning={true}  
                        onInput={(e)=>{this.props.cellChangeHandler(this.props.rowid,el,e)}}>
                        {cellValue}
                    </div> </td>
                }else if(this.props.userRowCol.row===this.props.rowid && el===this.props.userRowCol.col){
                    let tdClass = "";
                    if(Object.keys(cellUserStyle)!=0){
                        //cellStyleFinal={};
                        tdClass="cellClass";

                    }

                    return <td className={tdClass} >
                    <input className="userCellText" style={cellStyleFinal}  id={this.props.rowid+"-"+el} type="text" value={cellValue} onChange={this.handleChange} onInput={(e)=>{this.props.cellChangeHandler(this.props.rowid,el,e)}}
                        onFocus={(e)=>{this.props.focusChangeHandler(this.props.rowid,el,e)}} />
                         </td>
                }else{
                    return <td className={cellClass}>
                    <input className="userCellText" style={cellStyleFinal} id={this.props.rowid+"-"+el} type="text" value={cellValue} onChange={this.handleChange} onInput={(e)=>{this.props.cellChangeHandler(this.props.rowid,el,e)}}
                        onFocus={(e)=>{this.props.focusChangeHandler(this.props.rowid,el,e)}} />
                         </td>
                }
            })}
        </tr>);
    }
  }

  export default GridRow;
  
