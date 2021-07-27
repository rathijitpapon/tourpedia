import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';

import CountryCard from '../../components/CountryCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from '../../services/exploreService';

const Country = () => {

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const [countries, setCountries] = useState([]);

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
            setLoading(false);
            return;
        }
        data = data.data;
        setCountries(data);
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
            <div className="country-title">
                Countries To Visit
            </div>

            <br />

            <div className="row">
                {
                    countries.map((country, index) => (
                        <div
                            key={index}
                            className="col-md-4 col-12"
                        >
                            <CountryCard 
                                country={country}
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
 
export default Country;