import Item from '../item/item';
import { Row, Col } from 'antd';
import './item-list.css';

const ItemList = ({ items, moviesApp }) => {
  return (
    <div className="item-list">
      <Row gutter={16} justify="center" align="middle">
        {items.map((item) => (
          <Col span={10} key={item.id}>
            <Item item={item} moviesApp={moviesApp} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ItemList;
