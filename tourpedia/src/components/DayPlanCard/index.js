import React, {useState} from 'react';
import Collapsible from 'react-collapsible';
import {Image} from 'react-bootstrap';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import {Table} from 'react-bootstrap';
import "./styles.css";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PlaceCard = (props) => {
    const dayPlan = props.dayPlan;

    const [isOpen, setIsOpen] = useState(false);
    const date = new Date(dayPlan.date);

    const getTime = (date) => {
        date = new Date(date);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <Collapsible
            open={isOpen}
            handleTriggerClick={() => setIsOpen(!isOpen)}
            trigger={
                <div className="day-plan-header-title">
                    <b>
                        {dayPlan.isDay ? dayPlan.day : date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()}
                    </b> &nbsp; &nbsp;<IoIosArrowDown       
                        className="day-plan-header-icon" 
                    />
                </div>
            }
            triggerWhenOpen={
                <div className="day-plan-header-title">
                    <b>
                        {dayPlan.isDay ? dayPlan.day : date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()}
                    </b> &nbsp; &nbsp;<IoIosArrowUp      
                        className="day-plan-header-icon" 
                    />
                </div>
            }
        >
            <div
                className="day-plan-card-main"
            >
                <Image
                    className="day-plan-card-image"
                    src={dayPlan.imageURL[0]}
                    alt="dayPlan img"
                />
                <div className="day-plan-card-middle">
                    <div className="day-plan-card-description">
                        {dayPlan.description}
                    </div>

                    <div>
                        <div className="day-plan-section-tilte">On This Day</div>
                        <Table striped responsive className="time-list-table">
                            <thead>
                                <tr>
                                    <th className="time-table-th">Time</th>
                                    <th className="time-table-th">Cost</th>
                                    <th className="time-table-th">Activities</th>
                                    <th className="time-table-th">Visiting Areas</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                dayPlan.timePlan.map((timePlan, index) => (
                                    <tr key={index} className="time-table-tr">
                                        <td className="time-table-td">{getTime(timePlan._id.startTime)} - {getTime(timePlan._id.endTime)}</td>
                                        <td className="time-table-td">{timePlan._id.cost} USD</td>
                                        <td className="time-table-td">
                                            {
                                                timePlan._id.activity.map((activity, index1) => (
                                                    <React.Fragment key={index1}>
                                                        {activity}{index1 < timePlan._id.activity.length - 1 ? "," : ""} &nbsp; 
                                                    </React.Fragment>
                                                ))
                                            }
                                        </td>
                                        <td className="time-table-td">
                                        {
                                                timePlan._id.area.map((area, index2) => (
                                                    <React.Fragment key={index2}>
                                                    {area._id.name}{index2 < timePlan._id.area.length - 1 ? "," : ""} &nbsp; 
                                                    </React.Fragment>
                                                ))
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        
        </Collapsible>
     );
}
 
export default PlaceCard;