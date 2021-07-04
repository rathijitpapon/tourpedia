import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import Select from 'react-select';
import { toast } from 'react-toastify';

import BlogCard from '../../components/BlogCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from '../../services/exploreService';
import blogService from '../../services/blogService';

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

const Blog = () => {

    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [countryOption, setCountryOption] = useState("");
    const [categoryOption, setCategoryOption] = useState([]);
    const [blogs, setBlogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const handleCountrySelection = (newValue) => {
        setCountryOption(newValue);
    }

    const handleCategorySelection = (newValue) => {
        setCategoryOption(newValue);
        
    }

    const handleDeleteBlog = async (index) => {
        setLoading(true);

        const data = await blogService.deleteBlog(blogs[index]._id);
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
         
        const blogData = [...blogs];
        blogData.splice(index, 1);
        setBlogs(blogData);
        setLoading(false);
    }

    const handleRefresh = async () => {
        await fetchBlogs(categoryOption, countryOption);
    }

    const fetchBlogs = async (category, country) => {
        if (categoryOption.length === 0  || !countryOption) {
            toast.error('Please Select Category & Country', {
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
        const categoryData = [];
        for (const ctg of category) {
            categoryData.push(ctg.id);
        }
        const countryData = [country.id];

        const data = await blogService.getManyBlogs(categoryData, countryData);
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

        setBlogs(data.data);
        setLoading(false);
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
            return;
        }
        data = data.data;
        
        let formattedData = [];
        for (const cat of data) {
            formattedData.push({
                value: cat.name,
                label: cat.name,
                name: cat.name,
                description: cat.description,
                banner: cat.banner,
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
            return;
        }
        data = data.data;
        
        formattedData = [];
        for (const coun of data) {
            formattedData.push({
                value: coun.name,
                label: coun.name,
                name: coun.name,
                description: coun.description,
                banner: coun.banner,
                id: coun._id,
            });
        }
        setCountries(formattedData);

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
            active={loading}
            spinner={
                <ClipLoader color={color} loading={loading} size={50} />
            }
        >
        <div className="blog-main-container">
                <div className="row">
                    <div className="col-md-6 col-12">
                        <div className="edit-blog-section-title">Category</div>
                        <Select
                            styles={customStyles}
                            isMulti
                            className="edit-blog-select-container"
                            onChange={(newValue, actionMeta) => handleCategorySelection(newValue)}
                            options={categories}
                            value={categoryOption}
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="edit-blog-section-title">Country</div>
                        <Select
                            styles={customStyles}
                            className="edit-blog-select-container"
                            onChange={(newValue, actionMeta) => handleCountrySelection(newValue)}
                            options={countries}
                            value={countryOption}
                        />
                    </div>
                </div>
                <br />
                <button 
                    className="btn btn-primary blog-refresh-btn"
                    onClick={handleRefresh}
                >Refresh Blogs</button>

                <div className="row">
                {
                    blogs.map((blog, index) => (
                        <div className="col-lg-4 col-md-6 col-12" key={index}>
                            <BlogCard
                                blog={blog}
                                handleDelete={handleDeleteBlog}
                                index={index}
                            />
                        </div>
                    ))
                }
                </div>
            </div>
        </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Blog;