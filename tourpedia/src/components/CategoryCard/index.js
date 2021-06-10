import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const CategoryCard = (props) => {
    const category = props.category;

    return ( 
        <Link
            to={"/category/" + category.name}
            className="category-card-main"
        >
           <Image
                className="category-card-image"
                src={category.banner}
                alt="category img"
            />
            <div className="category-card-middle">
                <div className="category-card-title">
                    {category.name}
                </div>
                <div className="category-card-description">
                    {category.description}
                </div>
            </div>
        </Link>
     );
}
 
export default CategoryCard;