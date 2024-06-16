import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'daisyui/dist/full.css';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.warn('Network error or timeout occurred');
    }
    return Promise.reject(error);
  }
);

const Booking = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [screens, setScreens] = useState([
    { id: 1, name: 'Screen 1', seatLimit: 60, bookedSeats: [] },
    { id: 2, name: 'Screen 2', seatLimit: 50, bookedSeats: [] },
    { id: 3, name: 'Screen 3', seatLimit: 40, bookedSeats: [] },
  ]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('https://movie-booking-system-backend.onrender.com/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setUser(response.data);
        } else {
          console.error('User not found in response data');
        }
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data.message : error.message);
      }
    };

    fetchMovies();
    fetchUser();
  }, []);

  const fetchMovies = async (retryCount = 0) => {
    try {
      const response = await axiosInstance.get(`/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
      setMovies(response.data.results);
    } catch (error) {
      if ((error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') && retryCount < 3) {
        console.warn(`Retrying fetchMovies... (${retryCount + 1}/3)`);
        fetchMovies(retryCount + 1);
      } else {
        toast.error('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', error);
      }
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleScreenSelect = (screen) => {
    setSelectedScreen(screen);
    fetchShowtimes(screen.id);
  };

  const handleShowtimeSelect = async (showtime) => {
    setSelectedShowtime(showtime);
    fetchBookedSeats(showtime);
  };

  const fetchShowtimes = async (screenId) => {
    try {
      // Simulated showtimes as the TMDB API does not provide showtimes
      const simulatedShowtimes = [
        new Date().toISOString(),
        new Date(Date.now() + 3600 * 1000).toISOString(),
        new Date(Date.now() + 7200 * 1000).toISOString(),
      ];
      setShowtimes(simulatedShowtimes);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      toast.error('Failed to fetch showtimes. Please try again later.');
    }
  };

  const fetchBookedSeats = async (showtime) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Cannot fetch booked seats.');
      toast.error('Please log in to continue.');
      return;
    }

    try {
      const response = await axios.get(`https://movie-booking-system-backend.onrender.com/api/bookings/seats?showtime=${showtime}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data) {
        console.error('Error fetching booked seats: Response data is empty.');
        toast.error('Failed to fetch booked seats. Please try again later.');
        return;
      }

      const { bookedSeats, lockedSeats } = response.data;
      console.log('Response Data:', response.data);

      if (!Array.isArray(bookedSeats) || !Array.isArray(lockedSeats)) {
        console.error('Error fetching booked seats: Response data structure is invalid.');
        toast.error('Failed to fetch booked seats. Please try again later.');
        return;
      }

      setSeats(Array.from({ length: selectedScreen.seatLimit }, (_, i) => ({
        number: `Seat ${i + 1}`,
        booked: bookedSeats.includes(`Seat ${i + 1}`),
        locked: lockedSeats.includes(`Seat ${i + 1}`)
      })));
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      toast.error('Failed to fetch booked seats. Please try again later.');
    }
  };

  const handleSeatSelect = async (seatNumber) => {
    const seat = seats.find(s => s.number === seatNumber);
    if (seat.booked || seat.locked) return; // Prevent selecting already booked or locked seats

    const newSelectedSeats = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter(s => s !== seatNumber)
      : [...selectedSeats, seatNumber];

    if (newSelectedSeats.length > selectedScreen.seatLimit) {
      toast.error(`Seat limit of ${selectedScreen.seatLimit} exceeded.`);
      return;
    }

    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.length * 10);

    // Lock the seat immediately after selection
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://movie-booking-system-backend.onrender.com/api/bookings/lock-seat', { showtime: selectedShowtime, seats: [seatNumber] }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      seat.locked = true; // Update the local state to reflect the locked status
      setSeats([...seats]);
    } catch (error) {
      console.error('Error locking seat:', error);
      toast.error('Failed to lock seat. Please try again later.');
    }
  };

  const handleBooking = async () => {
    if (!user) {
      console.error('User not found. Booking cannot proceed.');
      toast.error('User information not found. Please log in.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const orderResponse = await axios.post('https://movie-booking-system-backend.onrender.com/api/bookings/create-order', { amount: totalPrice }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "Movie Booking",
        description: "Test Transaction",
        image: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            const data = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user: user._id,
              movie: selectedMovie,
              showtime: selectedShowtime,
              seats: selectedSeats,
              totalPrice
            };

            const verificationResponse = await axios.post('https://movie-booking-system-backend.onrender.com/api/bookings/verify-payment', data, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verificationResponse.data.message === 'Payment verified and booking created successfully') {
              toast.success('Booking successful!');
              fetchBookedSeats(selectedShowtime);
            } else {
              toast.error('Booking verification failed. Please try again later.');
            }
          } catch (verificationError) {
            console.error('Error verifying booking:', verificationError);
            toast.error('Booking verification failed. Please try again later.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.contact || ''
        },
        notes: {
          address: "Your Address"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error making booking:', error);
      toast.error('Booking failed. Please try again later.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setSelectedScreen(null);
    setSelectedShowtime(null);
    setSeats([]);
    setSelectedSeats([]);
    setTotalPrice(0);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-bold text-blue-500 text-center">Book Your Movie</h1>
      <div className="mb-4">
        <h2 className="text-xl mb-2 font-semibold text-gray-800">Select a Movie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {movies.map(movie => (
            <div key={movie.id} onClick={() => handleMovieSelect(movie)} className="card shadow-xl cursor-pointer">
              <figure>
                <img src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} className="w-full h-60 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{movie.title}</h2>
                <p>{movie.overview}</p>
                <div className="card-actions justify-between mt-2">
                  <span className="badge badge-primary">Release Date: {new Date(movie.release_date).toLocaleDateString()}</span>
                  <span className="badge badge-secondary">Rating: {movie.vote_average}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl mb-2">Select a Screen</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {screens.map(screen => (
                <button key={screen.id} onClick={() => handleScreenSelect(screen)} className="btn btn-outline btn-accent">
                  {screen.name}
                </button>
              ))}
            </div>

            {selectedScreen && (
              <>
                <h2 className="text-xl mb-2">Select a Showtime</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {showtimes.map(showtime => (
                    <button key={showtime} onClick={() => handleShowtimeSelect(showtime)} className="btn btn-outline btn-accent">
                      {new Date(showtime).toLocaleString()}
                    </button>
                  ))}
                </div>

                {selectedShowtime && (
                  <>
                    <h2 className="text-xl mb-2">Select Seats</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                      {seats.map(seat => (
                        <button
                          key={seat.number}
                          onClick={() => handleSeatSelect(seat.number)}
                          className={`btn ${selectedSeats.includes(seat.number) ? 'btn-primary' : seat.booked || seat.locked ? 'btn-disabled btn-error' : 'btn-outline btn-accent'}`}
                          disabled={seat.booked || seat.locked}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {selectedSeats.length > 0 && (
                  <>
                    <h2 className="text-xl mb-2">Total Price: ${totalPrice}</h2>
                    <button onClick={handleBooking} className="btn btn-primary mb-4">Confirm Booking</button>
                  </>
                )}
              </>
            )}

            <div className="modal-action">
              <button onClick={closeModal} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Booking;
