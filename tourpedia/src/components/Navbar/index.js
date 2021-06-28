import React, {useState, useEffect} from 'react';
import {Image, Navbar, NavDropdown, Nav} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import { toast } from 'react-toastify';

import userAuthService from '../../services/userAuthService.js';

import "./styles.css";
import Logo from '../../assets/logo.png';

const NavBar = (props) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const history = useHistory();
  
  const handleSearch = () => {
    if (searchKey) {
      history.push("/search/" + searchKey);
    }
  }

  const onKeyPress = (e) => {
    if(e.key === 'Enter'){
      handleSearch();
    }
  }

  const onChangeSearch = (e) => {
    setSearchKey(e.target.value);
  }

  const fetchData = async () => {
    const data = await userAuthService.getSavedAuthInfo();
    if (data) {
      setIsAuthenticated(true);
      setUsername(data);
    }
    else {
      setIsAuthenticated(false);
    }
  }

  const handleLogout = async () => {
    const data = await userAuthService.signout();
    history.push("/enter");

    if (data.status < 300) {
      setIsAuthenticated(false);
    }
    else {
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
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Navbar expand="xl" className="navbar-container" sticky="top">
      <Navbar.Brand as={Link} to="/">
        <Image className="nav-logo" src={Logo} />
        <div className="nav-link-container">Tour Pedia</div>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <div className="input-group">
              <input
                  type="text" 
                  id="search"  
                  name="search"  
                  placeholder="Search" 
                  value={searchKey}
                  onChange={onChangeSearch}
                  onKeyPress={onKeyPress}
                  className="nav-search-input-container" 
              />
              <div className="btn btn-outline-secondary nav-search-button-container" onClick={handleSearch}>Search</div>
          </div>

          <Nav.Link className="nav-item-link-container" as={Link} to="/event">
            Destinations
          </Nav.Link>
          <Nav.Link className="nav-item-link-container" as={Link} to="/blog">
            Blog
          </Nav.Link>

          <NavDropdown eventkey={0} className="nav-item-link-container" title="Explore">
            <NavDropdown.Item className="nav-dropdown-link" as={Link} to="/country">Country</NavDropdown.Item>
            <NavDropdown.Item className="nav-dropdown-link" as={Link} to="/category">Category</NavDropdown.Item>
          </NavDropdown>

          {
            isAuthenticated ? (
              <React.Fragment>
                {/* <Nav.Link className="nav-item-link-container" as={Link} to="/forum">
                  Forum
                </Nav.Link> */}
                <NavDropdown eventkey={0} className="nav-item-link-container" title={username}>
                  <NavDropdown.Item className="nav-dropdown-link" as={Link} to={"/user/" + username}>Profile</NavDropdown.Item>
                  <NavDropdown.Item className="nav-dropdown-link" onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </React.Fragment>
            ) : (
              <Nav.Link className="nav-item-link-container" as={Link} to="/enter">
                Signin
              </Nav.Link>
            )
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
