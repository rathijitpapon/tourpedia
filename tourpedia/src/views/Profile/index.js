import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';

import userAuthService from "../../services/userAuthService";

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Profile = (props) => {
    const username = props.match.params.username;

    const [isFetched, setIsFetched] = useState(false);
    const [fullname, setFullname] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isBanned, setIsBanned] = useState(false);
    const [about, setAbout] = useState('');
    const [hasUser, setHasUser] = useState(false);

    const fetchData = async () => {
        const data = await userAuthService.getProfile(username);

        if (data.status >= 300) {
            setHasUser(false);
        }

        else {
            setAbout(data.user.about);
            setProfileImage(data.user.profileImage);
            setFullname(data.user.fullname);
            setIsBanned(data.user.isBanned);
            setIsFetched(true);
            setHasUser(true);
        }
    }

    useEffect(() => {
        fetchData();
    });

    return ( 
        <LayoutWrapper>
            {
                isFetched ? (
                    <React.Fragment>
                    {
                        hasUser ? (
                            <React.Fragment>
                            {
                                !isBanned ? (
                                    <div className="profile-main-container">
                                        <Image className="profile-image-container" src={profileImage} roundedCircle />
                                        <div>
                                            <div className="profile-fullname-container">{fullname}</div>
                                            <div className="profile-about-container">{about}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="profile-fullname-container" style={{ textAlign: 'center' }}>This user is banned</div>
                                )
                            }
                            </React.Fragment>
                        ) : (
                            <div className="profile-fullname-container" style={{ textAlign: 'center' }}>No user exists with this username</div>
                        )
                    }
                    </React.Fragment>
                ) : null
            }
        </LayoutWrapper>
     );
}
 
export default Profile;