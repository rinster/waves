import React from 'react';
import UserLayout from '../../hoc/user';
import MyButton from '../utils/button';

import UserHistoryBlock from '../utils/User/history_block';

const UserDashboard = ({ user }) => {
    return (
        <UserLayout>
            <div>

                {/* --------User Information-------- */}
                <div className="user_nfo_panel">
                    
                    <h1>User Information</h1>
                    <div>
                        <span>{user.userData.name}</span> 
                        <span>{user.userData.lastname}</span>
                        <span>{user.userData.email}</span> 
                    </div>
                    <MyButton
                        type="default"
                        title="Edit Account Info"
                        linkTo="/user/user_profile"
                    />

                </div>

                {/* --------History of Purchases-------- */}
                {
                    user.userData.history ?
                        <div className="user_nfo_panel">
                            <h1>History of Purchases</h1>
                            <div className="user_product_block_wrapper">
                                <UserHistoryBlock
                                    products={user.userData.history}
                                />
                            </div>
                        </div>
                    :null
                }


            </div>
        </UserLayout>
    );
};

export default UserDashboard;