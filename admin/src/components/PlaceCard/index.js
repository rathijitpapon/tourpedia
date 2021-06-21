import React, {useState} from 'react';
import {Image} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {Modal, Fade, Backdrop} from '@material-ui/core';

import UploadExplore from '../../components/UploadExplore';
import "./styles.css";

const PlaceCard = (props) => {
    const place = props.place;
    const country = props.country;
    const category = props.category;
    const handleOnClose = props.handleOnClose;

    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
        handleOnClose();
    }

    return ( 
        <div
            className="place-card-main"
        >
            <Image
                className="place-card-image"
                src={place.banner}
                alt="place img"
            />
            <div className="place-card-middle">
                <div className="category-card-header">
                    <div className="place-card-title">
                        {place.name}
                    </div>
                    <FaEdit
                        className="category-card-edit"
                        onClick={() => setOpenModal(true)}
                    />
                </div>
                <div className="place-card-description">
                    {place.description}
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
                            uploadType={"place"}
                            handleOnClose={handleModalClose}
                            country={country}
                            category={category}
                            isUpdate={true}
                            explore={place}
                        />
                    </div>
                </Fade>
            </Modal>
        </div>
     );
}
 
export default PlaceCard;