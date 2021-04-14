import React, {useState} from 'react';
import Joi from "joi-browser";
import { toast } from 'react-toastify';
import {withRouter} from 'react-router-dom';

import userAuthService from "../../services/userAuthService"
import "./styles.css";

const Signin = (props) => {
    const onSignupSelect = props.onSignupSelect;

    const schema = {
        email: Joi.string().trim().required().label("email"),
        password: Joi.string().required().label("password"),
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

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

        if(e.target.name === "email") {
            const value = e.target.value;

            result.error ? setErrorEmail(result.error.details[0].message) : setErrorEmail("");

            value ? setEmail(value) : setEmail("");
        }
        else if(e.target.name === "password") {
            const value = e.target.value;

            if(result.error) {
                setErrorPassword(result.error.details[0].message);
            }
            else {
                setErrorPassword("");
            }
            
            value ? setPassword(value) : setPassword("");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const obj = {
            email: email,
            password: password,
        };

        const result = Joi.validate(obj, schema, {abortEarly: false});

        if(result.error) {
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
            const data = await userAuthService.signin(email, password);
            if(data.status < 300) {
                props.history.push("/");
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
        <div>
            <div className="signin-title-container">Sign In</div>

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

            

            <form onSubmit={onSubmit}>
                <div className="signin-button-main-cntainer">
                    <button className="signin-button-container" onSubmit={onSubmit}>Sign In</button>
                </div>
            </form>

            <div onClick={onSignupSelect} className="signin-navlink-container">
                <div className="signin-navlink-container">
                    Don't have a account? Sign Up
                </div>
            </div>
        </div>
     );
}
 
export default withRouter(Signin);