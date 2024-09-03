import Item from '../item/item';
import { Row, Col } from 'antd';
import './item-list.css';

const ItemList = ({ items }) => {
  return (
    <div className="item-list">
      <Row gutter={16} justify="center" align="middle">
        {items.map((item, index) => (
          <Col span={10} key={index}>
            <Item item={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ItemList;
