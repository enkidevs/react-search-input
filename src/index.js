import React from 'react'
import { createFilter } from './util'

const Search = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    caseSensitive: React.PropTypes.bool,
    fuzzy: React.PropTypes.bool,
    throttle: React.PropTypes.number,
    filterKeys: React.PropTypes.oneOf([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),
    value: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      className: '',
      onChange () {},
      caseSensitive: false,
      fuzzy: false,
      throttle: 200
    }
  },

  getInitialState () {
    return {
      searchTerm: this.props.value || ''
    }
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      const e = {
        target: {
          value: nextProps.value
        }
      }
      this.updateSearch(e)
    }
  },

  render () {
    const {className, onChange, caseSensitive, throttle, filterKeys, value, ...inputProps} = this.props
    inputProps.type = inputProps.type || 'search'
    inputProps.value = this.state.searchTerm
    inputProps.onChange = this.updateSearch
    inputProps.placeholder = inputProps.placeholder || 'Search'
    return (
      <div className={className}>
        <input {...inputProps} />
      </div>
    )
  },

  updateSearch (e) {
    const searchTerm = e.target.value
    this.setState({
      searchTerm: searchTerm
    }, () => {
      if (this._throttleTimeout) {
        clearTimeout(this._throttleTimeout)
      }

      this._throttleTimeout = setTimeout(() => this.props.onChange(searchTerm), this.props.throttle)
    })
  },

  filter (keys) {
    return createFilter(this.state.searchTerm, keys || this.props.filterKeys, this.props.caseSensitive, this.props.fuzzy)
  }
})

export default Search
export { createFilter }
