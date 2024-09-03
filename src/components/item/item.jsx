import { Rate } from 'antd'
import { format, parse, isValid } from 'date-fns'
import './item.css'

const parseDate = (dateString) => {
  const formatString = 'yyyy-MM-dd'
  const parsedDate = parse(dateString, formatString, new Date())

  return isValid(parsedDate) ? parsedDate : new Date()
}

const Item = ({ item }) => {
  const ratingRounded = Math.round(item.rating * 10) / 10

  const releaseDate = parseDate(item.release_date)
  const formattedDate = format(releaseDate, 'MMMM d, yyyy')

  return (
    <div className="item">
      <img src={item.image} alt={item.title} />
      <div className="item-details">
        <div className="item-header">
          <span>{item.title}</span>
          <div className="item-rating">
            <span className="rating-circle">{ratingRounded}</span>
          </div>
        </div>
        <p className="item-date">{formattedDate}</p>
        <div className="item-genres">
          {item.genres.map((genre, index) => (
            <span key={index} className="genre-badge">
              {genre}
            </span>
          ))}
        </div>
        <p className="item-description">{item.description}</p>
        <Rate className="item-rate" disabled value={item.rating} count={10} allowHalf />
      </div>
    </div>
  )
}

export default Item
