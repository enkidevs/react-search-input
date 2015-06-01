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
        if (this._throttleTimeout) {
          clearTimeout(this._throttleTimeout);
        }
        this._throttleTimeout = setTimeout(function() {
          if (this.props.onChange) {
            this.props.onChange(searchTerm);
          }
        }.bind(this), this.props.throttle);
      }.bind(this));
    },

    filter: function(keys) {
      return Search.filter(this.state.searchTerm,
                           keys || this.props.filterKeys);
    },

    statics: {
      filter: function(term, keys) {
        return function(item) {
          if (term === '') {return true;}
          // escape special symbols to ensure `term` is a valid regex
          term = term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

          var _getValueForKey = function(key, _item) {
            var keys = key.split('.');
            var result = _item;
            keys.forEach(function(_key) {
              result = result && result[_key];
            });

            return result && result.toLowerCase();
          };

          if (keys) {
            if( typeof keys === 'string' ) {
              keys = [keys];
            }
            for (var i = 0; i < keys.length; i++) {
              var value = _getValueForKey(keys[i], item);
              if (value && value.search(term) !== -1) {
                return true;
              }
            }
            return false;
          } else {
            var stringValue = item.toLowerCase();
            return (stringValue.search(term) !== -1);
          }
        }.bind(this);
      }
    }
  });

  return Search;
});
