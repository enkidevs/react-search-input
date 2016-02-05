import React from 'react'
import ReactDOM from 'react-dom'

import SearchInput, {createFilter} from '../../lib/index'

import emails from './mails'

const KEYS_TO_FILTERS = ['user.name', 'subject', 'dest.name']

const App = React.createClass({
  getInitialState () {
    return { searchTerm: '' }
  },

  render () {
    const filteredEmails = emails.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    return (
      <div>
        <SearchInput className="search-input" onChange={this.searchUpdated} />
        {filteredEmails.map(email => {
          return (
            <div className="mail" key={email.id}>
              <div className="from">{email.user.name}</div>
              <div className="subject">{email.subject}</div>
            </div>
          )
        })}
      </div>
    )
  },

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
})

ReactDOM.render(<App />, document.getElementById('app'))
