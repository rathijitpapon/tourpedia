import React, {useState, useEffect} from 'react';

import CategoryCard from '../../components/CategoryCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import categoryData from "../../assets/dummyData/category.json";

const Category = () => {

    const [categories, setCategories] = useState([]);

    const fetchData = async () => {
        const data = [];
        console.log("Pushed");

        for (let i = 0; i < categoryData.length; i++) {
            data.push(categoryData[i]);
        }
        setCategories(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="category-title">
                Tour Category List
            </div>

            <br />

            <div className="row">
                {
                    categories.map((category, index) => (
                        <div
                            key={index}
                            className="col-md-4 col-12"
                        >
                            <CategoryCard 
                                category={category}
                            />
                            <br />
                        </div>
                    ))
                }
            </div>

            <br />
            
        </LayoutWrapper>
     );
}
 
export default Category;