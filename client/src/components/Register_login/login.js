import React, { Component } from 'react';
import FormField from '../utils/Form/formfield';
import { update, generateData, isFormValid } from '../utils/Form/formActions';
//** withRouter allows this child component 'login.js' to receive the ability to route
import { withRouter } from 'react-router-dom';

// **'connect' allows us to reach the server to authenticate user**
import { connect } from 'react-redux';
import { loginUser } from '../../actions/user_actions';

class Login extends Component {

    state = {
        formError: false,
        formSuccess: '',
        formData: {
            email: {
                element: 'input',
                value: '',
                config: {
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
            password: {
                element: 'input',
                value: '',
                config: {
                    name: 'password_input',
                    type: 'password',
                    placeholder: 'Enter your password'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
        }
    }

    updateForm = (element) => {
        const newFormdata = update(element, this.state.formData,'login');
        this.setState({
            formError: false,
            formData: newFormdata
        })
    }

    submitForm=(event)=> {
        event.preventDefault();

        let dataToSubmit = generateData(this.state.formData, 'login');
        let formIsValid = isFormValid(this.state.formData, 'login');

        if(formIsValid) {
            //Dispatch to server and get response  
            //console.log(dataToSubmit);
            this.props.dispatch(loginUser(dataToSubmit)).then(response => {
                if(response.payload.loginSuccess) {
                    //console.log(response.payload);
                    //Login Success - then Push user to another route
                    this.props.history.push('/user/dashboard')
                } else {
                    this.setState({
                        formError: true
                    })
                }
            });
        } else {
            this.setState({
                formError: true
            })
        }

    }

    render() {
        return (
            <div className="signin_wrapper">
                <form onSubmit={(event)=> this.submitForm(event)}>

                    <FormField
                        id={'email'}
                        formdata={this.state.formData.email}
                        change={(element)=> this.updateForm(element)}
                    />

                    <FormField
                        id={'password'}
                        formdata={this.state.formData.password}
                        change={(element)=> this.updateForm(element)}
                    />                   
                    
                    { this.state.formError ? 
                        <div className="error_label">
                            Please check your data
                        </div>    
                    :null }

                    <button onClick={(event)=> this.submitForm(event)}>Login</button>

                </form>
            </div>
        );
    }
}

export default connect()(withRouter(Login));