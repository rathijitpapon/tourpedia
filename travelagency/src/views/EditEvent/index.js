import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import {Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { Steps } from 'rsuite';
import { Range } from 'rc-slider';
import DatePicker from "react-datepicker";
import Collapsible from 'react-collapsible';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import { FaTrash } from 'react-icons/fa';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import 'rc-slider/assets/index.css';
import "./styles.css";

import userAuthService from '../../services/userAuthService';
import exploreService from '../../services/exploreService';
import eventService from '../../services/eventService';
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


const EditEvent = (props) => {
    const eventId = props.match.params.eventId;
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
    const [guides, setGuides] = useState([]);
    const [groupOption, setGroupOption] = useState([]);
    const [physical, setPhysical] = useState([]);
    const [accomodation, setAccomodation] = useState([]);
    const [inclusion, setInclusion] = useState([]);

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
    const [guideOption, setGuideOption] = useState([]);
    const [groupOptionOption, setGroupOptionOption] = useState("");
    const [physicalOption, setPhysicalOption] = useState("");
    const [accomodationOption, setAccomodationOption] = useState([]);
    const [inclusionOption, setInclusionOption] = useState([]);
    
    const [participant, setParticipant] = useState(0);
    const [age, setAge] = useState([1, 100]);
    const [duration, setDuration] = useState(1);
    const [cost, setCost] = useState(0);
    const [additionalCost, setAdditionalCost] = useState(0);
    const [childAllowed, setChildAllowed] = useState(false);
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

    const handleSaveEvent = async () => {
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

        const event = {};
        event.name = name;
        event.description = description;
        event.banner = bannerImage;
        event.imageURL = imageData;
        event.videoURL = videoURL;
        event.groupOption = groupOptionOption.value;
        event.duration = duration;
        event.inclusion = [];
        for (const inc of inclusionOption) {
            event.inclusion.push(inc.value);
        }
        event.minimumAge = age[0];
        event.maximumAge = age[1];
        event.childAllowed = childAllowed;
        event.physicalRating = physicalOption.value;
        event.participantLimit = participant;
        event.accomodationOption = [];
        for (const acc of accomodationOption) {
            event.accomodationOption.push(acc.value);
        }
        event.category = [];
        for (const cat of categoryOption) {
            event.category.push(cat.id);
        }
        event.totalCost = cost;
        event.possibleAdditionalCost = additionalCost;
        event.country = countryOption.id;
        event.place = [];
        for (const plc of placeOption) {
            event.place.push(plc.id);
        }
        event.guide = [];
        for (const gue of guideOption) {
            event.guide.push(gue.id);
        }
        event.planFileURL = "";
        event.agreementFileURL = "";

        event.dayPlan = [];
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

            event.dayPlan.push({
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

        if (eventId.toLowerCase() !== 'new') {
            const data = await eventService.editEvent(event, eventId);
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
            history.push('/event');

            return;
        }

        const data = await eventService.createEvent(event);
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
        history.push('/event');
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
                toast.error('Please Fillup Event Name', {
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
            if (guideOption.length === 0) {
                toast.error('Please Select At Least One Guide', {
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
            if (!physicalOption) {
                toast.error('Please Select A Physical Rating', {
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
            if (additionalCost && additionalCost < 0) {
                toast.error('Please Enter Valid Additional Cost', {
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
            if (!additionalCost) {
                setAdditionalCost(0);
            }
        }
        if (curStep === 2) {
            if (!description) {
                toast.error('Please Fillup Event Description', {
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
                toast.error('Please Fillup Event Banner', {
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
        const travelagency = userAuthService.getSavedAuthInfo();
        if (!travelagency) {
            toast.error('Unauthorized', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            history.push("/");
            return;
        }

        if (travelagency.isAgency === 'guide') {
            toast.error('You are not allowed to view this page', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            history.push("/home");
            return;
        }

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

        data = await userAuthService.getProfile(travelagency.username, travelagency.isAgency);
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            return;
        }

        formattedData = [];
        for (const guide of data.user.guide) {
            formattedData.push({
                value: guide._id.username,
                label: guide._id.username,
                name: guide._id.username,
                id: guide._id._id,
            });
        }

        setGuides(formattedData);

        data = [];
        for (const item of fixedFilters.groupOption) {
            data.push({
                value: item,
                label: item,
            });
        }
        setGroupOption(data);

        data = [];
        for (const item of fixedFilters.physicalRating) {
            data.push({
                value: item,
                label: item,
            });
        }
        setPhysical(data);

        data = [];
        for (const item of fixedFilters.inclusion) {
            data.push({
                value: item,
                label: item,
            });
        }
        setInclusion(data);

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

        if (eventId && eventId.toLowerCase() === 'new') {
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
            setGuideOption([]);
            setGroupOptionOption("");
            setPhysicalOption("");
            setAccomodationOption([]);
            setInclusionOption([]);

            setParticipant(0);
            setAge([1, 100]);
            setDuration(1);
            setCost(0);
            setAdditionalCost(0);
            setChildAllowed(false);
            setStartDate(new Date());
            setDayPlan([]);
        }
        else {
            data = await eventService.getEventById(eventId);
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
                history.push("/event");
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
            const guideData = [];

            for (const ctg of data.data.category) {
                categoryData.push({
                    value: ctg._id.name,
                    label: ctg._id.name,
                    name: ctg._id.name,
                    id: ctg._id._id,
                })
            }

            for (const gd of data.data.guide) {
                guideData.push({
                    value: gd._id.username,
                    label: gd._id.username,
                    name: gd._id.username,
                    id: gd._id._id,
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
            setGuideOption(guideData);

            setGroupOptionOption({
                value: data.data.groupOption,
                label: data.data.groupOption,
            });
            setPhysicalOption({
                value: data.data.physicalRating,
                label: data.data.physicalRating,
            });

            const inclusionData = [];
            for (const inc of data.data.inclusion) {
                inclusionData.push({
                    value: inc,
                    label: inc,
                });
            }
            setInclusionOption(inclusionData);

            const accomodationData = [];
            for (const acc of data.data.accomodationOption) {
                accomodationData.push({
                    value: acc,
                    label: acc,
                });
            }
            setAccomodationOption(accomodationData);

            setParticipant(data.data.participantLimit);
            setAge([data.data.minimumAge, data.data.maximumAge]);
            setChildAllowed(data.data.childAllowed);
            setCost(data.data.totalCost);
            setAdditionalCost(data.data.possibleAdditionalCost);
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
    }, [eventId]);

    return ( 
        <LayoutWrapper>
        <LoadingOverlay
            active={loading}
            spinner={
                <ClipLoader color={color} loading={loading} size={50} />
            }
        >
            <div className="edit-event-main-container">
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
                            <div className="edit-event-section-name">Event Name</div>
                            <input
                                className="edit-event-name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Event Name"
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Category</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setCategoryOption(newValue)}
                                options={categories}
                                value={categoryOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Country</div>
                            <Select
                                styles={customStyles}
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => handleCountrySelection(newValue)}
                                options={countries}
                                value={countryOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Place</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setPlaceOption(newValue)}
                                options={places}
                                value={placeOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Guide</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setGuideOption(newValue)}
                                options={guides}
                                value={guideOption}
                            />
                        </div>
                    </div>
                </div>
                
                <div hidden={curStep !== 1}>
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Tour Style</div>
                            <Select
                                styles={customStyles}
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setGroupOptionOption(newValue)}
                                options={groupOption}
                                value={groupOptionOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Physical Rating</div>
                            <Select
                                styles={customStyles}
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setPhysicalOption(newValue)}
                                options={physical}
                                value={physicalOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Inclusions</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setInclusionOption(newValue)}
                                options={inclusion}
                                value={inclusionOption}
                            />
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="edit-event-section-name">Accomodation Options</div>
                            <Select
                                styles={customStyles}
                                isMulti
                                className="edit-event-select-container"
                                onChange={(newValue, actionMeta) => setAccomodationOption(newValue)}
                                options={accomodation}
                                value={accomodationOption}
                            />
                        </div>
                    </div>

                    <br />

                    <div className="row">
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Age Range: {age[0]} to {age[1]}{(age[1] === 100) ? '+' : ''}</div>
                            <Range
                                style={{
                                    width: '86%',
                                    marginLeft: '7%',
                                    marginRight: '7%',
                                }}
                                trackStyle={[{
                                    height: '16px',
                                    backgroundColor: '#0A7BBD',
                                }]}
                                railStyle={{
                                    height: '16px',
                                    backgroundColor: '#0A7BBD',
                                }}
                                handleStyle={[
                                    {
                                        height: '25px',
                                        width: '25px',
                                        color: 'white',
                                        borderColor: 'blue',
                                    },
                                    {
                                        height: '25px',
                                        width: '25px',
                                        color: 'white',
                                        borderColor: 'blue',
                                    },
                                ]}
                                min={1}
                                max={100}
                                value={age}
                                onChange={value => setAge(value)}
                            />
                        </div>
                    </div>

                    <br /><br />

                    <div className="row">
                        <div className="col-md-4 col-12">
                            <input
                                style={{
                                    width: '22px',
                                    height: '22px',
                                }}
                                type="checkbox"
                                checked={childAllowed}
                                onChange={async () => {
                                    setChildAllowed(!childAllowed)
                                }}
                            /> &nbsp; &nbsp; <span 
                                className="edit-event-section-name"
                            >Child Allowance</span>
                        </div>
                    </div>

                    <br />

                    <div className="row">
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Participants Limit</div>
                            <input
                                className="edit-event-name-input"
                                type="number"
                                value={participant}
                                onChange={(e) => setParticipant(+e.target.value)}
                                placeholder="Participant Limit"
                            />
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Enrollment Cost</div>
                            <input
                                className="edit-event-name-input"
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(+e.target.value)}
                                placeholder="Enrollment Cost"
                            />
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Additional Cost</div>
                            <input
                                className="edit-event-name-input"
                                type="number"
                                value={additionalCost}
                                onChange={(e) => setAdditionalCost(+e.target.value)}
                                placeholder="Additional Cost"
                            />
                        </div>
                    </div>
                </div>
                
                <div hidden={curStep !== 2}>
                    <div className="edit-event-section-name">Event Description</div>
                    <textarea
                        type="text"
                        className="edit-event-description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Event Description"
                    />

                    <br />

                    <div className="row">
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Youtube Video URL</div>
                            <input
                                className="edit-event-name-input"
                                type="text"
                                value={videoURL}
                                onChange={(e) => setVideoURL(e.target.value)}
                                placeholder="Youtube Video URL"
                            />
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Start Date</div>
                            <DatePicker
                                className="edit-event-name-input"
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                dateFormat="dd MMMM, yyyy"
                                placeholderText={'Start Date'}
                            />
                        </div>
                        <div className="col-md-4 col-12">
                            <div className="edit-event-section-name">Duration</div>
                            <input
                                className="edit-event-name-input"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(+e.target.value)}
                                placeholder="Duration"
                            />
                        </div>
                    </div>

                    <div hidden={!banner.img}>
                    <div
                        className="edit-event-section-name"
                    >Event Banner</div>
                    <div className="col-lg-6 col-12 edit-event-img">
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
                            className="edit-event-img-container"
                            src={banner.isURL ? banner.img : URL.createObjectURL(banner.img)}
                            alt="event img"
                        />
                    </div>
                    <br />
                    </div>

                    <div
                        className="edit-event-section-name"
                        hidden={images.length === 0}
                    >Event Images</div>
                    <div className="row">
                        {
                            images.map((image, index) => (
                                <div key={index} className="col-lg-6 col-12 edit-event-img">
                                    <span 
                                        className="close"
                                        onClick={() => removeImage(index)}
                                    >&times;</span>
                                    <Image
                                        className="edit-event-img-container" 
                                        src={image.isURL ? image.img : URL.createObjectURL(image.img)}
                                        alt="event img"
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
                        <label htmlFor="banner-btn" className="btn btn-primary edit-event-save-button">
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
                        <label htmlFor="file-btn" className="btn btn-primary edit-event-save-button">
                            Add Event Images
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
                                    <div className="edit-event-day-plan-header">
                                        <b>Day {index + 1}</b> &nbsp; &nbsp;
                                        <IoIosArrowDown       
                                            className="edit-event-day-plan-header-icon" 
                                        />
                                    </div>
                                }
                                triggerWhenOpen={
                                    <div className="edit-event-day-plan-header">
                                        <b>Day {index + 1}</b> &nbsp; &nbsp;
                                        <IoIosArrowUp           
                                            className="edit-event-day-plan-header-icon" 
                                        />
                                    </div>
                                }
                            >
                            <div className="edit-event-section-name">Description</div>
                            <textarea
                                type="text"
                                className="edit-event-description-input"
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
                                    <div className="edit-event-section-name">Accomodation</div>
                                    <input
                                        className="edit-event-name-input"
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
                                    <div className="edit-event-section-name">Accomodation Cost</div>
                                    <input
                                        className="edit-event-name-input"
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
                                    <div className="edit-event-section-name">Accomodation Quality</div>
                                    <Select
                                        styles={customStyles}
                                        className="edit-event-select-container"
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
                                    <div className="edit-event-section-name">Room Size</div>
                                    <Select
                                        styles={customStyles}
                                        className="edit-event-select-container"
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
                                    <div className="edit-event-section-name">Transport</div>
                                    <input
                                        className="edit-event-name-input"
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
                                    <div className="edit-event-section-name">Transport Cost</div>
                                    <input
                                        className="edit-event-name-input"
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
                                    <div className="edit-event-section-name">Other Cost</div>
                                    <input
                                        className="edit-event-name-input"
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
                                className="edit-event-section-name"
                                hidden={day.images.length === 0}
                            >Images</div>
                            <div className="row">
                                {
                                    day.images.map((image, imageIndex) => (
                                        <div key={imageIndex} className="col-lg-6 col-12 edit-event-img">
                                            <span 
                                                className="close"
                                                onClick={() => {
                                                    const data = [...dayPlan];
                                                    data[index].images.splice(imageIndex, 1);
                                                    setDayPlan(data);
                                                }}
                                            >&times;</span>
                                            <Image
                                                className="edit-event-img-container" 
                                                src={image.isURL ? image.img : URL.createObjectURL(image.img)}
                                                alt="event img"
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
                            <label htmlFor={"day-file-btn" + index} className="btn btn-primary edit-event-save-button">
                                Add Images
                            </label>

                            <br />

                            {
                                day.timePlan.map((time, timeIndex) => (
                                    <div 
                                        key={timeIndex} 
                                        className="edit-event-time-plan-card"
                                    >
                                        <div className="row">
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-4 col-12">
                                                <div className="edit-event-section-name">Start Time</div>
                                                <DatePicker
                                                    className="edit-event-name-input"
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
                                                <div className="edit-event-section-name">Areas To Visit</div>
                                                <Select
                                                    styles={customStyles}
                                                    isMulti
                                                    className="edit-event-select-container"
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
                                                    className="edit-event-time-plan-delete"
                                                    onClick={() => {
                                                        const data = [...dayPlan];
                                                        data[index].timePlan.splice(timeIndex, 1);
                                                        setDayPlan(data);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-1 col-12"></div>
                                            <div className="col-md-4 col-12">
                                                <div className="edit-event-section-name">End Time</div>
                                                <DatePicker
                                                    className="edit-event-name-input"
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
                                                <div className="edit-event-section-name">Activities</div>
                                                <CreatableSelect
                                                    styles={customStyles}
                                                    isMulti
                                                    className="edit-event-select-container"
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
                                                <div className="edit-event-section-name">Cost</div>
                                                <input
                                                    className="edit-event-name-input"
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
                                className="btn btn-primary edit-event-save-button"
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
                    className="edit-event-step-button-group"
                    style={{
                        justifyContent: curStep === 0 ? 'flex-end' : 'space-between',
                    }}
                >
                    <button 
                        className="btn btn-secondary edit-event-step-button"
                        onClick={() => {
                            setCurStep(curStep - 1);
                        }}
                        hidden={curStep === 0}
                    >Previous</button>
                    <button 
                        className="btn btn-primary edit-event-step-button"
                        onClick={handleNextPage}
                        hidden={curStep === 3}
                    >Next</button>
                    <button 
                        className="btn btn-primary edit-event-step-button edit-event-step-button-extra"
                        onClick={handleSaveEvent}
                        hidden={curStep !== 3}
                    >Save Event</button>
                </div>
            </div>
        </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default EditEvent;