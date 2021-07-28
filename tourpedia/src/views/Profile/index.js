import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {toast} from 'react-toastify';
import Select from 'react-select';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay'

import EventLongCard from "../../components/EventLongCard";
import TourPlanLongCard from "../../components/TourPlanLongCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import userAuthService from "../../services/userAuthService";
import fileService from "../../services/fileService";

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        height: '50px',
        width: '250px',
    }),
    menu: provided => ({ 
        ...provided, 
        zIndex: 9999,
        width: '250px',
    })
};

const Profile = (props) => {
    const username = props.match.params.username;
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const [fullname, setFullname] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isBanned, setIsBanned] = useState(false);
    const [about, setAbout] = useState('');

    const [tourplans, setTourplans] = useState([]);
    const [savedEvents, setSavedEvents] = useState([]);
    const [enrolledEvents, setEnrolledEvents] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [curFullname, setCurFullname] = useState("");
    const [curProfileImage, setCurProfileImage] = useState("");
    const [curAbout, setCurAbout] = useState("");

    const handleSortOptionChange = (newValue, actionMeta) => {
        setSortOption(newValue);
    };

    const options = [
        { value: 'Enrolled Events', label: 'Enrolled Events'},
        { value: 'Saved Events', label: 'Saved Events'},
        { value: 'Saved Tour Plans' , label: 'Saved Tour Plans'},
    ];
    const [sortOption, setSortOption] = useState(options[0]);

    const fetchData = async () => {
        const user = await userAuthService.getSavedAuthInfo();
        if(!user) {
            history.push("/enter");
            toast.error("Please Sign in", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setLoading(true);
        const data = await userAuthService.getProfile(username);

        if (data.status >= 300) {
            history.push("/");
            toast.error("User Profile is Private", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            return;
        }

        setAbout(data.user.about);
        setProfileImage(data.user.profileImage);
        setFullname(data.user.fullname);

        setCurFullname(data.user.fullname);
        setCurProfileImage(data.user.profileImage);
        setCurAbout(data.user.about);

        setIsBanned(data.user.isBanned);

        let formattedData = [];
        for (let i = 0; i < data.user.savedEvent.length; i++) {
            formattedData.push(data.user.savedEvent[i]._id);
        }
        setSavedEvents(formattedData);

        formattedData = [];
        for (let i = 0; i < data.user.enrolledEvent.length; i++) {
            formattedData.push(data.user.enrolledEvent[i]._id);
        }
        setEnrolledEvents(formattedData);

        formattedData = [];
        for (let i = 0; i < data.user.savedTourPlan.length; i++) {
            formattedData.push(data.user.savedTourPlan[i]._id);
        }
        setTourplans(formattedData);

        setLoading(false);
    }

    const handleCancelEdit = () => {
        setCurFullname(fullname);
        setCurProfileImage(profileImage);
        setCurAbout(about);
        setIsEdit(false);
    }

    const handleSaveProfile = async () => {
        let url = profileImage;
        if (curProfileImage !== profileImage) {
            const imageData = await fileService.uploadImage(curProfileImage);
            if (imageData.status >= 300) {
                toast.error(imageData.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            url = imageData.data.secure_url;
        }
        const data = await userAuthService.updateProfile(curFullname, curAbout, url);
        
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            toast.success("Profile Updated Successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        setIsEdit(false);
        setCurFullname(data.data.fullname);
        setCurProfileImage(data.data.profileImage);
        setCurAbout(data.data.about);

        setFullname(data.data.fullname);
        setAbout(data.data.about);
        setProfileImage(data.data.profileImage);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
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
                className="loading-height"
            >
            <div className="profile-main-wrapper">
                <div className="profile-main-container">
                    {
                        !isEdit ? (
                            <>
                                <Image className="profile-image-container" src={profileImage} roundedCircle />
                                <div>
                                    <div 
                                        className="profile-fullname-container"
                                    >{fullname}</div>
                                    <div 
                                        className="profile-about-container"
                                    >{about}</div>
                                    <br />
                                    <div style={{textAlign: "center",}}>
                                    <button
                                        style={{
                                            width: '150px',
                                        }}
                                        className="btn btn-primary profile-button"
                                        onClick={() => setIsEdit(true)}
                                    >Edit Profile</button></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                <Image className="profile-image-container" src={(curProfileImage !== profileImage) ? URL.createObjectURL(curProfileImage) : curProfileImage} roundedCircle />
                                <div>
                                    <input 
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                setCurProfileImage(e.target.files[0])
                                            }
                                        }}
                                        placeholder="Report File"
                                        accept=".png, .jpg, .jpeg, .gif"
                                        style={{
                                            textAlign: 'center',
                                            display: 'block',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            margin: "20px auto",
                                        }}
                                    />
                                </div>
                                </div>
                                <div>
                                    <div>
                                    <input 
                                        className="profile-edit-name"
                                        type="text"
                                        value={curFullname}
                                        onChange={(e) => setCurFullname(e.target.value)}
                                    />
                                    </div>
                                    <div>
                                    <textarea
                                        className="profile-edit-about"
                                        type="text"
                                        value={curAbout}
                                        onChange={(e) => setCurAbout(e.target.value)}
                                    />
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                    <button
                                        style={{
                                            marginRight: '10px'
                                        }} 
                                        className="btn btn-secondary profile-button"
                                        onClick={handleCancelEdit}
                                    >Cancel</button>
                                    <button 
                                        className="btn btn-primary profile-button"
                                        onClick={handleSaveProfile}
                                    >Save</button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>

                <br /><br />
                <div className="row">
                    <div className="col-md-6 col-12 profile-my-items">
                        My Items
                    </div>
                    <div style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                    }}>
                        <Select
                            styles={customStyles}
                            className="col-md-6 col-12 profile-sort-container"
                            onChange={handleSortOptionChange}
                            options={options}
                            value={sortOption}
                        />
                    </div>
                </div>
                
                <br />

                {
                    sortOption.value  === "Enrolled Events" ? (
                        enrolledEvents.map((event, index) => (
                            <EventLongCard
                                key={index}
                                event={event}
                            />
                        ))
                    ) : null
                }

                {
                    sortOption.value  === "Saved Events" ? (
                        savedEvents.map((event, index) => (
                            <EventLongCard
                                key={index}
                                event={event}
                            />
                        ))
                    ) : null
                }

                {
                    sortOption.value === "Saved Tour Plans" ? (
                        tourplans.map((tourplan, index) => (
                            <TourPlanLongCard
                                key={index}
                                tourplan={tourplan}
                            />
                        ))
                    ) : null
                }
                <div hidden={!isBanned} className="profile-fullname-container" style={{ textAlign: 'center' }}>This user is banned</div>
            </div>
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Profile;