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
import {ImCross, ImHome, ImBook, ImBlog} from 'react-icons/im';
import {GiHamburgerMenu, GiUncertainty, GiWorld} from 'react-icons/gi';
import {MdCreate, MdEvent} from 'react-icons/md';
import {CgProfile, CgLogOut} from 'react-icons/cg';
import {BsPeopleFill} from 'react-icons/bs';
import {FaEdit} from 'react-icons/fa';

import userAuthService from '../../services/userAuthService';

import 'react-pro-sidebar/dist/scss/styles.scss';
import "./styles.css";
import "./styles.scss";

const SideNavBar = (props) => {

    const [collapsed, setCollapsed] = useState(true);

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

    useEffect(() => {
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
                                    Pedia
                                </div>
                            </MenuItem>
                        )
                    }
                    <MenuItem 
                        icon={<MdCreate className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/pedia/edit/new"
                        >
                            Create New Pedia
                        </Link>
                    </MenuItem>

                    <MenuItem 
                        icon={<ImBook className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/pedia"
                        >
                            All Pedia
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
                        icon={<GiUncertainty className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/pending/event"
                        >
                            Pending Events
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

                <Menu iconShape="circle">
                    {
                        collapsed ? null : (
                            <MenuItem>
                                <div className="sidebar-menu-title">
                                    Blog
                                </div>
                            </MenuItem>
                        )
                    }
                    <MenuItem 
                        icon={<FaEdit className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/blog/edit/new"
                        >
                            Create New Blog
                        </Link>
                    </MenuItem>
                    
                    <MenuItem 
                        icon={<ImBlog className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/blog"
                        >
                            All Blogs
                        </Link>
                    </MenuItem>
                </Menu>

                <Menu iconShape="circle">
                    {
                        collapsed ? null : (
                            <MenuItem>
                                <div className="sidebar-menu-title">
                                    Other
                                </div>
                            </MenuItem>
                        )
                    }
                    <MenuItem 
                        icon={<GiWorld className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/explore"
                        >
                            Explore
                        </Link>
                    </MenuItem>

                    <MenuItem 
                        icon={<BsPeopleFill className="sidebar-link-icon" />}>
                        <Link 
                            className="sidebar-link-item" 
                            to="/user"
                        >
                            User
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