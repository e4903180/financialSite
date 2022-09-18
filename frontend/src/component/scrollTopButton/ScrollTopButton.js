import React, { useState } from 'react';
import { BsFillArrowUpSquareFill } from "react-icons/bs";
import "./ScrollTopButton.css"

function ScrollTopButton() {
    const [showScroll, setShowScroll] = useState(false);

    function checkScrollTop(){
        if (!showScroll && window.pageYOffset > 400){
            setShowScroll(true)
        }else if (showScroll && window.pageYOffset <= 400){
            setShowScroll(false)
        }
    }

    function scrollTop(){
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    window.addEventListener('scroll', checkScrollTop)

    return (
        <>
            <BsFillArrowUpSquareFill className = "scrollTop" onClick = { scrollTop } style = {{ display : showScroll ? 'block' : 'none' }}/>
        </>
    );
}

export default ScrollTopButton;