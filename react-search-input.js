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
      var searchTerm = e.target.value;
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
          //var escapedTerm = term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          term = term.toLowerCase();

          if (keys) {
            if( typeof keys === 'string' ) {
              keys = [keys];
            }
            for (var i = 0; i < keys.length; i++) {
              var values = _getValuesForKey(keys[i], item);
              var found = false;
              values.forEach(function(value) {
                try {
                  if (value && value.search(term) !== -1) {
                    found = true;
                  }
                } catch(e) {
                }
              });
              if (found) {
                return true;
              }
            }
            return false;
          } else {
            try {
              var stringValue = item.toLowerCase();
              return (stringValue.search(term) !== -1);
            } catch(e) {
              return false;
            }
          }
        }.bind(this);
      }
    }
  });

  var _getValuesForKey = function(key, _item) {
    var keys = key.split('.');
    var results = [_item];
    keys.forEach(function(_key) {
      var tmp = [];
      results.forEach(function(result) {
        if (result) {
          if(result instanceof Array) {
            result.forEach(function(res) {
              tmp.push(res[_key]);
            });
          } else {
            tmp.push(result[_key]);
          }
        }
      });
      results = tmp;
    });
    return results.map(function(result) {
      if (typeof result === 'string') {
        return result.toLowerCase();
      } else {
        return null;
      }
    });
  };

  return Search;
});
