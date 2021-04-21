import React, {useState} from 'react';
import Joi from "joi-browser";
import { toast } from 'react-toastify';
import {withRouter} from 'react-router-dom';

import userAuthService from "../../services/userAuthService"
import "./styles.css";

const Signup = (props) => {
    const onSigninSelect = props.onSigninSelect;

    const schema = {
        fullname: Joi.string().trim().required().max(30).label("fullname"),
        username: Joi.string().trim().required().min(5).max(10).label("username"),
        email: Joi.string().trim().required().email().label("email"),
        password: Joi.string().required().min(6).label("password"),
        confirmPassword: Joi.string().required().min(6).label("confirmPassword"),
    };

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [errorFullname, setErrorFullname] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorpasswordConfirm, setErrorPasswordConfirm] = useState("");

    const validateProperty = (name, value) => {
        const obj = {
            [name]: String(value),
        };
        const fieldSchema = {
            [name]: schema[name],
        };

        const result = Joi.validate(obj, fieldSchema);
        return result;
    };

    const handleInputChange = (e) => {
        const result = validateProperty(e.target.name, e.target.value);

        if(e.target.name === "fullname") {
            const value = e.target.value;

            result.error ? setErrorFullname(result.error.details[0].message) : setErrorFullname("");

            value ? setFullname(value) : setFullname("");
        }
        else if(e.target.name === "username") {
            const value = e.target.value;

            result.error ? setErrorUsername(result.error.details[0].message) : setErrorUsername("");

            value ? setUsername(value) : setUsername("");
        }
        else if(e.target.name === "email") {
            const value = e.target.value;

            result.error ? setErrorEmail(result.error.details[0].message) : setErrorEmail("");

            value ? setEmail(value) : setEmail("");
        }
        else if(e.target.name === "password") {
            const value = e.target.value;

            if(result.error) {
                setErrorPassword(result.error.details[0].message);
            }
            else if(value !== passwordConfirm) {
                setErrorPassword("password doesn't match with confirm password");
                setErrorPasswordConfirm("password doesn't match with confirm password");
            }
            else {
                setErrorPassword("");
                setErrorPasswordConfirm("");
            }
            
            value ? setPassword(value) : setPassword("");
        }
        else if(e.target.name === "confirmPassword") {
            const value = e.target.value;

            if(result.error) {
                setErrorPasswordConfirm(result.error.details[0].message);
            }
            else if(value !== password) {
                setErrorPassword("password doesn't match with confirm password");
                setErrorPasswordConfirm("password doesn't match with confirm password");
            }
            else {
                setErrorPassword("");
                setErrorPasswordConfirm("");
            }

            value ? setPasswordConfirm(value) : setPasswordConfirm("");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const obj = {
            fullname: fullname,
            username: username,
            email: email,
            password: password,
            confirmPassword: passwordConfirm,
        };

        const result = Joi.validate(obj, schema, {abortEarly: false});

        if(result.error || password !== passwordConfirm) {
            toast.error("Please fillup the form correctly", {
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
            const data = await userAuthService.signup(username, email, password, fullname, 'agency');
            if(data.status < 400) {
                props.history.push("/home");
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
    };

    return ( 
        <div className="signup-main-container">
            <div className="signin-title-container">Join as Travel Agency</div>

            <div className="signin-field-container">
                <div className="signin-field-title-container">
                    <label htmlFor="email">Agency Full Name</label>
                </div>
                <input
                    type="text"
                    id="fullname"
                    name="fullname" 
                    placeholder="Agency Full Name"
                    value={fullname}
                    onChange={handleInputChange}
                    className="signin-input-container" 
                />
                <div className="signin-error-container">{errorFullname}</div>
            </div>

            <div className="signin-field-container">
                <div className="signin-field-title-container">
                    <label htmlFor="email">Username</label>
                </div>
                <input
                    type="text"
                    id="username"
                    name="username" 
                    placeholder="Username"
                    value={username}
                    onChange={handleInputChange}
                    className="signin-input-container" 
                />
                <div className="signin-error-container">{errorUsername}</div>
            </div>

            <div className="signin-field-container">
                <div className="signin-field-title-container">
                    <label htmlFor="email">Email</label>
                </div>
                <input
                    type="text"
                    id="email"
                    name="email" 
                    placeholder="Email"
                    value={email}
                    onChange={handleInputChange}
                    className="signin-input-container" 
                />
                <div className="signin-error-container">{errorEmail}</div>
            </div>

            <div className="signin-field-container">
                <div className="signin-field-title-container">
                    <label htmlFor="password">Password</label>
                </div>
                <input 
                    type="password" 
                    id="password"  
                    name="password"  
                    placeholder="Password" 
                    value={password}
                    onChange={handleInputChange}
                    className="signin-input-container" 
                />
                <div className="signin-error-container">{errorPassword}</div>
            </div>

            <div className="signin-field-container">
                <div className="signin-field-title-container">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                </div>
                <input 
                    type="password" 
                    id="confirmPassword"  
                    name="confirmPassword"  
                    placeholder="Confirm Password" 
                    value={passwordConfirm}
                    onChange={handleInputChange}
                    className="signin-input-container" 
                />
                <div className="signin-error-container">{errorpasswordConfirm}</div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="signin-button-main-cntainer">
                    <button className="signin-button-container" onSubmit={onSubmit}>Sign Up</button>
                </div>
            </form>

            <div onClick={onSigninSelect} className="signin-navlink-container">
                <div className="signin-navlink-container">
                    Already have an account? Sign In
                </div>
            </div>
        </div>
     );
}
 
export default withRouter(Signup);