import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import api from '../services/api';
import CarItem from './CarItem';
import RentForm from './RentForm';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CarList.css';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const carsData = await api.getCars();
      setCars(carsData);
      setError(null);
    } catch (err) {
      setError('Failed to load cars. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (car) => {
    setSelectedCar(car);
  };

  const handleRentSubmit = async (rentalData) => {
    try {
      await api.rentCar(selectedCar.id, {
        ...rentalData,
        car_id: selectedCar.id
      });
      setSelectedCar(null);
      fetchCars(); // Refresh the car list
      alert('Car rented successfully!');
    } catch (err) {
      console.error('Error renting car:', err);
      alert('Failed to rent car. Please try again.');
    }
  };

  const handleCancelRent = () => {
    setSelectedCar(null);
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };

  return (
    <>
      {/* Image Slider */}
      <Slider {...sliderSettings} className="image-slider">
        <div className="slide">
          <img src="https://cdn-aojpe.nitrocdn.com/PFGaVOjUmTZePTrqHNbolZRHkqYQlsKP/assets/images/optimized/rev-032b95d/onroadz.com/wp-content/uploads/2020/12/Banner-01-7-1.jpg" alt="Car 1" />
          <div className="slider-text">Explore Our Car Collection</div>
        </div>
        <div className="slide">
          <img src="https://cdn-aojpe.nitrocdn.com/PFGaVOjUmTZePTrqHNbolZRHkqYQlsKP/assets/images/optimized/rev-032b95d/onroadz.com/wp-content/uploads/2020/12/Banner-01-2.jpg" alt="Car 2" />
          <div className="slider-text">Book Your Ride Today</div>
        </div>
        <div className="slide">
          <img src="https://cdn-aojpe.nitrocdn.com/PFGaVOjUmTZePTrqHNbolZRHkqYQlsKP/assets/images/optimized/rev-032b95d/onroadz.com/wp-content/uploads/2020/12/Banner-01-4.jpg" alt="Car 3" />
          <div className="slider-text">Luxury Cars at Best Prices</div>
        </div>
      </Slider>
     

      <h2>Available Cars</h2>
      {loading && <div className="loading">Loading cars...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <div className="car-list">
          {cars.length === 0 ? <p>No cars available at the moment.</p> :
            cars.map((car) => (
              <CarItem 
                key={car.id} 
                car={car} 
                onRentClick={() => handleRentClick(car)}
              />
            ))
          }
        </div>
      )}

      {selectedCar && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelRent}>&times;</span>
            <h3>Rent {selectedCar.make} {selectedCar.model}</h3>
            <RentForm onSubmit={handleRentSubmit} onCancel={handleCancelRent} />
          </div>
        </div>
      )}
    </>
  );
};

export default CarList;
