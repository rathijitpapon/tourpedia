import React, {useState} from 'react';
import {Image} from 'react-bootstrap';
import {FaEdit} from 'react-icons/fa';
import {Modal, Fade, Backdrop} from '@material-ui/core';

import UploadExplore from '../../components/UploadExplore';
import "./styles.css";

const CategoryCard = (props) => {
    const category = props.category;
    const handleOnClose = props.handleOnClose;

    const [openModal, setOpenModal] = useState(false);

    const handleModalClose = () => {
        setOpenModal(false);
        handleOnClose();
    }

    return ( 
        <div
            className="category-card-main"
        >
            <Image
                className="category-card-image"
                src={category.banner}
                alt="category img"
            />
            <div className="category-card-middle">
                <div className="category-card-header">
                    <div className="category-card-title">
                        {category.name}
                    </div>
                    <FaEdit
                        className="category-card-edit"
                        onClick={() => setOpenModal(true)}
                    />
                </div>
                <div className="category-card-description">
                    {category.description}
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
                            uploadType={"category"}
                            handleOnClose={handleModalClose}
                            country={""}
                            category={""}
                            isUpdate={true}
                            explore={category}
                        />
                    </div>
                </Fade>
            </Modal>
        </div>
     );
}
 
export default CategoryCard;