# react-search-input

> Simple [React](http://facebook.github.io/react/index.html) component for a search input, providing a filter function.

### [Demo](https://enki-com.github.io/react-search-input)

## Install

```bash
npm install react-search-input --save
```

or

```bash
bower install react-search-input --save
```

## Example

```javascript
var SearchInput = require('react-search-input');

var App = React.createClass({
  render() {
    var mails = [{
      user: {
        name: 'Mathieu',
        job: 'Software Engineer',
        company: 'Enki'
      },
      subject: 'Hi!'
    }, {
      user: {
        name: 'foo'
      },
      subject: 'bar'
    }, {
      user: {
        name: 'bar'
      },
      subject: 'foo'
    }];

    if (this.refs.search) {
      var filters = ['user.name', 'subject'];
      mails = mails.filter(this.refs.search.filter(filters));
    }

    return (
      <div>
        <SearchInput ref='search' onChange={this.searchUpdated} />
        {mails.map(function(mail) {
          return (
            <div className='mail'>
              <div className='from'>{mail.user.name}</div>
              <div className='subject'>{mail.subject}</div>
            </div>
          )
        })}
      </div>
    );
  },

  searchUpdated(term) {
    this.setState({searchTerm: term}); // needed to force re-render
  }
});
```

## API

### Props

All props are optional. All other props will be passed to the DOM input.

##### className

Class of the Component (in addition of `search-input`).

##### onChange

Function called when the search term is changed (will be passed as an argument).

##### filterKeys

Either an `[String]` or a `String`. Will be use by the `filter` method if no argument is passed there.

##### throttle

Reduce call frequency to the `onChange` function (in ms). Default is `200`.

##### caseSensitive

Define if the search should be case sensitive. Default is `false`

##### value

Define the value of the input.

### Methods

##### filter([keys])

Return a function which can be used to filter an array. `keys` can be `String`, `[String]` or `null`.

If an array `keys` is an array, the function will return true if at least one of the keys of the item matches the serch term.

### Static Methods

##### filter(searchTerm, [keys], [caseSensitive])

Return a function which can be used to filter an array. `searchTerm` can be a `regex` or a `String`. `keys` can be `String`, `[String]` or `null`.

If an array `keys` is an array, the function will return true if at least one of the keys of the item matches the serch term.

## Styles

Look at [react-search-input.css](https://github.com/mathieudutour/react-search-input/blob/master/react-search-input.css) for an idea on how to style this component.

---

MIT Licensed
