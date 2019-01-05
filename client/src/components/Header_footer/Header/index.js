import React, { Component } from 'react';
import { Link, withRouter }  from 'react-router-dom';

import { connect } from 'react-redux';
import { logoutUser } from '../../../actions/user_actions';

class Header extends Component {

    //State to host the links
    state = {
        page: [
            {
                name: 'Home',
                linkTo: '/',
                public: true
            },
            {
                name: 'Guitars',
                linkTo: '/shop',
                public: true
            }
        ],
        user: [
            {
                name: 'My Cart',
                linkTo: '/user/cart',
                public: false
            },
            {
                name: 'My Account',
                linkTo: '/user/dashboard',
                public: false
            },
            {
                name: 'Log in',
                linkTo: '/register_login',
                public: true
            },
            {
                name: 'Log out',
                linkTo: '/user/logout',
                public: false
            }

        ]
    }

    logoutHandler = () => {
        this.props.dispatch(logoutUser()).then(response => {
            if(response.payload.success) {
                this.props.history.push('/')
            }
        })
    }

    cartLink = (item, i) => {
        const user = this.props.user.userData;
        return (
            //Display cart link with the red bubble indicating # of items
            <div className="cart_link" key={i}>
                <span>{user.cart ? user.cart.length:0}</span>
                <Link to={item.linkTo}>
                    {item.name}
                </Link>
            </div>
        )
    }

    defaultLink = (item, i) => (
        //Ternary function render logout or other link
        item.name === 'Log out' ?
            <div className="log_out_link"
                key={i}
                onClick={()=> this.logoutHandler()} //Logout Function
            >
                {item.name}
            </div>
        :
        <Link to={item.linkTo} key={i}>
            {item.name}
        </Link>
    )

    showLinks = (type) => {
        let list = [];
        
        //check if user is logged in
        if(this.props.user.userData){
            type.forEach((item)=> {
                //Checkpoint for which links should be displayed
                if(!this.props.user.userData.isAuth){
                    //if user is not authenticated, push links that are only public
                    if(item.public === true) {
                        list.push(item)
                    }
                } else {
                    //if user is logged in, list all except log in
                    if(item.name !== 'Log in') {
                        list.push(item)
                    }
                }
            })
        }

        //Return the array of the pushed links
        return list.map((item, i)=> {
            if(item.name !== 'My Cart') {
                //If link name is different from 'My Cart'
                return this.defaultLink(item, i)
            } else {
                //return the cart link structure 
                //which will render a red bubble for the 
                //cart show # of items
                return this.cartLink(item, i)
            }
        })
    }


    render() {
        return (
            <header className="bck_b_light"> 
                <div className="container">
                    <div className="left">
                        <div className="logo">
                            WAVES
                        </div>
                    </div>
                    <div className="right"> 
                        <div className="top">
                            {this.showLinks(this.state.user)}
                        </div>
                        <div className="bottom">
                            {this.showLinks(this.state.page)}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
} 

//Inject props into Header
function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(withRouter(Header));