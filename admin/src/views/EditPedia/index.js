import React, {useState, useEffect, useRef} from 'react';
import JoditEditor from "jodit-react";

import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

const EditPedia = () => {

    const editor = useRef(null);
	const [content, setContent] = useState('');

    const config = {
		readonly: false,
	};

    const changeContent = (newContent) => {
        console.log(newContent);
        setContent(newContent);
    }

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="edit-pedia-main-container">
                <h1 style={{textAlign: 'center'}}>EditPedia Page</h1>
                <JoditEditor
                    className="edit-pedia-editor-container"
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={newContent => changeContent(newContent)}
                />
            </div>
        </LayoutWrapper>
     );
}
 
export default EditPedia;