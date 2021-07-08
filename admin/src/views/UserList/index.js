import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import {Table} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import userService from '../../services/userService';
import travelagencyService from '../../services/travelagencyService';
import guideService from '../../services/guideService';

const UserList = () => {
    const [curSelection, setCurSelection] = useState("user");
    const [guides, setGuides] = useState([]);
    const [users, setUsers] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);

    const handleUpdateBanned = async (index, isBanned, userType) => {
        if (userType === 'user') {
            const data = await userService.updateBanStatus(isBanned, users[index]._id);
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
            
            const userData = [...users];
            userData[index] = {...users[index]};
            userData[index].isBanned = data.data.isBanned;
            setUsers(userData);
        }
        else if (userType === 'travelagency') {
            const data = await travelagencyService.updateBanStatus(isBanned, travelagencies[index]._id);
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
            
            const userData = [...travelagencies];
            userData[index] = {...travelagencies[index]};
            userData[index].isBanned = data.data.isBanned;
            setTravelagencies(userData);
        }
        else if (userType === 'guide') {
            const data = await guideService.updateBanStatus(isBanned, guides[index]._id);
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
            
            const userData = [...guides];
            userData[index] = {...guides[index]};
            userData[index].isBanned = data.data.isBanned;
            setGuides(userData);
        }
    }

    const fetchData = async () => {
        let data = await userService.getAllUsers();
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

        setUsers(data);

        data = await travelagencyService.getAllUsers();
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

        setTravelagencies(data);

        data = await guideService.getAllUsers();
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

        setGuides(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="user-list-main-container">
            <div className="row">
                    <div 
                        className={"col-6 col-lg-4 explore-section-title " + (curSelection === "user" ? "explore-section-selected" : "")}
                        onClick={() => {
                            setCurSelection("user");
                        }}
                    >General Users</div>
                    <div 
                        className={"col-6 col-lg-4 explore-section-title " + (curSelection === "travelagency" ? "explore-section-selected" : "")}
                        onClick={() => {
                            setCurSelection("travelagency");
                        }}
                    >Travel Agencies</div>
                    <div 
                        className={"col-6 col-lg-4 explore-section-title " + (curSelection === "guide" ? "explore-section-selected" : "")}
                        onClick={() => {
                            setCurSelection("guide");
                        }}
                    >Guides</div>
                </div>

                <br />

                {
                    curSelection === "user" ? (
                        <Table striped responsive className="user-list-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Ban Option</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.fullname}</td>
                                        {
                                            user.isBanned ? (
                                                <td>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateBanned(index, false, 'user')}
                                                    >
                                                        Banned
                                                    </button>
                                                </td>
                                            ) : (
                                                <td>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateBanned(index, true, 'user')}
                                                    >
                                                        Ban
                                                    </button>
                                                </td>
                                            )
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    ) : null
                }

                {
                    curSelection === "travelagency" ? (
                        <Table striped responsive className="user-list-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Ban Option</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                travelagencies.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.fullname}</td>
                                        {
                                            user.isBanned ? (
                                                <td>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateBanned(index, false, 'travelagency')}
                                                    >
                                                        Banned
                                                    </button>
                                                </td>
                                            ) : (
                                                <td>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateBanned(index, true, 'travelagency')}
                                                    >
                                                        Ban
                                                    </button>
                                                </td>
                                            )
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    ) : null
                }

                {
                    curSelection === "guide" ? (
                        <Table striped responsive className="user-list-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Ban Option</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                guides.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.fullname}</td>
                                        {
                                            user.isBanned ? (
                                                <td>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateBanned(index, false, 'guide')}
                                                    >
                                                        Banned
                                                    </button>
                                                </td>
                                            ) : (
                                                <td>
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateBanned(index, true, 'guide')}
                                                    >
                                                        Ban
                                                    </button>
                                                </td>
                                            )
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    ) : null
                }
            </div>
        </LayoutWrapper>
     );
}
 
export default UserList;