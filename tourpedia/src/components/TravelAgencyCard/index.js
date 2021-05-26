import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
    makeStyles,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@material-ui/core';

import "./styles.css";

const useStyles = makeStyles({
    root: {
        "&:hover": {
            textDecoration: 'none',
        }
    },
    media: {
        height: 150,
    },
});

const TravelAgencyCard = (props) => {
    const classes = useStyles();

    const {url, image, name} = props;
    useEffect(() => {
    }, []);

    return ( 
        <div className="travel-agency-card-main">
            <Card 
                className={classes.root}
                component={Link} 
                to={'/agency/' + url}
            >
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                        image={image}
                        title=""
                    />
                    <CardContent>
                    <Typography gutterBottom variant="body1" component="h1">
                        {name}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
     );
}
 
export default TravelAgencyCard;