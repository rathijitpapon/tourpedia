import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import { 
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarContent,
} from 'react-pro-sidebar';
import {ImCross, ImHome} from 'react-icons/im';
import {GiHamburgerMenu} from 'react-icons/gi';
import {MdCreate, MdEvent} from 'react-icons/md';
import {CgProfile, CgLogOut} from 'react-icons/cg';
import {BsPeopleFill} from 'react-icons/bs';

import userAuthService from '../../services/userAuthService';

import 'react-pro-sidebar/dist/scss/styles.scss';
import "./styles.css";
import "./styles.scss";

const SideNavBar = (props) => {

    const [collapsed, setCollapsed] = useState(true);
    const [isAgency, setIsAgency] = useState(false);

    const handleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const handleLogout = async () => {
        const data = userAuthService.getSavedAuthInfo();
        if (data) {
            const isAgency = data.isAgency;
            const response = await userAuthService.signout(isAgency);
            if (response.status < 300) {
                props.history.push("/");
            }
        }
    }

    const fetchData = async () => {
        const data = userAuthService.getSavedAuthInfo();
        if (data.isAgency === 'agency') {
            setIsAgency(true);
        }
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProSidebar
            collapsed={collapsed}
            className="sidebar-main-container"
        >
            <SidebarHeader className="sidebar-ham-icon" onClick={handleCollapsed}>
                {
                    collapsed ? (
                        <GiHamburgerMenu />
                    ) : (
                        <ImCross />
                    )
                }
            </SidebarHeader>

            <SidebarContent className="sidebar-content-container">
                <Menu iconShape="circle">
                    {
                        collapsed ? null : (
                            <MenuItem>
                                <div className="sidebar-menu-title">
                                    Dashboard
                                </div>
                            </MenuItem>
                        )
                    }
                    <MenuItem 
                        icon={<ImHome className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/home"
                        >
                            Home
                        </Link>
                    </MenuItem>
                </Menu>

                <Menu iconShape="circle">
                    {
                        collapsed ? null : (
                            <MenuItem>
                                <div className="sidebar-menu-title">
                                    Event
                                </div>
                            </MenuItem>
                        )
                    }
                    <MenuItem 
                        icon={<MdCreate className="sidebar-link-icon" />}
                        hidden={!isAgency}
                    >
                        <Link 
                            className="sidebar-link-item" 
                            to="/event/edit/new"
                        >
                            Create New Event
                        </Link>
                    </MenuItem>

                    <MenuItem 
                        icon={<MdEvent className="sidebar-link-icon" />}
                    >
                        <Link 
                            className="sidebar-link-item" 
                            to="/event"
                        >
                            All Events
                        </Link>
                    </MenuItem>
                </Menu>

                <Menu iconShape="circle" hidden={!isAgency}>
                    {
                        collapsed ? null : (
                            <MenuItem>
                                <div className="sidebar-menu-title">
                                    Guide
                                </div>
                            </MenuItem>
                        )
                    }
                    
                    <MenuItem 
                        icon={<BsPeopleFill className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/guide"
                        >
                            All Guides
                        </Link>
                    </MenuItem>
                </Menu>

                <Menu iconShape="circle">
                    {
                        collapsed ? null : (
                            <MenuItem>
                                <div className="sidebar-menu-title">
                                    Settings
                                </div>
                            </MenuItem>
                        )
                    }
                    <MenuItem 
                        icon={<CgProfile className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/profile"
                        >
                            Profile
                        </Link>
                    </MenuItem>
                    
                    <MenuItem 
                        icon={<CgLogOut className="sidebar-link-icon" onClick={handleLogout} />}
                    >
                        <div className="sidebar-link-item" onClick={handleLogout}>
                            Logout
                        </div>
                    </MenuItem>
                </Menu>
            </SidebarContent>
        </ProSidebar>
    );
}
 
export default withRouter(SideNavBar);