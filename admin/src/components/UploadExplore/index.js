import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';

import "./styles.css";

import fileService from '../../services/fileService';
import exploreService from '../../services/exploreService';

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        height: '40px',
    }),
    menu: provided => ({
        ...provided, 
        zIndex: 9999,
    })
};

const UploadReport = (props) => {

    const uploadType = props.uploadType;
    const isUpdate = props.isUpdate;
    const explore = props.explore;
    const country = props.country;
    const category = props.category;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [banner, setBanner] = useState("");
    const [previousBanner, setPreviousBanner] = useState("");

    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [countryOption, setCountryOption] = useState("");
    const [categoryOption, setCategoryOption] = useState([]);

    const [isDisabled, setIsDisabled] = useState(false);

    const fetchData = async () => {
        let formattedData = [];
        for (let coun of country) {
            formattedData.push({
                value: coun.name,
                label: coun.name,
                id: coun.id,
            });
        }
        setCountries(formattedData);
        setCountryOption(formattedData[0]);

        formattedData = [];
        for (let cat of category) {
            formattedData.push({
                value: cat.name,
                label: cat.name,
                id: cat.id
            });
        }
        setCategories(formattedData);
        setCategoryOption(formattedData[0]);

        if (isUpdate && uploadType === 'place') {
            setCountryOption({
                value: explore.country.name,
                label: explore.country.name,
                id: explore.country._id,
            });

            formattedData = [];
            for (const cat of explore.category) {
                formattedData.push({
                    value: cat.name,
                    label: cat.name,
                    id: cat._id,
                });
            }
            setCategoryOption(formattedData);

            setIsDisabled(true);
        }
    }

    const handleSubmit = async () => {
        if (!name || !description || (!isUpdate && !banner)) {
            toast.error("Please Fill All the Fields", {
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

        if (uploadType === 'place' && categoryOption.length === 0) {
            toast.error("Please Select Atleast One Category", {
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

        let url = previousBanner;

        if (banner) {
            let data = await fileService.uploadImage(banner);
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
            url = data.data.secure_url;
        }

        let data;
        if (!isUpdate && uploadType === 'place') {
            const selectedCountry = countryOption.value;
            const selectedCategory = [];
            for (const cat of categoryOption) {
                selectedCategory.push(cat.value);
            }

            data = await exploreService.uploadExplore(name, description, url, uploadType, selectedCountry, selectedCategory);
        }
        else if (isUpdate) {
            data = await exploreService.updateExplore(name, description, url, uploadType, explore.id);
        }
        else {
            data = await exploreService.uploadExplore(name, description, url, uploadType);
        }

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

        toast.success("Category Updated Successfully", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        setName("");
        setDescription("");
        props.handleOnClose();
    }

    const loadData = () => {
        if (isUpdate) {
            setName(explore.name);
            setDescription(explore.description);
            setPreviousBanner(explore.banner);
        }
    }

    useEffect(() => {
        fetchData();
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <div className="upload-explore-main">
            <div className="upload-explore-title">
                {isUpdate ? "Update" : "Upload"} {uploadType === "country" ? "Country" : ""} {uploadType === "place" ? "Place" : ""} {uploadType === "category" ? "Category" : ""}
            </div>
            <br />
            <br />

            <div className="row">
                <div className="col-lg-6 col-12">
                    {
                        uploadType === "place" ? (
                            <>
                                <div className="upload-explore-section-title">Country</div>
                                <Select
                                    isDisabled={isDisabled}
                                    styles={customStyles}
                                    className="upload-explore-select-container"
                                    onChange={(newValue, actionMeta) => setCountryOption(newValue)}
                                    options={countries}
                                    value={countryOption}
                                />

                                <div className="upload-explore-section-title">Category</div>
                                <Select
                                    isDisabled={isDisabled}
                                    styles={customStyles}
                                    isMulti
                                    className="upload-explore-select-container"
                                    onChange={(newValue, actionMeta) => setCategoryOption(newValue)}
                                    options={categories}
                                    value={categoryOption}
                                />
                            </>
                        ) : null
                    }
                    <div className="upload-explore-section-title">Name</div>
                    <input
                        className="upload-explore-title-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="upload-explore-section-title">Banner Image</div>
                    {
                        isUpdate ? (
                            <>
                                <a
                                    target="_blank" rel="noreferrer"
                                    href={previousBanner}
                                    className="upload-explore-url"
                                >Previous Banner Image</a>
                            </>
                        ) : null
                    }
                    <input
                        className="upload-explore-title-input"
                        type="file"
                        onChange={(e) => setBanner(e.target.files[0])}
                        placeholder="Banner Image"
                        accept=".png, .jpg, .jpeg"
                        style={{
                            margin: "4px 0",
                        }}
                    />
                </div>
                <div className="col-lg-6 col-12">
                    <div className="upload-explore-section-title">Description</div>
                    <textarea
                        className="upload-explore-description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <button 
                className="btn btn-primary upload-explore-submit"
                onClick={handleSubmit}
            >Submit</button>
        </div>
    );
}
 
export default UploadReport;