import React from 'react'
import PropTypes from 'prop-types'
import { createFilter } from './util'

const Search = React.createClass({
  propTypes: {
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func,
    caseSensitive: PropTypes.bool,
    fuzzy: PropTypes.bool,
    throttle: PropTypes.number,
    filterKeys: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    value: PropTypes.string
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
    if (typeof nextProps.value !== 'undefined' && nextProps.value !== this.props.value) {
      const e = {
        target: {
          value: nextProps.value
        }
      }
      this.updateSearch(e)
    }
  },

  render () {
    const {className, onChange, caseSensitive, throttle, filterKeys, value, fuzzy, inputClassName, ...inputProps} = this.props // eslint-disable-line no-unused-vars
    inputProps.type = inputProps.type || 'search'
    inputProps.value = this.state.searchTerm
    inputProps.onChange = this.updateSearch
    inputProps.className = inputClassName
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
