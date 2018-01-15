import React from 'react';
import './App.css';

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
    render() {
        let cellClass = "defaultCell";
        let cellValue = "";
        let cellUserStyle = {};
        let renderUserStyle = this.props.rowUserStyles==undefined?{}:this.props.rowUserStyles; //{ 'border-style':'solid', 'border-color':'lightBlue'};
        let renderValue=this.props.rowValues==undefined?{}:this.props.rowValues;
        
        return(<tr>
            {this.arrayIndex.map(el=>{
                cellClass = "defaultCell"
                if(this.props.rowid==0 && el>0)
                    cellClass = "firstColumnCell";
                else if(this.props.rowid>0 && el<1){
                    cellClass = "firstRowCell";
                }
                cellValue = renderValue[el]==undefined?"":renderValue[el];
                cellUserStyle = renderUserStyle[el]==undefined?{}:renderUserStyle[el];

                if(this.props.rowid==0 || el==0 || Object.keys(cellUserStyle).length!=0){
                    return <td style={cellUserStyle} className={cellClass}>
                        <div id={this.props.rowid+"-"+el} suppressContentEditableWarning={true}  
                        onInput={(e)=>{this.props.cellChangeHandler(this.props.rowid,el,e)}}>
                        {cellValue}
                    </div> </td>
                }else{
                    return <td className={cellClass}>
                        <div  id={this.props.rowid+"-"+el} suppressContentEditableWarning={true} contentEditable 
                        onInput={(e)=>{this.props.cellChangeHandler(this.props.rowid,el,e)}}>
                        {cellValue}
                    </div> </td>
                }
            })}
        </tr>);
    }
  }

  export default GridRow;
  
