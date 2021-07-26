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

    return (
        <Collapsible
            open={isOpen}
            handleTriggerClick={() => setIsOpen(!isOpen)}
            trigger={
                <div className="day-plan-header-title">
                    <b>
                        {date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()}
                    </b> &nbsp; &nbsp;<IoIosArrowDown       
                        className="day-plan-header-icon" 
                    />
                </div>
            }
            triggerWhenOpen={
                <div className="day-plan-header-title">
                    <b>
                        {date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()}
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
                    src={dayPlan.imageURL}
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
                                        <td className="time-table-td">{timePlan.startTime} - {timePlan.endTime}</td>
                                        <td className="time-table-td">{timePlan.cost} USD</td>
                                        <td className="time-table-td">
                                            {
                                                timePlan.activity.map((activity, index1) => (
                                                    <React.Fragment key={index1}>
                                                        {activity}{index1 < timePlan.activity.length - 1 ? "," : ""} &nbsp; 
                                                    </React.Fragment>
                                                ))
                                            }
                                        </td>
                                        <td className="time-table-td">
                                        {
                                                timePlan.area.map((area, index2) => (
                                                    <React.Fragment key={index2}>
                                                    {area.name}{index2 < timePlan.area.length - 1 ? "," : ""} &nbsp; 
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