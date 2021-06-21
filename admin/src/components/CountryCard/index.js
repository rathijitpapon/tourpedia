import React, {useState} from 'react';
import {Image} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {Modal, Fade, Backdrop} from '@material-ui/core';

import UploadExplore from '../../components/UploadExplore';
import "./styles.css";

const CountryCard = (props) => {
    const country = props.country;
    const handleOnClose = props.handleOnClose;

    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
        handleOnClose();
    }

    return ( 
        <div
            className="country-card-main"
        >
           <Image
                className="country-card-image"
                src={country.banner}
                alt="country img"
            />
            <div className="country-card-middle">
                <div className="category-card-header">
                    <div className="country-card-title">
                        {country.name}
                    </div>
                    <FaEdit
                        className="category-card-edit"
                        onClick={() => setOpenModal(true)}
                    />
                </div>
                <div className="country-card-description">
                    {country.description}
                </div>
            </div>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <div>
                        <UploadExplore
                            uploadType={"country"}
                            handleOnClose={handleModalClose}
                            country={""}
                            category={""}
                            isUpdate={true}
                            explore={country}
                        />
                    </div>
                </Fade>
            </Modal>
        </div>
     );
}
 
export default CountryCard;