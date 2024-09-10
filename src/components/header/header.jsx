import { Tabs } from 'antd';
import './header.css';

const Header = ({ activeTab, onTabChange }) => {
  const tabItems = [
    { key: 'search', label: 'Search' },
    { key: 'rated', label: 'Rated' },
  ];

  return (
    <header className="header">
      <Tabs activeKey={activeTab} onChange={onTabChange} centered items={tabItems} />
    </header>
  );
};

export default Header;
