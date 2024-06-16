import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Ensure you import the CSS file

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Home = () => {
  const [isDaisyUI, setIsDaisyUI] = useState(true); // State to toggle DaisyUI
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from TMDB API
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        const imageUrls = data.results.map(movie => `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images from TMDB:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [images.length]);

  return (
    <div
      className="h-screen w-full bg-cover bg-center fade-background"
      style={{ backgroundImage: images.length ? `url(${images[currentImageIndex]})` : 'none' }}
    >
      <div className="p-4 bg-black bg-opacity-50 h-full flex flex-col justify-center items-center">
        <h1 className="text-2xl mb-4 text-white">Welcome to the Movie Booking System</h1>

        <Link
          to="/booking"
          className={`btn ${isDaisyUI ? 'btn-primary' : 'bg-blue-500 text-white hover:bg-blue-600'} mb-4`}
          onClick={() => setIsDaisyUI(!isDaisyUI)} // Toggle DaisyUI on click
        >
          Book a Movie
        </Link>
      </div>
    </div>
  );
};

export default Home;
