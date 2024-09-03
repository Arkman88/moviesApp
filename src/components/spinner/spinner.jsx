import { Spin } from 'antd';
import './spinner.css';

const Spinner = ({ tip = 'Loading...' }) => {
  return (
    <div className="spinner">
      <div className="spinner-content">
        <Spin size="large" />
        <div className="spinner-tip">{tip}</div>
      </div>
    </div>
  );
};

export default Spinner;
