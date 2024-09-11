import Item from '../item/item';
import { Row, Col } from 'antd';
import './item-list.css';

const ItemList = ({ items, moviesApp }) => {
  const colSpan = items.length === 1 ? 24 : { xs: 24, sm: 12, md: 10 };

  return (
    <div className="item-list">
      <Row gutter={[16, 16]} justify="center" align="middle">
        {items.map((item) => (
          <Col
            span={typeof colSpan === 'number' ? colSpan : undefined}
            xs={colSpan.xs}
            sm={colSpan.sm}
            md={colSpan.md}
            key={item.id}
            className="ant-col"
          >
            <Item item={item} moviesApp={moviesApp} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ItemList;
