import { Button } from 'antd'
import './header.css'

const Header = ({ isHomePage, isRatedPage, onHomeClick, onRatedClick }) => {
  return (
    <header className="header">
      <Button type="link" className={`header-button ${isHomePage ? 'active' : ''}`} onClick={onHomeClick}>
        Search
      </Button>
      <Button type="link" className={`header-button ${isRatedPage ? 'active' : ''}`} onClick={onRatedClick}>
        Rated
      </Button>
    </header>
  )
}

export default Header
