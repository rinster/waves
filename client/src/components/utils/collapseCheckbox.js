import React, { Component } from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';

class CollapseCheckbox extends Component {

    state = {
        open: false,
        checked: []
    }

    //This function will ensure that the checkbox lists
    //are open or unopened depending on the initState
    //value
    componentDidMount() {
        if(this.props.initState) {
            this.setState({
                open: this.props.initState
            })
        }
    }

    handleClick = () => {
        //Toggle the state
        this.setState({open: !this.state.open})
    }

    handleAngle = () => (
        //change the icon if List is open/closed
        this.state.open ? 
            <FontAwesomeIcon
                icon={faAngleUp}
                className="icon"
            />
        :
            <FontAwesomeIcon
                icon={faAngleDown}
                className="icon"
            />
        )

    renderList = () => (
        this.props.list ?
            this.props.list.map((value)=>(
                <ListItem key={value._id} style={{padding: '10px 0'}}> 
                    
                    {/* ------LOOPED LIST NAMES------ */}
                    <ListItemText primary={value.name}/> 
                    
                    {/* ------CHECKBOX------ */}
                    <ListItemSecondaryAction>
                        <Checkbox
                            color="primary"
                            onChange={this.handleToggle(value._id)}
                            checked={this.state.checked.indexOf(value._id) !== -1 }
                        />
                    </ListItemSecondaryAction>

                </ListItem>
            ))
        :null
     )

    
     handleToggle = value => () => {

        //Short hand notation === const checked = this.state.checked;
         const { checked } = this.state;

         //Entering array of checked state and loop search
         //the index with the same value returns either postive (not
         // on the list)
         //or negative number (in the list)
         const currentIndex =  checked.indexOf(value)

         //create a new array to store the checked variables
         const newChecked = [...checked];

         if (currentIndex === -1) {
             //if value is not on the list, push value to the list
            newChecked.push(value)
         } else {
            //Else remove the value from the list
            //with the index position and how many to remove
            newChecked.splice(currentIndex, 1)
         }

         console.log(newChecked)

         this.setState({
             //set the state to reflect changes
             checked: newChecked
         },()=> {
             //PASSING THE LIST TO PARENT COMPONENT
             this.props.handleFilters(newChecked)
         })
         
     }
     

    render() {
        return (
            <div className="collapse_items_wrapper">
                <List style={{borderBottom: '1px solid #dbdbdb'}}>
                    
                    <ListItem onClick={this.handleClick} style={{padding:'10px 23px 10px 0'}}>
                        <ListItemText
                            primary={this.props.title}
                            className="collapse_title"
                        />
                        {this.handleAngle()}
                    </ListItem>

                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            { this.renderList() }
                        </List>
                    </Collapse>

                </List>
            </div>
        );
    }
}

export default CollapseCheckbox;