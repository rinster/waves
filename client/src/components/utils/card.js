import React, { Component } from 'react';
import MyButton from './button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';

class Card extends Component {

    //Manage Dialog state
    state = {
        userNotAuth: false,
    }

    //Close material UI dialog
    handleClose = () => {
        this.setState({ userNotAuth: false });
      };

    renderCardImage(images) {
        if(images.length > 0) {
            return images[0].url
        } else {
            return '/images/image_not_availble.png'
        }
    }


    render() {

        const props = this.props;

        return (
            <div className={`card_item_wrapper ${props.grid}`}>
                
                <div 
                    className="image"
                    style={{
                        background:`url(${this.renderCardImage(props.images)}) no-repeat`
                    }}
                > </div>

                    <div className="action_container">
                        <div className="tags">
                            <div className="brand">{props.brand.name}</div>
                            <div className="name">{props.name} </div>
                            <div className="name">${props.price}</div>
                        </div>
                    

                    { props.grid ?
                        <div className="description">
                            <p>
                                {props.description}
                            </p>
                        </div>
                        :null
                    }

                    <div className="actions">
                        <div className="button_wrapp">
                            <MyButton
                                type="default"
                                altClass="card_link"
                                title="View Product"
                                linkTo={`/product_detail/${props._id}`}
                                addStyles={{
                                    margin: '10px 0 0 0'
                                }}
                            />
                        </div>
                        <div className="button_wrapp">
                            <MyButton
                                type="bag_link"
                                runAction={()=>{
                                    if(props.user.userData.isAuth) {
                                        this.props.dispatch(addToCart(props._id))
                                    } else {
                                        this.setState({
                                            userNotAuth: true
                                        })
                                    }
                                }}
                            />
                        </div>

                    </div>
                </div>
                {/* ------MaterialUI Dialog------ */}
                {/* Only show if user is not authenticated */}
                <Dialog 
                    open={this.state.userNotAuth}
                    onClose={this.handleClose}
                > 
                    <div className="dialog_alert">
                        <div>Please login or register to shop.</div>
                        <div>Join the Waves family!</div>
                    </div>
                    <DialogActions>
                        <button onClick={this.handleClose} color="primary">
                            Alrighty, will do!
                        </button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

//MapStateToProps is needed here to check 
//if the user is authenticated
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Card);