import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { FaTrash } from 'react-icons/fa';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from '../../services/exploreService';
import fileService from '../../services/fileService';
import pediaService from '../../services/pediaService';

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

const EditPedia = (props) => {

    const pediaId = props.match.params.pediaId;
    const history = useHistory();

    const [images, setImages] = useState([]);
    const [placeDetails, setPlaceDetails] = useState([]);
    const [countries, setCountries] = useState([]);
    const [places, setPlaces] = useState([]);

    const [countryOption, setCountryOption] = useState("");
    const [placeOption, setPlaceOption] = useState("");
    const [videoURL, setVideoURL] = useState("");
    const [area, setArea] = useState([]);
    const [food, setFood] = useState([]);

    const [isDisabled, setIsDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const handleAddSection = (sectionType) => {
        if (sectionType === 'area') {
            const data = [...area];
            data.push({
                name: '',
                imageURL: {
                    img: '',
                    isNew: true,
                },
                videoURL: '',
                description: '',
                isNew: true,
                id: '',
            });
            setArea(data);
        }
        else if (sectionType === 'food') {
            const data = [...food];
            data.push({
                name: '',
                imageURL: {
                    img: '',
                    isNew: true,
                },
                videoURL: '',
                description: '',
                isNew: true,
                id: '',
            });
            setFood(data);
        }
    }

    const handleDeleteSection = (sectionType, index) => {
        if (sectionType === 'area') {
            const data = [...area];
            data.splice(index, 1);
            setArea(data);
        }
        else if (sectionType === 'food') {
            const data = [...food];
            data.splice(index, 1);
            setFood(data);
        }
    }

    const handleEditSection = (sectionType, index, name, imageURL, videoURL, description) => {
        if (sectionType === 'area') {
            const data = [...area];
            data[index] = {...area[index]};
            data[index] = {
                name,
                imageURL,
                videoURL,
                description,
                isNew: area[index].isNew,
            };
            if (!area[index].isNew) {
                data[index]._id = area[index]._id;
            }
            setArea(data);
        }
        else if (sectionType === 'food') {
            const data = [...food];
            data[index] = {...food[index]};
            data[index] = {
                name,
                imageURL,
                videoURL,
                description,
                isNew: food[index].isNew,
            };
            if (!food[index].isNew) {
                data[index]._id = food[index]._id;
            }
            setFood(data);
        }
    }

    const handleCountrySelection = async (newValue) => {
        setCountryOption(newValue);

        let formattedData = [];
        for (const coun of placeDetails) {
            if (coun.name === newValue.name) {
                for (const plc of coun.place) {
                    formattedData.push({
                        value: plc._id.name,
                        label: plc._id.name,
                        name: plc._id.name,
                        id: plc._id._id,
                    });
                }
            }
        }
        setPlaces(formattedData);
        setPlaceOption([]);
    }

    const addImages = (files) => {
        const curImages = [...images];
        for (const file of files) {
            curImages.push({
                img: file,
                isURL: false,
            });
        }
        setImages(curImages);
    }

    const removeImage = (index) => {
        const curImages = [...images];
        curImages.splice(index, 1);
        setImages(curImages);
    }

    const handleSave = async () => {
        if (images.length === 0 || !videoURL || !placeOption || !countryOption) {
            toast.error('Please Fillup All The Fields', {
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
        if (area.length === 0 || food.length === 0) {
            toast.error('Please Add Atleast One Area & One Food', {
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

        for (const obj of area) {
            if (!obj.imageURL.img) {
                toast.error('Please Add Image in the Area', {
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
        }

        for (const obj of food) {
            if (!obj.imageURL.img) {
                toast.error('Please Add Image in the Food', {
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
        }
        
        const imageData = [];
        for (const file of images) {
            if (!file.isURL) {
                const data = await fileService.uploadImage(file.img);
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
                imageData.push(data.data.secure_url);
            }
            else {
                imageData.push(file.img);
            }
        }

        const areaData = [];
        const foodData = [];

        for (const obj of area) {
            const temp = {
                name: obj.name,
                description: obj.description,
            };
            if (!obj.isNew) {
                temp._id = obj._id;
            }
            
            if (obj.imageURL.isNew) {
                const data = await fileService.uploadImage(obj.imageURL.img);
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
                temp.imageURL = [data.data.secure_url];
            }
            else {
                temp.imageURL = [obj.imageURL.img];
            }
            areaData.push(temp);
        }

        for (const obj of food) {
            const temp = {
                name: obj.name,
                description: obj.description,
            };
            if (!obj.isNew) {
                temp._id = obj._id;
            }
            
            if (obj.imageURL.isNew) {
                const data = await fileService.uploadImage(obj.imageURL.img);
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
                temp.imageURL = [data.data.secure_url];
            }
            else {
                temp.imageURL = [obj.imageURL.img];
            }
            foodData.push(temp);
        }

        if (pediaId.toLowerCase() !== 'new') {
            const data = await pediaService.editPedia(imageData, videoURL, areaData, foodData, pediaId);
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
            history.push('/pedia');

            return;
        }

        const data = await pediaService.createPedia(imageData, videoURL, areaData, foodData, countryOption.id, placeOption.id);
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
        history.push('/pedia');
    }

    const fetchData = async () => {
        setLoading(true);

        let data = await exploreService.getAllExplore("country");
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
        for (const coun of data) {
            formattedData.push({
                value: coun.name,
                label: coun.name,
                name: coun.name,
                id: coun._id,
            });
        }
        setCountries(formattedData);
        setPlaceDetails(data);

        if (pediaId && pediaId.toLowerCase() === 'new') {
            setCountryOption("");
            setPlaceOption("");
            setImages([]);
            setIsDisabled(false);
        }
        else {
            setIsDisabled(true);
            data = await pediaService.getPediaById(pediaId);
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
                setLoading(false);
                history.push("/pedia");
                return;
            }
            
            const imageData = [];
            for (const img of data.data.imageURL) {
                imageData.push({
                    img: img,
                    isURL: true,
                })
            }
            setImages(imageData);

            const areaData = [];
            const foodData = [];
            setVideoURL(data.data.videoURL);

            for (const obj of data.data.area) {
                areaData.push({
                    name: obj._id.name,
                    description: obj._id.description,
                    imageURL: {
                        img: obj._id.imageURL[0],
                        isNew: false,
                    },
                    videoURL: obj._id.videoURL,
                    isNew: false,
                    _id: obj._id._id
                });
            }
            for (const obj of data.data.food) {
                foodData.push({
                    name: obj._id.name,
                    description: obj._id.description,
                    imageURL: {
                        img: obj._id.imageURL[0],
                        isNew: false,
                    },
                    videoURL: obj._id.videoURL,
                    isNew: false,
                    _id: obj._id._id
                });
            }

            setArea(areaData);
            setFood(foodData);

            const countryData = {
                value: data.data.country._id.name,
                label: data.data.country._id.name,
                name: data.data.country._id.name,
                id: data.data.country._id._id,
            };
            const placeData = {
                value: data.data.place._id.name,
                label: data.data.place._id.name,
                name: data.data.place._id.name,
                id: data.data.place._id._id,
            };

            setCountryOption(countryData);
            setPlaceOption(placeData);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pediaId]);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
            active={loading}
            spinner={
                <ClipLoader color={color} loading={loading} size={50} />
            }
            className="edit-pedia-main-container"
        >
            <div className="row">
                <div className="col-md-6 col-12">
                    <div className="edit-blog-section-title">Country</div>
                    <Select
                        isDisabled={isDisabled}
                        styles={customStyles}
                        className="edit-blog-select-container"
                        onChange={(newValue, actionMeta) => handleCountrySelection(newValue)}
                        options={countries}
                        value={countryOption}
                    />
                </div>
                <div className="col-md-6 col-12">
                    <div className="edit-blog-section-title">Place</div>
                    <Select
                        isDisabled={isDisabled}
                        styles={customStyles}
                        className="edit-blog-select-container"
                        onChange={(newValue, actionMeta) => setPlaceOption(newValue)}
                        options={places}
                        value={placeOption}
                    />
                </div>
                <div className="col-md-6 col-12">
                    <div className="edit-blog-section-title">Video URL</div>
                    <input
                        type="text"
                        className="edit-pedia-video"
                        onChange={(e) => setVideoURL(e.target.value)}
                        value={videoURL}
                    />
                </div>
            </div>
            <br />

            <div className="row">
                {
                    images.map((image, index) => (
                        <div key={index} className="col-lg-6 col-12 edit-blog-img">
                            <span 
                                className="close"
                                onClick={() => removeImage(index)}
                            >&times;</span>
                            <Image
                                className="edit-blog-img-container" 
                                src={image.isURL ? image.img : URL.createObjectURL(image.img)}
                                alt="blog img"
                            />
                        </div>
                    ))
                }
            </div>

            <div className="edit-pedia-section-heading">Area</div>
            {
                area.map((data, index) => (
                    <div key={index} className="edit-pedia-section-card">
                        {
                            data.isNew ? (
                                <FaTrash 
                                    className="edit-pedia-section-icon"
                                    onClick={() => handleDeleteSection('area', index)}
                                />
                            ) : null
                        }
                        <div>
                            <div className="edit-pedia-section-title">Title</div>
                            <input 
                                type="text"
                                value={data.name}
                                className="edit-pedia-section-name"
                                onChange={(e) => handleEditSection('area', index, e.target.value, data.imageURL, data.videoURL, data.description)}
                                placeholder="Title"
                            />
                        </div>
                        <div>
                            <div className="edit-pedia-section-title">Description</div>
                            <textarea 
                                type="text"
                                value={data.description}
                                className="edit-pedia-section-description"
                                onChange={(e) => handleEditSection('area', index, data.name, data.imageURL, data.videoURL, e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <div className="edit-pedia-section-title">Image</div>
                            {
                                data.imageURL.img ? (
                                    <Image src={data.imageURL.isNew ? URL.createObjectURL(data.imageURL.img) : data.imageURL.img} className="edit-pedia-section-image" />
                                ) : null
                            }
                            <div>
                            <input 
                                type="file"
                                accept=".png, .jpg, .jpeg, .gif"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        handleEditSection(
                                            'area', index, data.name, {
                                                img: e.target.files[0],
                                            isNew: true,
                                            }, data.videoURL, data.description)
                                        }
                                    }
                                }
                            />
                            </div>
                        </div>
                    </div>
                ))
            }

            <br />

            <div className="edit-pedia-section-heading">Food</div>
            {
                food.map((data, index) => (
                    <div key={index} className="edit-pedia-section-card">
                        {
                            data.isNew ? (
                                <FaTrash 
                                    className="edit-pedia-section-icon"
                                    onClick={() => handleDeleteSection('food', index)}
                                />
                            ) : null
                        }
                        <div>
                            <div className="edit-pedia-section-title">Title</div>
                            <input 
                                type="text"
                                value={data.name}
                                className="edit-pedia-section-name"
                                onChange={(e) => handleEditSection('food', index, e.target.value, data.imageURL, data.videoURL, data.description)}
                                placeholder="Title"
                            />
                        </div>
                        <div>
                            <div className="edit-pedia-section-title">Description</div>
                            <textarea 
                                type="text"
                                value={data.description}
                                className="edit-pedia-section-description"
                                onChange={(e) => handleEditSection('food', index, data.name, data.imageURL, data.videoURL, e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <div className="edit-pedia-section-title">Image</div>
                            {
                                data.imageURL.img ? (
                                    <Image src={data.imageURL.isNew ? URL.createObjectURL(data.imageURL.img) : data.imageURL.img} className="edit-pedia-section-image" />
                                ) : null
                            }
                            <div>
                            <input 
                                type="file"
                                accept=".png, .jpg, .jpeg, .gif"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        handleEditSection(
                                            'food', index, data.name, {
                                                img: e.target.files[0],
                                            isNew: true,
                                            }, data.videoURL, data.description)
                                        }
                                    }
                                }
                            />
                            </div>
                        </div>
                    </div>
                ))
            }

            <br /><br /><br />

            <input 
                type="file"
                id="file-btn"
                multiple
                onChange={(e) => {
                    if (e.target.files.length !== 0) {
                        const data = [];
                        for (const img of e.target.files) {
                            data.push(img);
                        }
                        addImages(data);
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
                hidden
            />

            <div className="edit-pedia-button-container" hidden={loading}>
                <label 
                    htmlFor="file-btn" 
                    className="btn btn-primary edit-pedia-save-button"
                >
                    Add Image
                </label>

                <label 
                    className="btn btn-primary edit-pedia-save-button"
                    onClick={() => handleAddSection('area')}
                >
                    Add Area
                </label>
                
                <label 
                    className="btn btn-primary edit-pedia-save-button"
                    onClick={() => handleAddSection('food')}
                >
                    Add Food
                </label>

                <label 
                    className="btn btn-primary edit-pedia-save-button"
                    onClick={handleSave}
                >
                    Save
                </label>
            </div>

        </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default EditPedia;