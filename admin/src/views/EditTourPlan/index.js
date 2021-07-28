import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import {Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { Steps } from 'rsuite';
import DatePicker from "react-datepicker";
import Collapsible from 'react-collapsible';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import { FaTrash } from 'react-icons/fa';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import 'rc-slider/assets/index.css';
import "./styles.css";

import exploreService from '../../services/exploreService';
import tourPlanService from '../../services/tourplanService';
import fileService from '../../services/fileService';

import fixedFilters from "../../assets/fixedFilters.json";

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        minHeight: '45px',
    }),
    menu: provided => ({
        ...provided, 
        zIndex: 9999,
    })
};


const EditTourPlan = (props) => {
    const tourPlanId = props.match.params.tourPlanId;
    const history = useHistory();

    const [curStep, setCurStep] = useState(0);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [banner, setBanner] = useState({
        img: '',
        isURL: true,
    });
    const [images, setImages] = useState([]);

    const [placeDetails, setPlaceDetails] = useState([]);
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [places, setPlaces] = useState([]);
    const [groupOption, setGroupOption] = useState([]);
    const [accomodation, setAccomodation] = useState([]);

    const quality = [];
    const roomSize = [];

    for (let i = 2; i <= 6; i++) {
        quality.push({
            value: i,
            label: i,
        });
    }
    for (let i = 1; i <= 20; i++) {
        roomSize.push({
            value: i,
            label: i,
        });
    }

    const [countryOption, setCountryOption] = useState("");
    const [categoryOption, setCategoryOption] = useState([]);
    const [placeOption, setPlaceOption] = useState([]);
    const [groupOptionOption, setGroupOptionOption] = useState("");
    const [accomodationOption, setAccomodationOption] = useState([]);
    
    const [participant, setParticipant] = useState(0);
    const [duration, setDuration] = useState(1);
    const [cost, setCost] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [videoURL, setVideoURL] = useState("");

    const [areas, setArea] = useState([]);
    const [activities, setActivities] = useState([]);
    const [dayPlan, setDayPlan] = useState([]);

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const handleCountrySelection = async (newValue) => {
        setCountryOption(newValue);

        let formattedData = [];
        for (const coun of placeDetails) {
            if (coun.name === newValue.name) {
                for (const plc of coun.place) {
                    formattedData.push({
                        value: plc._id.name,
                        label: plc._id.name,
                        name: plc._id.name,
                        id: plc._id._id,
                        area: plc._id.pedia._id.area,
                    });
                }
            }
        }

        setPlaces(formattedData);
        setPlaceOption([]);
    }

    const handleSaveTourPlan = async () => {
        const dayPlanData = [];
        for (const day of dayPlan) {
            if (!day.description || !day.images.length) {
                toast.error("Please fill all the required fields.", {
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
            if (!day.timePlan.length) {
                toast.error("Please Add Atleast One Time Plan.", {
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
            const data = {
                description: day.description,
                accomodation: day.accomodation,
                accomodationCost: day.accomodationCost ? day.accomodationCost : 0,
                accomodationQuality: day.accomodationQuality,
                roomSize: day.roomSize,
                transport: day.transport,
                transportCost: day.transportCost ? day.transportCost : 0,
                otherCost: day.otherCost ? day.otherCost : 0,
                images: day.images,
                timePlan: [],
            };

            for (const time of day.timePlan) {
                if (!time.startTime || !time.endTime || !time.area.length || !time.activity.length) {
                    toast.error("Please fill all the required fields.", {
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
                
                data.timePlan.push({
                    startTime: time.startTime,
                    endTime: time.endTime,
                    area: time.area,
                    activity: time.activity,
                    cost: time.cost ? time.cost : 0,
                });
            }
            dayPlanData.push(data);
        }

        setLoading(true);
        
        const imageData = [];
        for (const file of images) {
            if (!file.isURL) {
                const data = await fileService.uploadImage(file.img);
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
                imageData.push(data.data.secure_url);
            }
            else {
                imageData.push(file.img);
            }
        }

        let bannerImage = banner.img;
        if (!banner.isURL) {
            const data = await fileService.uploadImage(banner.img);
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
            bannerImage = data.data.secure_url;
        }

        const tourPlan = {};
        tourPlan.name = name;
        tourPlan.description = description;
        tourPlan.banner = bannerImage;
        tourPlan.imageURL = imageData;
        tourPlan.videoURL = videoURL;
        tourPlan.groupOption = groupOptionOption.value;
        tourPlan.duration = duration;
        tourPlan.minimuParticipantLimit = participant;
        tourPlan.accomodationOption = [];
        for (const acc of accomodationOption) {
            tourPlan.accomodationOption.push(acc.value);
        }
        tourPlan.category = [];
        for (const cat of categoryOption) {
            tourPlan.category.push(cat.id);
        }
        tourPlan.totalCost = cost;
        tourPlan.country = countryOption.id;
        tourPlan.place = [];
        for (const plc of placeOption) {
            tourPlan.place.push(plc.id);
        }
        tourPlan.planFileURL = "";
        tourPlan.agreementFileURL = "";

        tourPlan.dayPlan = [];
        let dateId = 0;
        for (const day of dayPlanData) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + dateId);
            const imageData = [];
            for (const file of day.images) {
                if (!file.isURL) {
                    const data = await fileService.uploadImage(file.img);
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
                    imageData.push(data.data.secure_url);
                }
                else {
                    imageData.push(file.img);
                }
            }

            const timePlanData = [];
            for (const time of day.timePlan) {
                const startTime = new Date(time.startTime);
                const endTime = new Date(time.endTime);
                startTime.setDate(date.getDate());
                startTime.setMonth(date.getMonth());
                startTime.setFullYear(date.getFullYear());

                endTime.setDate(date.getDate());
                endTime.setMonth(date.getMonth());
                endTime.setFullYear(date.getFullYear());

                const activity = [];
                for (const item of time.activity) {
                    activity.push(item.value);
                }
                const area = [];
                for (const item of time.area) {
                    area.push(item.id);
                }

                timePlanData.push({
                    startTime,
                    endTime,
                    area,
                    activity,
                    cost: time.cost ? time.cost : 0,
                });
            }

            tourPlan.dayPlan.push({
                date: date,
                description: day.description,
                accomodation: day.accomodation,
                accomodationCost: day.accomodationCost,
                accomodationQuality: day.accomodationQuality,
                roomSize: day.roomSize,
                transport: day.transport,
                transportCost: day.transportCost,
                otherCost: day.otherCost,
                imageURL: imageData,
                timePlan: timePlanData,
            });
            dateId++;
        }

        if (tourPlanId.toLowerCase() !== 'new') {
            const data = await tourPlanService.editTourPlan(tourPlan, tourPlanId);
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
            setLoading(false);
            history.push('/plan');

            return;
        }

        const data = await tourPlanService.createTourPlan(tourPlan);
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
        setLoading(false);
        history.push('/plan');
    }

    const addImages = (files) => {
        const curImages = [...images];
        for (const file of files) {
            curImages.push({
                img: file,
                isURL: false,
            });
        }
        setImages(curImages);
    }

    const removeImage = (index) => {
        const curImages = [...images];
        curImages.splice(index, 1);
        setImages(curImages);
    }

    const handleNextPage = () => {
        if (curStep === 0) {
            if (!name) {
                toast.error('Please Fillup Tour Plan Name', {
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
            if (categoryOption.length === 0) {
                toast.error('Please Select At Least One Category', {
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
            if (!countryOption) {
                toast.error('Please Select A Country', {
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
            if (placeOption.length === 0) {
                toast.error('Please Select At Least One Place', {
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
        }
        else if (curStep === 1) {
            if (!groupOption) {
                toast.error('Please Select A Tour Style', {
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
            if (accomodationOption.length === 0) {
                toast.error('Please Select At Least One Accomodation Option', {
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
            if (!participant || participant <= 0) {
                toast.error('Please Enter Valid Participant Limit', {
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
            if (!cost || cost <= 0) {
                toast.error('Please Enter Valid Cost', {
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
        }
        if (curStep === 2) {
            if (!description) {
                toast.error('Please Fillup Tour Plan Description', {
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
            if (!videoURL) {
                toast.error('Please Enter Valid Video URL', {
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
            if (!startDate) {
                toast.error('Please Enter Valid Start Date', {
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
            if (!duration || duration <= 0) {
                toast.error('Please Enter Valid Duration', {
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
            if (!banner.img) {
                toast.error('Please Fillup Tour Plan Banner', {
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
            if (images.length === 0) {
                toast.error('Please Add At Least One Image', {
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
            
            let plan = [];
            let extra = 0;
            if (duration > dayPlan.length) {
                plan = [...dayPlan];
                extra = duration - dayPlan.length;
            }
            else {
                plan = dayPlan.slice(0, duration);
            }

            for (let i = 0; i < extra; i++) {
                plan.push({
                    isOpen: true,
                    description: "",
                    images: [],
                    accomodation: "",
                    accomodationQuality: 2,
                    roomSize: 1,
                    accomodationCost: 0,
                    transport: "",
                    transportCost: 0,
                    otherCost: 0,
                    timePlan: [],
                });
            }
            setDayPlan(plan);

            const areaData = [];
            for (const plc of placeOption) {
                for (const p of places) {
                    if (plc.id === p.id) {
                        for (const ar of p.area) {
                            areaData.push({
                                id: ar._id._id,
                                name: ar._id.name,
                                value: ar._id.name + " - " + p.name,
                                label: ar._id.name + " - " + p.name,
                            });
                        }
                    }
                }
            }
            setArea(areaData);
        }

        setCurStep(curStep + 1);
    }

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
            return;
        }
        data = data.data;
        
        let formattedData = [];
        for (const cat of data) {
            formattedData.push({
                value: cat.name,
                label: cat.name,
                name: cat.name,
                id: cat._id,
            });
        }
        setCategories(formattedData);

        data = await exploreService.getAllExplore("country");
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
        data = data.data;
        
        formattedData = [];
        for (const coun of data) {
            formattedData.push({
                value: coun.name,
                label: coun.name,
                name: coun.name,
                id: coun._id,
            });
        }
        setCountries(formattedData);
        setPlaceDetails(data);
        const placeDetailsData = data;

        data = [];
        for (const item of fixedFilters.groupOption) {
            data.push({
                value: item,
                label: item,
            });
        }
        setGroupOption(data);

        data = [];
        for (const item of fixedFilters.accomodationOption) {
            data.push({
                value: item,
                label: item,
            });
        }
        setAccomodation(data);

        data = [];
        for (const item of fixedFilters.activity) {
            data.push({
                value: item,
                label: item,
            });
        }
        setActivities(data);

        if (tourPlanId && tourPlanId.toLowerCase() === 'new') {
            setCurStep(0);
            setName("");
            setDescription("");
            setBanner({
                img: "",
                isURL: true,
            });
            setImages([]);
            setVideoURL("");

            setCountryOption([]);
            setCategoryOption([]);
            setPlaceOption([]);
            setGroupOptionOption("");
            setAccomodationOption([]);

            setParticipant(0);
            setDuration(1);
            setCost(0);
            setStartDate(new Date());
            setDayPlan([]);
        }
        else {
            data = await tourPlanService.getTourPlanById(tourPlanId);
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
                history.push("/plan");
                return;
            }

            setName(data.data.name);
            setDescription(data.data.description);
            const imageData = [];
            for (const img of data.data.imageURL) {
                imageData.push({
                    img: img,
                    isURL: true,
                })
            }
            setImages(imageData);
            setBanner({
                img: data.data.banner,
                isURL: true,
            });
            setVideoURL(data.data.videoURL);

            const categoryData = [];
            const countryData = {
                value: data.data.country._id.name,
                label: data.data.country._id.name,
                name: data.data.country._id.name,
                id: data.data.country._id._id,
            };
            const placeData = [];

            for (const ctg of data.data.category) {
                categoryData.push({
                    value: ctg._id.name,
                    label: ctg._id.name,
                    name: ctg._id.name,
                    id: ctg._id._id,
                })
            }

            const allPlaceData = [];
            const ids = [];
            for (const temp of data.data.place) {
                const plc = temp._id;
                for (const coun of placeDetailsData) {
                    if (coun._id === plc.country._id) {
                        for (const plcData of coun.place) {
                            if (plc._id === plcData._id._id) {
                                placeData.push({
                                    value: plcData._id.name,
                                    label: plcData._id.name,
                                    name: plcData._id.name,
                                    id: plcData._id._id,
                                    area: plcData._id.pedia._id.area,
                                });
                            }
                            if (!ids.includes(plcData._id._id)) {
                                allPlaceData.push({
                                    value: plcData._id.name,
                                    label: plcData._id.name,
                                    name: plcData._id.name,
                                    id: plcData._id._id,
                                    area: plcData._id.pedia._id.area,
                                });
                                ids.push(plcData._id._id);
                            }
                        }
                    }
                }
            }

            setCategoryOption(categoryData);
            setCountryOption(countryData);
            setPlaces(allPlaceData);
            setPlaceOption(placeData);

            setGroupOptionOption({
                value: data.data.groupOption,
                label: data.data.groupOption,
            });

            const accomodationData = [];
            for (const acc of data.data.accomodationOption) {
                accomodationData.push({
                    value: acc,
                    label: acc,
                });
            }
            setAccomodationOption(accomodationData);

            setParticipant(data.data.minimuParticipantLimit);
            setCost(data.data.totalCost);
            setStartDate(new Date(data.data.dayPlan[0]._id.date));
            setDuration(data.data.duration);

            const dayPlanData = [];
            for (const day of data.data.dayPlan) {
                const dayData = {
                    isOpen: true,
                    description: day._id.description,
                    images: [],
                    accomodation: day._id.accomodation,
                    accomodationQuality: day._id.accomodationQuality,
                    roomSize: day._id.roomSize,
                    accomodationCost: day._id.accomodationCost,
                    transport: day._id.transport,
                    transportCost: day._id.transportCost,
                    otherCost: day._id.otherCost,
                    timePlan: [],
                };

                for (const img of day._id.imageURL) {
                    dayData.images.push({
                        img: img,
                        isURL: true,
                    });
                }

                for (const time of day._id.timePlan) {
                    const timeData = {
                        startTime: new Date(time._id.startTime),
                        endTime: new Date(time._id.endTime),
                        cost: time._id.cost,
                        activity: [],
                        area: [],
                    }

                    for (const act of time._id.activity) {
                        timeData.activity.push({
                            value: act,
                            label: act,
                        });
                    }

                    for (const ar of time._id.area) {
                        let pName = "";
                        for (const pd of placeData) {
                            for (const ad of pd.area) {
                                if (ar._id._id === ad._id._id) {
                                    pName = pd.name;
                                }
                            }
                        }
                        timeData.area.push({
                            id: ar._id._id,
                            name: ar._id.name,
                            value: ar._id.name + " - " + pName,
                            label: ar._id.name + " - " + pName,
                        });
                    }

                    dayData.timePlan.push(timeData);
                }
                dayPlanData.push(dayData);
            }
            setDayPlan(dayPlanData);
            setCurStep(0);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tourPlanId]);

    return ( 
        <LayoutWrapper>
        <LoadingOverlay
            active={loading}
            spinner={
                <ClipLoader color={color} loading={loading} size={50} />
            }
        >
            <div className="edit-tourPlan-main-container">
                <Steps current={curStep}>
                    <Steps.Item title="Tour Information" />
                    <Steps.Item title="Tour Options" />
                    <Steps.Item title="Tour Details" />
                    <Steps.Item title="Day Planning" />
                </Steps>

                <br /><br />

                <div hidden={curStep !== 0}>
                    <div className="row">
                        <br />
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Tour Plan Name</div>
                            <input
                                className="edit-tourPlan-name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tour Plan Name"
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Category</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-tourPlan-select-container"
                                onChange={(newValue, actionMeta) => setCategoryOption(newValue)}
                                options={categories}
                                value={categoryOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Country</div>
                            <Select
                                styles={customStyles}
                                className="edit-tourPlan-select-container"
                                onChange={(newValue, actionMeta) => handleCountrySelection(newValue)}
                                options={countries}
                                value={countryOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Place</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-tourPlan-select-container"
                                onChange={(newValue, actionMeta) => setPlaceOption(newValue)}
                                options={places}
                                value={placeOption}
                            />
                        </div>
                    </div>
                </div>
                
                <div hidden={curStep !== 1}>
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Tour Style</div>
                            <Select
                                styles={customStyles}
                                className="edit-tourPlan-select-container"
                                onChange={(newValue, actionMeta) => setGroupOptionOption(newValue)}
                                options={groupOption}
                                value={groupOptionOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Accomodation Options</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-tourPlan-select-container"
                                onChange={(newValue, actionMeta) => setAccomodationOption(newValue)}
                                options={accomodation}
                                value={accomodationOption}
                            />
                        </div>
                    </div>

                    <br />

                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Participants Limit</div>
                            <input
                                className="edit-tourPlan-name-input"
                                type="number"
                                value={participant}
                                onChange={(e) => setParticipant(+e.target.value)}
                                placeholder="Participant Limit"
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-tourPlan-section-name">Enrollment Cost</div>
                            <input
                                className="edit-tourPlan-name-input"
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(+e.target.value)}
                                placeholder="Enrollment Cost"
                            />
                        </div>
                    </div>
                </div>
                
                <div hidden={curStep !== 2}>
                    <div className="edit-tourPlan-section-name">Tour Plan Description</div>
                    <textarea
                        type="text"
                        className="edit-tourPlan-description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tour Plan Description"
                    />

                    <br />

                    <div className="row">
                        <div className="col-md-4 col-12">
                            <div className="edit-tourPlan-section-name">Youtube Video URL</div>
                            <input
                                className="edit-tourPlan-name-input"
                                type="text"
                                value={videoURL}
                                onChange={(e) => setVideoURL(e.target.value)}
                                placeholder="Youtube Video URL"
                            />
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="edit-tourPlan-section-name">Start Date</div>
                            <DatePicker
                                className="edit-tourPlan-name-input"
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                dateFormat="dd MMMM, yyyy"
                                placeholderText={'Start Date'}
                            />
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="edit-tourPlan-section-name">Duration</div>
                            <input
                                className="edit-tourPlan-name-input"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(+e.target.value)}
                                placeholder="Duration"
                            />
                        </div>
                    </div>

                    <div hidden={!banner.img}>
                    <div
                        className="edit-tourPlan-section-name"
                    >Tour Plan Banner</div>
                    <div className="col-lg-6 col-12 edit-tourPlan-img">
                        <span 
                            className="close"
                            onClick={() => {
                                setBanner({
                                    img: '',
                                    isURL: true,
                                });
                            }}
                        >&times;</span>
                        <Image
                            className="edit-tourPlan-img-container"
                            src={banner.isURL ? banner.img : URL.createObjectURL(banner.img)}
                            alt="tour plan img"
                        />
                    </div>
                    <br />
                    </div>

                    <div
                        className="edit-tourPlan-section-name"
                        hidden={images.length === 0}
                    >Tour Plan Images</div>
                    <div className="row">
                        {
                            images.map((image, index) => (
                                <div key={index} className="col-lg-6 col-12 edit-tourPlan-img">
                                    <span 
                                        className="close"
                                        onClick={() => removeImage(index)}
                                    >&times;</span>
                                    <Image
                                        className="edit-tourPlan-img-container" 
                                        src={image.isURL ? image.img : URL.createObjectURL(image.img)}
                                        alt="tour plan img"
                                    />
                                </div>
                            ))
                        }
                    </div>

                    <div className="row">
                        <input 
                            type="file"
                            id="banner-btn"
                            onChange={(e) => {
                                if (e.target.files.length !== 0) {
                                    setBanner({
                                        img: e.target.files[0],
                                        isURL: false,
                                    })
                                }
                            }}
                            placeholder="Image"
                            accept=".png, .jpg, .jpeg, .gif"
                            style={{
                                textAlign: 'center',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                margin: "20px auto",
                            }}
                            hidden
                        />
                        <label htmlFor="banner-btn" className="btn btn-primary edit-tourPlan-save-button">
                            Add Banner Image
                        </label>

                        <input 
                            type="file"
                            id="file-btn"
                            multiple
                            onChange={(e) => {
                                if (e.target.files.length !== 0) {
                                    const data = [];
                                    for (const img of e.target.files) {
                                        data.push(img);
                                    }
                                    addImages(data);
                                }
                            }}
                            placeholder="Image"
                            accept=".png, .jpg, .jpeg, .gif"
                            style={{
                                textAlign: 'center',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                margin: "20px auto",
                            }}
                            hidden
                        />
                        <label htmlFor="file-btn" className="btn btn-primary edit-tourPlan-save-button">
                            Add Tour Plan Images
                        </label>
                    </div>
                </div>
                
                <div hidden={curStep !== 3}>
                    {
                        dayPlan.map((day, index) => (
                            <Collapsible 
                                key={index}
                                open={day.isOpen}
                                handleTriggerClick={() => {
                                    const data = [...dayPlan];
                                    data[index].isOpen = !dayPlan[index].isOpen;
                                    setDayPlan(data);
                                }}
                                trigger={
                                    <div className="edit-tourPlan-day-plan-header">
                                        <b>Day {index + 1}</b> &nbsp; &nbsp;
                                        <IoIosArrowDown       
                                            className="edit-tourPlan-day-plan-header-icon" 
                                        />
                                    </div>
                                }
                                triggerWhenOpen={
                                    <div className="edit-tourPlan-day-plan-header">
                                        <b>Day {index + 1}</b> &nbsp; &nbsp;
                                        <IoIosArrowUp           
                                            className="edit-tourPlan-day-plan-header-icon" 
                                        />
                                    </div>
                                }
                            >
                            <div className="edit-tourPlan-section-name">Description</div>
                            <textarea
                                type="text"
                                className="edit-tourPlan-description-input"
                                value={day.description}
                                onChange={(e) => {
                                    const data = [...dayPlan];
                                    data[index].description = e.target.value;
                                    setDayPlan(data);
                                }}
                                placeholder="Description"
                            />

                            <div className="row">
                                <br />
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Accomodation</div>
                                    <input
                                        className="edit-tourPlan-name-input"
                                        type="text"
                                        value={day.accomodation}
                                        onChange={(e) => {
                                            const data = [...dayPlan];
                                            data[index].accomodation = e.target.value;
                                            setDayPlan(data);
                                        }}
                                        placeholder="Accomodation"
                                    />
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Accomodation Cost</div>
                                    <input
                                        className="edit-tourPlan-name-input"
                                        type="number"
                                        value={day.accomodationCost}
                                        onChange={(e) => {
                                            const data = [...dayPlan];
                                            data[index].accomodationCost = +e.target.value;
                                            setDayPlan(data);
                                        }}
                                        placeholder="Accomodation Cost"
                                    />
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Accomodation Quality</div>
                                    <Select
                                        styles={customStyles}
                                        className="edit-tourPlan-select-container"
                                        onChange={(newValue, actionMeta) => {
                                            const data = [...dayPlan];
                                            data[index].accomodationQuality = +newValue.value;
                                            setDayPlan(data);
                                        }}
                                        options={quality}
                                        value={{
                                            value: day.accomodationQuality,
                                            label: day.accomodationQuality,
                                        }}
                                    />
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Room Size</div>
                                    <Select
                                        styles={customStyles}
                                        className="edit-tourPlan-select-container"
                                        onChange={(newValue, actionMeta) => {
                                            const data = [...dayPlan];
                                            data[index].roomSize = +newValue.value;
                                            setDayPlan(data);
                                        }}
                                        options={roomSize}
                                        value={{
                                            value: day.roomSize,
                                            label: day.roomSize,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Transport</div>
                                    <input
                                        className="edit-tourPlan-name-input"
                                        type="text"
                                        value={day.transport}
                                        onChange={(e) => {
                                            const data = [...dayPlan];
                                            data[index].transport = e.target.value;
                                            setDayPlan(data);
                                        }}
                                        placeholder="Transport"
                                    />
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Transport Cost</div>
                                    <input
                                        className="edit-tourPlan-name-input"
                                        type="number"
                                        value={day.transportCost}
                                        onChange={(e) => {
                                            const data = [...dayPlan];
                                            data[index].transportCost = +e.target.value;
                                            setDayPlan(data);
                                        }}
                                        placeholder="Transport Cost"
                                    />
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="edit-tourPlan-section-name">Other Cost</div>
                                    <input
                                        className="edit-tourPlan-name-input"
                                        type="number"
                                        value={day.otherCost}
                                        onChange={(e) => {
                                            const data = [...dayPlan];
                                            data[index].otherCost = +e.target.value;
                                            setDayPlan(data);
                                        }}
                                        placeholder="Other Cost"
                                    />
                                </div>
                            </div>

                            <div
                                className="edit-tourPlan-section-name"
                                hidden={day.images.length === 0}
                            >Images</div>
                            <div className="row">
                                {
                                    day.images.map((image, imageIndex) => (
                                        <div key={imageIndex} className="col-lg-6 col-12 edit-tourPlan-img">
                                            <span 
                                                className="close"
                                                onClick={() => {
                                                    const data = [...dayPlan];
                                                    data[index].images.splice(imageIndex, 1);
                                                    setDayPlan(data);
                                                }}
                                            >&times;</span>
                                            <Image
                                                className="edit-tourPlan-img-container" 
                                                src={image.isURL ? image.img : URL.createObjectURL(image.img)}
                                                alt="tour plan img"
                                            />
                                        </div>
                                    ))
                                }
                            </div>

                            <input 
                                type="file"
                                id={"day-file-btn" + index}
                                multiple
                                onChange={(e) => {
                                    if (e.target.files.length !== 0) {
                                        const data = [...dayPlan];
                                        for (const img of e.target.files) {
                                            data[index].images.push({
                                                img,
                                                isURL: false,
                                            });
                                        }
                                        setDayPlan(data);
                                    }
                                }}
                                placeholder="Image"
                                accept=".png, .jpg, .jpeg, .gif"
                                style={{
                                    textAlign: 'center',
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    margin: "20px auto",
                                }}
                                hidden
                            />
                            <label htmlFor={"day-file-btn" + index} className="btn btn-primary edit-tourPlan-save-button">
                                Add Images
                            </label>

                            <br />

                            {
                                day.timePlan.map((time, timeIndex) => (
                                    <div 
                                        key={timeIndex} 
                                        className="edit-tourPlan-time-plan-card"
                                    >
                                        <div className="row">
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-4 col-12">
                                                <div className="edit-tourPlan-section-name">Start Time</div>
                                                <DatePicker
                                                    className="edit-tourPlan-name-input"
                                                    selected={day.timePlan[timeIndex].startTime}
                                                    showTimeInput
                                                    showTimeSelectOnly
                                                    onChange={date => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan[timeIndex].startTime = date;
                                                        setDayPlan(data);
                                                    }}
                                                    dateFormat="h:mm aa"
                                                    placeholderText={'Start Time'}
                                                />
                                            </div>
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-5 col-12">
                                                <div className="edit-tourPlan-section-name">Areas To Visit</div>
                                                <Select
                                                    styles={customStyles}
                                                    isMulti
                                                    className="edit-tourPlan-select-container"
                                                    onChange={(newValue, actionMeta) => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan[timeIndex].area = newValue;
                                                        setDayPlan(data);
                                                    }}
                                                    options={areas}
                                                    value={day.timePlan[timeIndex].area}
                                                />
                                            </div>
                                            <div className="col-md-1 col-12">
                                                <FaTrash 
                                                    className="edit-tourPlan-time-plan-delete"
                                                    onClick={() => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan.splice(timeIndex, 1);
                                                        setDayPlan(data);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-4 col-12">
                                                <div className="edit-tourPlan-section-name">End Time</div>
                                                <DatePicker
                                                    className="edit-tourPlan-name-input"
                                                    selected={day.timePlan[timeIndex].endTime}
                                                    showTimeInput
                                                    showTimeSelectOnly
                                                    onChange={date => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan[timeIndex].endTime = date;
                                                        setDayPlan(data);
                                                    }}
                                                    dateFormat="h:mm aa"
                                                    placeholderText={'End Time'}
                                                />
                                            </div>
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-5 col-12">
                                                <div className="edit-tourPlan-section-name">Activities</div>
                                                <CreatableSelect
                                                    styles={customStyles}
                                                    isMulti
                                                    className="edit-tourPlan-select-container"
                                                    onChange={(newValue, actionMeta) => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan[timeIndex].activity = newValue;
                                                        setDayPlan(data);
                                                    }}
                                                    options={activities}
                                                    value={day.timePlan[timeIndex].activity}
                                                />
                                            </div>
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-4 col-12">
                                                <div className="edit-tourPlan-section-name">Cost</div>
                                                <input
                                                    className="edit-tourPlan-name-input"
                                                    type="number"
                                                    value={day.timePlan[timeIndex].cost}
                                                    onChange={(e) => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan[timeIndex].cost = +e.target.value;
                                                        setDayPlan(data);
                                                    }}
                                                    placeholder="Cost"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            <button 
                                className="btn btn-primary edit-tourPlan-save-button"
                                onClick={() => {
                                    let curTime = new Date();
                                    curTime.setHours(5, 0, 0, 0);
                                    let endTime = new Date();
                                    endTime.setHours(5, 30, 0, 0);

                                    if (day.timePlan.length > 0) {
                                        curTime = new Date(day.timePlan[day.timePlan.length - 1].endTime);
                                        endTime = new Date(day.timePlan[day.timePlan.length - 1].endTime);
                                        endTime.setMinutes(endTime.getMinutes() + 30);
                                    }

                                    const data = [...dayPlan];
                                    data[index].timePlan.push({
                                        startTime: curTime,
                                        endTime: endTime,
                                        cost: 0,
                                        activity: [],
                                        area: [],
                                    });
                                    setDayPlan(data);
                                }}
                            >
                                Add Time Plan
                            </button>
                            
                            <br />
                        </Collapsible>
                    ))}
                </div>

                <br />

                <div 
                    className="edit-tourPlan-step-button-group"
                    style={{
                        justifyContent: curStep === 0 ? 'flex-end' : 'space-between',
                    }}
                >
                    <button 
                        className="btn btn-secondary edit-tourPlan-step-button"
                        onClick={() => {
                            setCurStep(curStep - 1);
                        }}
                        hidden={curStep === 0}
                    >Previous</button>
                    <button 
                        className="btn btn-primary edit-tourPlan-step-button"
                        onClick={handleNextPage}
                        hidden={curStep === 3}
                    >Next</button>
                    <button 
                        className="btn btn-primary edit-tourPlan-step-button edit-tourPlan-step-button-extra"
                        onClick={handleSaveTourPlan}
                        hidden={curStep !== 3}
                    >Save Tour Plan</button>
                </div>
            </div>
        </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default EditTourPlan;