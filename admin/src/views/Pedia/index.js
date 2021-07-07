import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import {Image} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import pediaService from "../../services/pediaService";

const Pedia = () => {

    const [pedia, setPedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const fetchData = async () => {
        setLoading(true);

        const data = await pediaService.getManyPedias();
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
        setPedia(data.data);

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
            className="pedia-main-container"
        >
            <div className="row">
            {
                pedia.map((data, index) => (
                    <React.Fragment key={index}>
                    {
                        index % 2 === 0 ? (
                            <div className="col-md-1 col-12"></div>
                        ) : null
                    }
                    <Link
                        to={`/pedia/edit/` + data._id}
                        className="col-md-4 col-12 blog-card-main"
                        style={{
                            marginRight: 'auto',
                        }}
                    >
                        <Image
                            className="blog-card-image"
                            src={data.imageURL[0]}
                            alt="pedia img"
                        />
                        <div className="blog-card-middle">
                        <div className="blog-card-title">
                            {data.place._id.name}, {data.country._id.name}
                            </div>
                        </div>
                    </Link>
                    <div className="col-md-1 col-12"></div>
                    {
                        index % 2 === 0 ? (
                            <div className="col-md-1 col-12"></div>
                        ) : null
                    }
                    </React.Fragment>
                ))
            }
            </div>
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Pedia;