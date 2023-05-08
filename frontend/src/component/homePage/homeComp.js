import React, { useEffect, useState } from 'react';
import PopularTicker from './popularTicker';
import QuicklyView from './quicklyView';

function HomeComp() {
    return (
        <>
            <PopularTicker />
            <QuicklyView />
        </>
    );
}

export default HomeComp;