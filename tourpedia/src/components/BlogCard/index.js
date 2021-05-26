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

const BlogCard = (props) => {
    const classes = useStyles();

    const {url, image, title, author} = props;
    useEffect(() => {
    }, []);

    return ( 
        <div className="blog-card-main">
            <Card className={classes.root} component={Link} to={'/blog/' + url}>
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                        image={image}
                        title=""
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" component="p">
                        {author}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
     );
}
 
export default BlogCard;