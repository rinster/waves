import React, { Component } from 'react';
import FormField from '../utils/Form/formfield';
import { update, generateData, isFormValid } from '../utils/Form/formActions';
import Dialog from '@material-ui/core/Dialog'; //Flash messages from Material UI

// **'connect' allows us to reach the server to authenticate user**
import { connect } from 'react-redux';
import { registerUser } from '../../actions/user_actions';

class Register extends Component {

    state = {
        formError: false,
        formSuccess: false,
        formData: {
            name: {
                element: 'input',
                value: '',
                config: {
                    name: 'name_input',
                    type: 'text',
                    placeholder: 'Enter your name'
                },       
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },  
            lastname: {
                element: 'input',
                value: '',
                config: {
                    name: 'lastname_input',
                    type: 'text',
                    placeholder: 'Enter your last name'
                },       
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },
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
            confirmPassword: {
                element: 'input',
                value: '',
                config: {
                    name: 'confirm_password_input',
                    type: 'password',
                    placeholder: 'Confirm your password'
                },
                validation: {
                    required: true,
                    confirm: 'password'
                },
                valid: false,
                touched: false,
                validationMessage: ''
            },        
        }
    }

    updateForm = (element) => {
        const newFormdata = update(element, this.state.formData,'register');
        this.setState({
            formError: false,
            formData: newFormdata
        })
    }

    submitForm=(event)=> {
        event.preventDefault();

        let dataToSubmit = generateData(this.state.formData, 'register');
        let formIsValid = isFormValid(this.state.formData, 'register');

        if(formIsValid) {
            //Dispatch to server and get response  
            //console.log(dataToSubmit);
            this.props.dispatch(registerUser(dataToSubmit))
            .then(response => {
                if(response.payload.success) {
                    //If success - Show message to user and redirect to login
                    this.setState({
                        formError:false,
                        formSuccess: true
                    });
                    //Setting a 3 second timeout for user to be re-routed to login
                    //Flash material UI dialogue
                    setTimeout(()=>{
                        this.props.history.push('/register_login');
                    },3000)
                } else {
                    this.setState({formError: true})
                }
            }).catch(e => { //Catch any potential errors so no silent errors
                this.setState({formError: true})
            })
        } else {
            this.setState({
                formError: true
            })
        }

    }

    render() {
        return (
            <div className="page_wrapper">
                <div className="container">
                    <div className="register_login_container">
                        <div className="left">
                            <form onSubmit={(event)=> this.submitForm(event)}>

                                <h2>Personal Information</h2>

                                <div className="form_block_two">

                                {/* ------name------ */}
                                    <div className="block">
                                        <FormField
                                            id={'name'}
                                            formdata={this.state.formData.name}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>

                                {/* ------lastname------ */}
                                    <div className="block">
                                        <FormField
                                            id={'lastname'}
                                            formdata={this.state.formData.lastname}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                </div>

                                {/* ------Email------ */}
                                <div>
                                    <FormField
                                        id={'email'}
                                        formdata={this.state.formData.email}
                                        change={(element)=> this.updateForm(element)}
                                    />
                                </div>

                                <h2>Verify Password</h2>
                                <div className="form_block_two">
                                    <div className="block">

                                    {/* ------Password------ */}
                                            <FormField
                                                id={'password'}
                                                formdata={this.state.formData.password}
                                                change={(element)=> this.updateForm(element)}
                                            />
                                        </div>

                                    {/* ------Confirm Password------ */}
                                        <div className="block">
                                            <FormField 
                                                id={'confirmPassword'}
                                                formdata={this.state.formData.confirmPassword}
                                                change={(element)=> this.updateForm(element)}
                                            />
                                        </div>
                                </div>

                                {/* ------Submit Button/ErrorField------ */}
                                <div>
                                    { this.state.formError ? 
                                        <div className="error_label">
                                            Please check your data
                                        </div>    
                                    :null }

                                    <button onClick={(event)=> this.submitForm(event)}>Create an Account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            {/* ------MaterialUI Dialog------ */}
            {/* Only show on success */}
            <Dialog open={this.state.formSuccess}> 
                <div className="dialog_alert">
                    <div>Congratulations!</div>
                    <div>You will be redirected to the LOGIN in a couple of seconds.</div>
                </div>
            </Dialog>

            </div>
        );
    }
}

export default connect()(Register);