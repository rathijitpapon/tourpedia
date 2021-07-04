import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {AiFillDelete} from 'react-icons/ai';

import "./styles.css";

const BlogCard = (props) => {
    const blog = props.blog;
    const handleDelete = props.handleDelete;
    const index = props.index;

    return ( 
        <div
            className="blog-card-main"
        >
            <Link to={"/blog/" + blog._id}>
                <Image
                    className="blog-card-image"
                    src={blog.imageURL[0]}
                    alt="blog img"
                />
            </Link>
            <div className="blog-card-middle">
                <Link to={"/blog/" + blog._id}>
                    <div className="blog-card-title">
                        {blog.title}
                    </div>
                </Link>
                <div>
                    <Link 
                        to={"/blog/edit/" + blog._id}
                    >
                        <FaEdit
                            className="blog-card-edit-icon"
                        />
                    </Link>
                    <AiFillDelete
                        className="blog-card-edit-icon"
                        onClick={() => handleDelete(index)}
                    />
                </div>
            </div>
        </div>
     );
}
 
export default BlogCard;