import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import {Link} from 'react-router-dom';
import {Table} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import tourPlanService from '../../services/tourplanService';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TourPlan = () => {
    const [plans, setPlans] = useState([]);

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const handleRemoveTourPlan = async (index) => {
        const tourPlanId = plans[index]._id;

        setLoading(true);
        const data = await tourPlanService.deleteTourPlan(tourPlanId);
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
        
        setLoading(false);
        await fetchData();
    }

    const fetchData = async () => {
        setLoading(true);
        
        const data = await tourPlanService.getManyTourPlans();
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
        setLoading(false);
        setPlans(data.data);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="plan-main-container"
            >
                <div className="plan-title">All Tour Plans</div>
                <Table striped responsive className="plan-list-table">
                    <thead>
                        <tr>
                            <th>Tour Plan Name</th>
                            <th>Start Date</th>
                            <th>Duration</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        plans.map((plan, index) => (
                            <tr key={index}>
                                <td>{plan.name}</td>
                                <td>{(new Date(plan.dayPlan[0]._id.date)).getDate() + "," + monthNames[(new Date(plan.dayPlan[0]._id.date)).getMonth()] + " " + (new Date(plan.dayPlan[0]._id.date)).getFullYear()}</td>
                                <td>{plan.duration}</td>
                                <td>
                                    <Link to={"/plan/edit/" + plan._id}>
                                        <button 
                                            className="btn btn-primary"
                                        >
                                            Edit
                                        </button>
                                    </Link> &nbsp;
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleRemoveTourPlan(index)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                {
                    plans.length === 0 ? (
                        <div className="plan-text">Currently No Tour Plans Added</div>
                    ) : null
                }
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default TourPlan;