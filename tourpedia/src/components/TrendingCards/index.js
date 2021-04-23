import React from 'react';
import {Link} from 'react-router-dom';
import './styles.css'

function TrendingCards(props) {
    return (
        <div className="cards">
            <h1>{props.title}</h1>
            <div className="cards__container">
                <div className="cards__wrapper">
                    <ul className="cards__items">
                        {props.cardData.map(data => (
                            <li className="cards__item">
                                <Link className="cards__item__link" to={data.path}>
                                    <figure className="cards__item__pic-wrap" data-category={data.label}>
                                        <img src={data.src} alt="Travel Image" className="cards__item__img" />
                                    </figure>
                                    <div className="cards__item__info">
                                        <h4 className="cards__item__text_line1">{data.text_line1}</h4>
                                        <h4 className="cards__item__text_line2">{data.text_line2}</h4>
                                    </div>
                                </Link>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TrendingCards;