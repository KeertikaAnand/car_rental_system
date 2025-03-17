// components/ImageSlider.js
import React, { useState, useEffect } from 'react';

const ImageSlider = () => {
    const images = ['/images/slider1.jpg', '/images/slider2.jpg', '/images/slider3.jpg'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="image-slider">
            <div className="slider-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Slider ${index + 1}`} className="slider-image" />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;