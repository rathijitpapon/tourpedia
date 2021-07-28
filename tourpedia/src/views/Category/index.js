import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';

import CategoryCard from '../../components/CategoryCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from '../../services/exploreService';

const Category = () => {

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const [categories, setCategories] = useState([]);

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
        setCategories(data);
        setLoading(false);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
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
            <div className="category-title">
                Tour Category List
            </div>

            <br />

            <div className="row">
                {
                    categories.map((category, index) => (
                        <div
                            key={index}
                            className="col-md-4 col-12 all-small-card-height"
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
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Category;