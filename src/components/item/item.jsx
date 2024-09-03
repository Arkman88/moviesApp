import { Rate } from 'antd'
import './item.css'

const Item = ({ item }) => {
  const ratingRounded = Math.round(item.rating * 10) / 10

  return (
    <div className="item">
      <img src={item.image} alt={item.title} />
      <div className="item-details">
        <div className="item-header">
          <h3>{item.title}</h3>
          <div className="item-rating">
            <span className="rating-circle">{ratingRounded}</span>
          </div>
        </div>
        <div>
          <strong>Genres was here</strong>
        </div>
        <p>{item.release_date}</p>
        <p className="item-description">{item.description}</p>
        <Rate className="item-rate" disabled value={item.rating} count={10} allowHalf />
      </div>
    </div>
  )
}

export default Item
