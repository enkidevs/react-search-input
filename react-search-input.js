;(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("react"));
  } else if (typeof define === "function" && define.amd) {
    define(["react"], factory);
  } else {
    root.SearchInput = factory(root.React);
  }
})(this, function (React) {
  "use strict";

  var Search = React.createClass({
    propTypes: {
      className: React.PropTypes.string,
      onChange: React.PropTypes.func
    },

    getInitialState: function() {
      return {
        searchTerm: ''
      };
    },

    render: function() {
      return (
        React.createElement("div", {className: "search-input " + this.props.className},
          React.createElement("div", {className: "search-wrapper"},
            React.createElement("span", {className: "search-icon"}, String.fromCharCode(9906)),
            React.createElement("input", {type: "search", value: this.state.searchTerm,
              onChange: this.updateSearch, className: "search-field",
              placeholder: "Search"})
          )
        )
      );
    },

    updateSearch: function(e) {
      var searchTerm = e.target.value.toLowerCase();
      this.setState({
        searchTerm: searchTerm
      }, function() {
        if (this.props.onChange) {
          this.props.onChange(searchTerm);
        }
      }.bind(this));

    },

    filter: function(keys) {
      return function(item) {
        var term = this.state.searchTerm;
        if (term === '') {return true;}
        // escape special symbols to ensure `term` is a valid regex
        term = term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

        var name = item;

        var _getNameForKey = function(_key, _name) {
          var keys = _key.split('.');
          keys.forEach(function(__key) {
            _name = _name[__key];
          });

          return _name.toLowerCase();
        };

        if (keys) {
          if( typeof keys === 'string' ) {
            keys = [keys];
          }
          for (var i = 0; i < keys.length; i++) {
            if (_getNameForKey(keys[i], name).search(term) !== -1) {
              return true;
            }
          }
          return false;
        } else {
          name = name.toLowerCase();
          return (name.search(term) !== -1);
        }
      }.bind(this);
    }
  });

  return Search;
});
