import React, {useState, useEffect} from 'react';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {GrNext, GrPrevious} from 'react-icons/gr';
import Select from 'react-select';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';

import BlogCard from "../../components/BlogCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from '../../services/exploreService';
import blogService from "../../services/blogService";

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        height: '50px',
    }),
    menu: provided => ({ ...provided, zIndex: 9999 })
};

const Blog = () => {

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const [blogs, setBlogs] = useState([]);
    const options = [
        { value: 'Most Popular', label: 'Most Popular' },
        { value: 'Latest' , label: 'Latest'},
    ];
    const [sortOption, setSortOption] = useState(options[0]);
    const [countryOption, setCountryOption] = useState("");
    const [country, setCountry] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (val) => {
        setSearchValue(val);
    }

    const handleSortOptionChange = async (newValue, actionMeta) => {
        setSortOption(newValue);
        const dateOption = sortOption.value === 'Latest' ? -1 : 1;
        const upvoteOption = sortOption.value === 'Most Popular' ? -1 : 1;
        await getBlogs(
            [],
            (countryOption.id === "-1" ? [] : [countryOption.id]),
            dateOption,
            upvoteOption,
        );
    };

    const handleCountryOptionChange = async (newValue, actionMeta) => {
        setCountryOption(newValue);
        const dateOption = sortOption.value === 'Latest' ? -1 : 1;
        const upvoteOption = sortOption.value === 'Most Popular' ? -1 : 1;
        await getBlogs(
            [],
            (newValue.id === "-1" ? [] : [newValue.id]),
            dateOption,
            upvoteOption,
        );
    }

    const getBlogs = async (category, country, date, upvote) => {
        setLoading(true);
        const data = await blogService.getManyBlogs(category, country, date, upvote);

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
        let formattedData = [
            { value: 'All Country', label: 'All Country', id: "-1" }
        ];

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
            setLoading(false);
            return;
        }
        data = data.data;
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
        setCountry(formattedData);
        setCountryOption(formattedData[0]);

        await getBlogs([], [], 1, 1);
        setLoading(false);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
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
                className="loading-height"
            >
            <div className="blog-top-carousel" hidden={blogs.length === 0}>
            <Carousel fade prevIcon={<GrPrevious className="blog-top-icon"/>} nextIcon={<GrNext className="blog-top-icon"/>}>
                {
                    blogs.map((blog, index) => (
                        <Carousel.Item 
                            interval={5000} 
                            key={index}
                        >
                            <Link to={"/blog/" + blog._id}>
                                <Image
                                    className="blog-top-image"
                                    src={blog.imageURL[0]}
                                />
                                <div 
                                    className="blog-top-text-container"
                                >
                                    {blog.title}
                                </div>
                            </Link>
                        </Carousel.Item>
                    ))
                }
            </Carousel>
            </div>

            <br /><br />

            <div className="row blog-filter-container">
                <Select 
                    styles={customStyles}
                    className="col-lg-4 col-md-6 col-12 enter-sort-container"
                    onChange={handleSortOptionChange}
                    options={options}
                    value={sortOption}
                />
                <Select 
                    styles={customStyles}
                    className="col-lg-4 col-md-6 col-12 enter-sort-container"
                    onChange={handleCountryOptionChange}
                    options={country}
                    value={countryOption}
                />
                <div className="col-lg-4 col-md-6 col-12">
                    <input 
                        type="text"
                        placeholder="Search..."
                        className="blog-search-container"
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <br />

            <div className="row">
                {
                    blogs.map((blog, index) => (
                        <div className="col-lg-4 col-md-6 col-12" key={index}>
                            <BlogCard
                                blog={blog}
                            />
                        </div>
                    ))
                }
            </div>

            <div className="blog-no-blog">No Blogs Found</div>

            <br /><br />
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Blog;