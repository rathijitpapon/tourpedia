import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';
import {Image} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import userAuthService from "../../services/userAuthService";
import exploreService from "../../services/exploreService";
import fileService from "../../services/fileService";

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        minHeight: '40px',
    }),
    menu: provided => ({
        ...provided, 
        zIndex: 9999,
    })
};

const Profile = () => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const [fullname, setFullname] = useState('');
    const [profileImage, setProfileImage] = useState({
        img: '',
        isNew: false,
    });
    const [isBanned, setIsBanned] = useState(false);
    const [about, setAbout] = useState('');
    const [isAgency, setIsAgency] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoryOption, setCategoryOption] = useState([]);

    const fetchData = async () => {
        setLoading(true);

        let data = await exploreService.getAllExplore("category");
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        data = data.data;
        
        let formattedData = [];
        for (const cat of data) {
            formattedData.push({
                value: cat.name,
                label: cat.name,
                name: cat.name,
                id: cat._id,
            });
        }
        setCategories(formattedData);

        const user = userAuthService.getSavedAuthInfo();
        if (user.isAgency === 'agency') {
            setIsAgency(true);
        }
        else {
            setIsAgency(false);
        }
        
        data = await userAuthService.getProfile(user.username, user.isAgency);
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
            history.push("/");
            return;
        }

        if (user.isAgency === 'agency') {
            formattedData = [];
            for (const cat of data.user.category) {
                formattedData.push({
                    value: cat._id.name,
                    label: cat._id.name,
                    name: cat._id.name,
                    id: cat._id._id,
                });
            }
            setCategoryOption(formattedData);
        }

        setAbout(data.user.about);
        setProfileImage({
            img: data.user.profileImage,
            isNew: false,
        });
        setFullname(data.user.fullname);
        setIsBanned(data.user.isBanned);

        setLoading(false);
    }

    const handleSaveProfile = async () => {
        setLoading(true);

        if (!fullname || !categoryOption.length === 0 || !about || !profileImage.img) {
            toast.error('Please Fill All The Fields', {
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

        let url = profileImage.img;
        if (profileImage.isNew) {
            const imageData = await fileService.uploadImage(profileImage.img);
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
        
        const user = userAuthService.getSavedAuthInfo();

        const categoryData = [];
        if (user.isAgency === 'agency') {
            for (const ctg of categoryOption) {
                categoryData.push(ctg.id);
            }
        }

        const data = await userAuthService.updateProfile(fullname, about, url, categoryData, user.isAgency);
        
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
            return;
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

        if (user.isAgency === 'agency') {
            const formattedData = [];
            for (const cat of data.data.category) {
                formattedData.push({
                    value: cat._id.name,
                    label: cat._id.name,
                    name: cat._id.name,
                    id: cat._id._id,
                });
            }
            setCategoryOption(formattedData);
        }

        setFullname(data.data.fullname);
        setAbout(data.data.about);
        setProfileImage({
            img: data.data.profileImage,
            isNew: false,
        });

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
                className="profile-main-container"
            >
                {isBanned ? (
                    <div className="profile-title-container" style={{ textAlign: 'center' }}>This user is banned</div>
                ): (
                <div>
                <div className="row">
                    <div className="col-md-6 col-12">
                        <Image className="profile-image-container" src={
                            profileImage.isNew ? URL.createObjectURL(profileImage.img) : profileImage.img
                        } roundedCircle />
                        <div>
                            <input 
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setProfileImage({
                                            img: e.target.files[0],
                                            isNew: true,
                                        })
                                    }
                                }}
                                placeholder="Image File"
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

                    <div className="col-md-6 col-12">
                        <br />
                        <div className="col-12">
                            <div className="profile-section-title">Full Name</div>
                            <input
                                type="text"
                                className="profile-input-container"
                                onChange={(e) => setFullname(e.target.value)}
                                value={fullname}
                            />
                        </div>
                        <div className="col-12" hidden={!isAgency}>
                            <div className="profile-section-title">Category</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="profile-select-container"
                                onChange={(newValue, actionMeta) => setCategoryOption(newValue)}
                                options={categories}
                                value={categoryOption}
                            />
                        </div>
                    </div>
                        <div className="col-12">
                            <div className="profile-section-title">About</div>
                            <textarea
                                type="text"
                                className="profile-text-area-container"
                                onChange={(e) => setAbout(e.target.value)}
                                value={about}
                                placeholder="About..."
                            />
                        </div>
                    </div>

                    <br />
                    <button className="btn btn-primary profile-save-btn" onClick={handleSaveProfile}>Save Profile</button>
                </div>
            )}
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Profile;