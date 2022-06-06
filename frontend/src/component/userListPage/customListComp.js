import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { makeStyles } from '@mui/styles';

function CustomListComp(props) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState(props.data.slice(0, 8));

    useEffect(() => {
        setData(props.data.slice(0, 8));
    }, [props.data]);

    const handleChange = (event, value) => {
        setPage(value);
        setData(props.data.slice(8 * (value - 1), 8 * value));
    };

    const useStyles = makeStyles(theme => ({
        alignItemsAndJustifyContent: {
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
    }))

    return (
        <>
            <div className = 'card-group'>
                { data.slice(0 , 4).map((d, i) => (
                    <div key = { i } className = 'card'>
                        <div className = "card-body">
                            <h5 className = "card-title">{ d.name }</h5>
                            <hr />
                            <p className = "card-text">Username: { d.userName }</p>
                            <p className = "card-text">Email: { d.email }</p>
                        </div>
                    </div>
                )) }
            </div>

            <div className = 'card-group mt-3'>
                { data.slice(4 , 8).map((d, i) => (
                    <div key = { i } className = 'card'>
                        <div className = "card-body">
                            <h5 className = "card-title">{ d.name }</h5>
                            <hr />
                            <p className = "card-text">Username: { d.userName }</p>
                            <p className = "card-text">Email: { d.email }</p>
                        </div>
                    </div>
                )) }
            </div>

            <Pagination
                className = { useStyles().alignItemsAndJustifyContent }
                count = { Math.ceil(props.data.length / 8) }
                page = { page }
                onChange = { handleChange }
                showFirstButton
                showLastButton
            />
        </>
    );
}

export default CustomListComp;