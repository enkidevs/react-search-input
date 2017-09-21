import React, {Component} from 'react'
import {render} from 'react-dom'

import SearchInput, {createFilter} from '../../lib/index'

import emails from './mails'

const KEYS_TO_FILTERS = ['user.name', 'subject', 'dest.name', 'id']

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: ''
    }
    this.searchUpdated = this.searchUpdated.bind(this)
  }

  render () {
    const filteredEmails = emails.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    return (
      <div>
        <SearchInput className='search-input' onChange={this.searchUpdated} />
        {filteredEmails.map(email => {
          return (
            <div className='mail' key={email.id}>
              <div className='from'>{email.user.name}</div>
              <div className='subject'>{email.subject}</div>
            </div>
          )
        })}
      </div>
    )
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
}

render(<App />, document.getElementById('app'))
