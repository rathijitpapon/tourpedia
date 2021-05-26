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

const EventCard = (props) => {
    const classes = useStyles();

    const {url, image, title, date, agency} = props;
    useEffect(() => {
    }, []);

    return ( 
        <div className="event-card-main">
            <Card className={classes.root} component={Link} to={'/event/' + url}>
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                        image={image}
                        title=""
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                        {title}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" component="p">
                        {date}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {agency}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
     );
}
 
export default EventCard;