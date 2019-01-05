import React from 'react';
import MyButton from '../utils/button';
import Login from './login';

const RegisterLogin = (props) => {
    return (
        <div className="page_wrapper"> 
            <div className="container">
                <div className="register_login_container">
                    <div className="left">
                        <h1>New Customers</h1>
                        <p>"There is no one who loves pain itself, who seeks after it and wants to have it, 
                            simply because it is pain..." Lorem ipsum dolor sit amet, consectetur adipiscing 
                            elit. In id urna vestibulum, convallis turpis in, fringilla orci. 
                        </p>
                        <MyButton
                                type="default"
                                title="Create an Account"
                                linkTo="/register"
                                addStyles={{
                                    margin:'10px 0 0 0'
                                }}
                        />
                    </div>
                    <div className="right">
                        <h2>Registered Customers</h2>
                        <p>If you have an account, please login.</p>
                        <Login/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;