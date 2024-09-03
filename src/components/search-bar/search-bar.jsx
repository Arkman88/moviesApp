import React from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'
import './search-bar.css'

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { searchQuery: '' }

    this.debouncedSearch = debounce(this.props.onSearch, 400)
  }

  onChange = (e) => {
    const searchQuery = e.target.value
    this.setState({ searchQuery })

    this.debouncedSearch(searchQuery)
  }

  render() {
    return (
      <div className="search-bar">
        <Input placeholder="Type to search..." value={this.state.searchQuery} onChange={this.onChange} />
      </div>
    )
  }
}
