import { useContext, useState, useEffect } from 'react';
import { GenresContext } from '../../services/genres-provider';
import { format, parse, isValid } from 'date-fns';
import { message, Rate } from 'antd';
import './item.css';

const parseDate = (dateString) => {
  const formatString = 'yyyy-MM-dd';
  const parsedDate = parse(dateString, formatString, new Date());

  return isValid(parsedDate) ? parsedDate : new Date();
};

const getRatingColor = (rating) => {
  if (rating <= 3) return '#E90000';
  if (rating <= 5) return '#E97E00';
  if (rating <= 7) return '#E9D100';
  return '#66E900';
};

const Item = ({ item, moviesApp }) => {
  const genres = useContext(GenresContext);

  const apiRating = item.rating;

  const [userRating, setUserRating] = useState(() => {
    const savedRating = localStorage.getItem(`rating_${item.id}`);
    return savedRating ? parseFloat(savedRating) : 0;
  });

  const apiRatingRounded = Math.round(apiRating * 10) / 10;
  const releaseDate = parseDate(item.release_date);
  const formattedDate = format(releaseDate, 'MMMM d, yyyy');
  const ratingColor = getRatingColor(apiRatingRounded);

  useEffect(() => {
    localStorage.setItem(`rating_${item.id}`, userRating);
  }, [userRating, item.id]);

  const handleRatingChange = async (value) => {
    try {
      const result = await moviesApp.rateMovie(item.id, value);
      if (result.success) {
        setUserRating(value);
        message.success('Rating submitted');
      } else {
        message.error('Failed to submit rating');
      }
    } catch (error) {
      message.error('Error while submitting rating');
    }
  };

  return (
    <div className="item">
      <img src={item.image} alt={item.title} />
      <div className="item-details">
        <div className="item-header">
          <span>{item.title}</span>
          <div className="item-rating">
            <span className="rating-circle" style={{ borderColor: ratingColor }}>
              {apiRatingRounded}
            </span>
          </div>
        </div>
        <p className="item-date">{formattedDate}</p>
        <div className="item-genres">
          {item.genre_ids.map((id) => (
            <span key={id} className="genre-badge">
              {genres[id] || 'Unknown Genre'}
            </span>
          ))}
        </div>
        <p className="item-description">{item.description}</p>
        <Rate className="item-rate" count={10} allowHalf value={userRating} onChange={handleRatingChange} />
      </div>
    </div>
  );
};

export default Item;
