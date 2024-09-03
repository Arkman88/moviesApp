import { Spin } from 'antd'
import './spinner.css'

const Spinner = ({ tip = 'Loading...' }) => {
  return (
    <div className="spinner">
      <Spin tip={tip} />
    </div>
  )
}

export default Spinner
