import React, {useState, useEffect} from 'react';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {GrNext, GrPrevious} from 'react-icons/gr';
import Select from 'react-select';

import BlogCard from "../../components/BlogCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import blogData from "../../assets/dummyData/blog.json";
import countryData from "../../assets/dummyData/country.json";

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

    const handleSortOptionChange = (newValue, actionMeta) => {
        setSortOption(newValue);
    };

    const handleCountryOptionChange = (newValue, actionMeta) => {
        setCountryOption(newValue);
    }

    const fetchData = async () => {
        let data = [
            { value: 'All Country', label: 'All Country' }
        ];
        for (const value of countryData) {
            data.push({
                value: value.name,
                label: value.name
            });
        }
        setCountry(data);
        setCountryOption(data[0]);

        data = [];
        for (let i = 0; i < 10; i++) {
            data = [...data, ...blogData];
        }
        setBlogs(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="blog-top-carousel">
            <Carousel fade prevIcon={<GrPrevious className="blog-top-icon"/>} nextIcon={<GrNext className="blog-top-icon"/>}>
                {
                    blogs.map((blog, index) => (
                        <Carousel.Item 
                            interval={5000} 
                            key={index}
                        >
                            <Link to={"/blog/" + blog.title + '-' + blog.id}>
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

            <br /><br />
        </LayoutWrapper>
     );
}
 
export default Blog;