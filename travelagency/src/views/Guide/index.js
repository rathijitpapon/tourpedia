import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import {Table} from 'react-bootstrap';
import {Modal, Fade, Backdrop} from '@material-ui/core';
import Joi from "joi-browser";

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import userAuthService from '../../services/userAuthService';

const Guide = () => {
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";
    const [openModal, setOpenModal] = useState(false);

    const [guides, setGuides] = useState([]);

    const schema = {
        fullname: Joi.string().trim().required().max(30).label("fullname"),
        username: Joi.string().trim().required().min(5).max(10).label("username"),
        email: Joi.string().trim().required().email().label("email"),
        password: Joi.string().required().min(6).label("password"),
    };

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("");

    const handleAddGuide = async () => {
        if(!username || !fullname || !password || !email) {
            toast.error('Please Fill All The Fields', {
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

        const obj = {
            fullname,
            username,
            email,
            password,
        };

        const result = Joi.validate(obj, schema);
        if (result.error) {
            toast.error(result.error.details[0].message, {
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

        setLoading(true);
        const travelagency = userAuthService.getSavedAuthInfo();
        if (!travelagency) {
            toast.error('Unauthorized', {
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
        if (travelagency.isAgency === 'guide') {
            toast.error('You are not allowed to view this page', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            history.push("/home");
            return;
        }
        
        const data = await userAuthService.signup(username, email, password, fullname, 'guide');
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
            setLoading(false);
            return;
        }

        setLoading(false);
        setOpenModal(false);
        await fetchData();
    }

    const handleRemoveGuide = async (index) => {
        const guideId = guides[index]._id._id;

        setLoading(true);
        const data = await userAuthService.removeGuide(guideId);
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
            setLoading(false);
            return;
        }
        
        setLoading(false);
        await fetchData();
    }

    const fetchData = async () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setFullname('');

        setLoading(true);
        const travelagency = userAuthService.getSavedAuthInfo();
        if (!travelagency) {
            toast.error('Unauthorized', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            history.push("/");
            return;
        }

        if (travelagency.isAgency === 'guide') {
            toast.error('You are not allowed to view this page', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            history.push("/home");
            return;
        }

        const data = await userAuthService.getProfile(travelagency.username, travelagency.isAgency);
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
            setLoading(false);
            return;
        }

        setGuides(data.user.guide);
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
                className="guide-main-container"
            >
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                        <div className="guide-modal-body">
                            <div className="guide-add-title">Add Guide</div>
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <div className="guide-section-title">Username</div>
                                    <input
                                        type="text"
                                        className="guide-text-input"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="guide-section-title">Password</div>
                                    <input
                                        type="text"
                                        className="guide-text-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="guide-section-title">Email</div>
                                    <input
                                        type="email"
                                        className="guide-text-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="guide-section-title">Full Name</div>
                                    <input
                                        type="text"
                                        className="guide-text-input"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                    />
                                </div>
                            </div>

                            <br />

                            <button
                                className="btn btn-primary guide-add-button"
                                onClick={handleAddGuide}
                            >
                                Save
                            </button>
                        </div>
                    </Fade>
                </Modal>
                <button
                    className="btn btn-primary guide-add-button"
                    onClick={() => setOpenModal(true)}
                >
                    Add Guide
                </button>
                <Table striped responsive className="guide-list-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Remove Option</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        guides.map((user, index) => (
                            <tr key={index}>
                                <td>{user._id.username}</td>
                                <td>{user._id.email}</td>
                                <td>{user._id.fullname}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleRemoveGuide(index)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                {
                    guides.length === 0 ? (
                        <div className="guide-text">Currently No Guides Added</div>
                    ) : null
                }
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Guide;