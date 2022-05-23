import React from 'react';

function GlobalFilter({ globalFilter, setGlobalFilter }) {
    return (
        <span>
            Search: {' '}
            <input value = { globalFilter || '' } onChange = { e => setGlobalFilter(e.target.value  || undefined) } />
        </span>
    );
}

export default GlobalFilter;