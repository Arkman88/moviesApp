import { Pagination } from 'antd';
import './footer.css';

const Footer = ({ current, total, onChange }) => {
  return (
    <footer className="footer">
      <Pagination current={current} total={total * 10} onChange={onChange} showSizeChanger={false} />
    </footer>
  );
};

export default Footer;
