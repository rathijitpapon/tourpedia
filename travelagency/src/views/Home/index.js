import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import {useHistory} from 'react-router-dom';
import {Image} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import userAuthService from "../../services/userAuthService";

const Home = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const [fullname, setFullname] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [about, setAbout] = useState('');
    const [category, setCategory] = useState([]);
    const [isAgency, setIsAgency] = useState(false);
    const [isBanned, setIsBanned] = useState(false);

    const fetchData = async () => {
        setLoading(true);

        const user = userAuthService.getSavedAuthInfo();
        if (user.isAgency === 'agency') {
            setIsAgency(true);
        }
        else {
            setIsAgency(false);
        }
        
        const data = await userAuthService.getProfile(user.username, user.isAgency);
        if (data.status >= 300) {
            toast.error("User Profile is Private", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            await userAuthService.signOut();
            history.push("/");
            return;
        }

        if (user.isAgency === 'agency') {
            const formattedData = [];
            for (const cat of data.user.category) {
                formattedData.push(cat._id.name);
            }
            setCategory(formattedData);
        }

        setAbout(data.user.about);
        setProfileImage(data.user.profileImage);
        setFullname(data.user.fullname);
        setIsBanned(data.user.isBanned);

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="home-main-container"
            >
                {isBanned ? (
                    <div className="profile-title-container" style={{ textAlign: 'center' }}>This user is banned</div>
                ): (
                <div>
                    <div className="row">
                        <div className="col-12">
                            <Image className="profile-image-container" src={profileImage} roundedCircle />
                        </div>

                        <div className="col-12">
                            <br />
                            <div className="col-12">
                                <div className="home-fullname">{fullname}</div>
                            </div>
                        </div>
                        <div
                            style={{
                                lineHeight: '45px',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                            hidden={!isAgency}
                        >
                            {
                                category.map((ctg, index) => (
                                    <React.Fragment key={index}>
                                    <span   
                                        className="home-category"
                                    >
                                        {ctg}
                                    </span> &nbsp; </React.Fragment>
                                ))
                            }
                        </div>
                        <div className="col-12">
                            <div className="home-about">{about}</div>
                        </div>
                    </div>
                </div>
                )}
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Home;