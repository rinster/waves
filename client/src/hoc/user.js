import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const links = [
    {
        name: 'My Account',
        linkTo: '/user/dashboard'
    },
    {
        name: 'User Information',
        linkTo: '/user/user_profile'
    },
    {
        name: 'My Cart',
        linkTo: '/user/cart'
    },
]

//These link will only show when the user is authenticated
const admin = [
    {
        name: 'Site Info',
        linkTo: '/admin/site_info'
    },
    {
        name: 'Add Products',
        linkTo: '/admin/add_product'
    },
    {
        name: 'Manage Categories',
        linkTo: '/admin/manage_categories'
    }    
]

const UserLayout = (props) => {
    
    //==========================================================
    // *****NOTE: This function generates the links but note how 
    // round parantheses is used instead of curly braces. This  
    // is because we want to return JSX.
    //==========================================================
    const generateLinks = (links) => (
        links.map((item, i)=> (
            <Link to={item.linkTo} key={i}>
                {item.name}
            </Link>
        ))
    )


    return (
        <div className="container"> 
            <div className="user_container">
                
                {/* ------Navigation------ */}
                <div className="user_left_nav">
                    <h2>My Account</h2>

                    {/* -----General Links----- */}
                    <div className="links">
                        {generateLinks(links)}
                    </div>
                    
                    {/* -----Admin Links----- */}
                    { props.user.userData.isAdmin ?
                        <div>
                            <h2>Admin</h2>
                            <div className="links">
                                {generateLinks(admin)}
                            </div>
                        </div>
                      :null
                    }
                </div>

                {/* ------Child/Show Component------ */}
                <div className="user_right">
                    {props.children}
                </div>

            </div> 
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(UserLayout);
