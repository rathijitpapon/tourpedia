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

const PlaceCard = (props) => {
    const classes = useStyles();

    const {url, image, place, details} = props;
    useEffect(() => {
    }, []);

    return ( 
        <div className="place-card-main">
            <Card className={classes.root} component={Link} to={'/place/' + url}>
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                        image={image}
                        title=""
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {place}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {details}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
     );
}
 
export default PlaceCard;