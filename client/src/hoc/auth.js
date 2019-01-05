// This component will check if user is authenticated in the Routes.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '../actions/user_actions';
import CircularProgress from '@material-ui/core/CircularProgress'; //This is a loader to show if user if authenticated


export default function(ComposedClass, reload, adminRoute = null) { //Returning a class from a function
    class AuthenticationCheck extends Component {
        
        state = {
            loading: true
        }

        componentDidMount() {
            this.props.dispatch(auth()).then(response => {
                let user = this.props.user.userData
                //console.log(user);
                if(!user.isAuth) {
                    if(reload) {
                        this.props.history.push('/register_login')
                    }
                } else {
                    if(adminRoute && !user.isAdmin) {
                        //If user is authenticated && an ADMIN and route is not 
                        //private 'false' in routes.js, send ADMIN to dashboard
                        this.props.history.push('/user/userdashboard')
                    } else {
                        //If user is authenticated and route is not private
                        //'false' in routes.js, send user to dashboard
                        if(reload ===  false) {
                            this.props.history.push('/user/userdashboard')
                        }
                    }
                }
                this.setState({loading:false})
            })
        }

        render() {
            //Before rendering component, check if state is loading and show progress bar
            if(this.state.loading) {
                return (
                    <div className="main_loader">
                        <CircularProgress style={{color:'#2196F3'}} thickness={7}/>
                    </div>
                )
            }
            return (
                <ComposedClass {...this.props} user={this.props.user}/>   
            );
        }
    }

    //Redux function to access the user props
    function mapStateToProps(state) {
        return {
            user: state.user
        }
    }
    
    return connect(mapStateToProps)(AuthenticationCheck) 
    //Notice how we're returning rather than exporting. Files can only have 
    //one export function so you need to do a return on this class
}


