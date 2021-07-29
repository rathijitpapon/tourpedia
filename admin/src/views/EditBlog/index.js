import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {Image} from 'react-bootstrap';
import JoditEditor from "jodit-react";
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from '../../services/exploreService';
import blogService from '../../services/blogService';
import fileService from '../../services/fileService';

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


const EditBlog = (props) => {
    const blogId = props.match.params.blogId;
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);

    const [placeDetails, setPlaceDetails] = useState([]);
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [places, setPlaces] = useState([]);

    const [countryOption, setCountryOption] = useState("");
    const [categoryOption, setCategoryOption] = useState([]);
    const [placeOption, setPlaceOption] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const editor = useRef(null);
	const [content, setContent] = useState('');

    const changeContent = (newContent) => {
        setContent(newContent);
    }

    const config = {
		readonly: false,
	};

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

    const handleSaveBlog = async () => {
        if (!title || !content || images.length === 0 || categoryOption.length === 0 || placeOption.length === 0 || !countryOption) {
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

        setLoading(true);
        
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
                    setLoading(false);
                    return;
                }
                imageData.push(data.data.secure_url);
            }
            else {
                imageData.push(file.img);
            }
        }

        if (blogId.toLowerCase() !== 'new') {
            const data = await blogService.editBlog(title, content, imageData, '', blogId);
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
                return;
            }
            history.push('/blog');

            return;
        }

        const placeData = [];
        const categoryData = [];

        for (const plc of placeOption) {
            placeData.push(plc.id);
        }
        for (const ctg of categoryOption) {
            categoryData.push(ctg.id);
        }
        const data = await blogService.createBlog(title, content, imageData, "", countryOption.id, placeData, categoryData);
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
            return;
        }
        setLoading(false);
        history.push('/blog');
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
            setLoading(false);
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

        data = await exploreService.getAllExplore("country");
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
            return;
        }
        data = data.data;
        
        formattedData = [];
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

        if (blogId && blogId.toLowerCase() === 'new') {
            setContent("");
            setCountryOption("");
            setCategoryOption([]);
            setPlaceOption([]);
            setTitle("");
            setImages([]);
            setIsDisabled(false);
        }
        else {
            setIsDisabled(true);
            data = await blogService.getBlogById(blogId);
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
                history.push("/blog");
                return;
            }

            setTitle(data.data.title);
            setContent(data.data.description);
            const imageData = [];
            for (const img of data.data.imageURL) {
                imageData.push({
                    img: img,
                    isURL: true,
                })
            }
            setImages(imageData);

            const categoryData = [];
            const countryData = {
                value: data.data.country._id.name,
                label: data.data.country._id.name,
                name: data.data.country._id.name,
                id: data.data.country._id._id,
            };
            const placeData = [];

            for (const ctg of data.data.category) {
                categoryData.push({
                    value: ctg._id.name,
                    label: ctg._id.name,
                    name: ctg._id.name,
                    id: ctg._id._id,
                })
            }

            for (const plc of data.data.place) {
                placeData.push({
                    value: plc._id.name,
                    label: plc._id.name,
                    name: plc._id.name,
                    id: plc._id._id,
                });
            }

            setCategoryOption(categoryData);
            setCountryOption(countryData);
            setPlaceOption(placeData);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId]);

    return ( 
        <LayoutWrapper>
        <LoadingOverlay
            active={loading}
            spinner={
                <ClipLoader color={color} loading={loading} size={50} />
            }
        >
            <div className="edit-blog-main-container">
                <div className="row">
                    <div className="col-md-6 col-12">
                        <div className="edit-blog-section-title">Blog Title</div>
                        <input
                            className="edit-blog-title-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Blog Title"
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="edit-blog-section-title">Category</div>
                        <Select
                            isDisabled={isDisabled}
                            styles={customStyles}
                            isMulti
                            className="edit-blog-select-container"
                            onChange={(newValue, actionMeta) => setCategoryOption(newValue)}
                            options={categories}
                            value={categoryOption}
                        />
                    </div>
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
                            isMulti
                            className="edit-blog-select-container"
                            onChange={(newValue, actionMeta) => setPlaceOption(newValue)}
                            options={places}
                            value={placeOption}
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
                    placeholder="img file"
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
                <label for="file-btn" className="btn btn-primary edit-blog-save-button">
                    Add Image
                </label>

                <br />
                <div className="edit-blog-section-title">Blog Content</div>

                <JoditEditor
                    className="edit-blog-editor-container"
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={newContent => changeContent(newContent)}
                />

                <button 
                    className="btn btn-primary edit-blog-save-button"
                    onClick={handleSaveBlog}
                >Save Blog</button>
            </div>
        </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default EditBlog;