import './footer.css'
import { Pagination } from 'antd'

const Footer = ({ onChange, total }) => {
  return (
    <footer className="footer">
      <Pagination onChange={onChange} total={total} pageSize={10} showSizeChanger={false} />
    </footer>
  )
}

export default Footer
