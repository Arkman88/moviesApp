import React from 'react'
import { Input } from 'antd'
import './search-bar.css'

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { searchQuery: '' }
  }

  onChange = (e) => {
    this.setState({ searchQuery: e.target.value })
  }

  onSubmit = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(this.state.searchQuery)
    }
  }

  render() {
    return (
      <div className="search-bar">
        <Input
          placeholder="Type to search..."
          value={this.state.searchQuery}
          onChange={this.onChange}
          onKeyDown={this.onSubmit}
        />
      </div>
    )
  }
}
