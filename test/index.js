global.document = require("jsdom").jsdom("");
global.window = document.parentWindow;
global.navigator = window.navigator;

var assert = require("assert");

var React = require("react/addons")
  , TestUtils = React.addons.TestUtils;

var SearchInput = require("../react-search-input");


var randomString = function () {
  return Math.random().toString(36).substring(7);
};

var TestComponent = React.createClass({

  getInitialState: function () {
    return { searchTerm: '' }
  }

  , searchInput: function () {
    return this.refs.search;
  }

  , getSearchTerm: function () {
    return this.state.searchTerm;
  }

  , searchUpdated: function(term) {
    this.setState({searchTerm: term}); // needed to force re-render
  }

  , render: function () {
    return React.createElement(SearchInput, React.__spread({}, {
      ref: "search"
      , onChange: this.searchUpdated
    }, this.props));
  }
});

describe("SearchInput", function () {
  var createSearchInput = function (props) {
    var component = TestUtils.renderIntoDocument(React.createElement(TestComponent, props));
    return component;
  };

  var changeSearchTerm = function (searchInput, term, blur) {
    var input = TestUtils.findRenderedDOMComponentWithTag(searchInput, "input");


    TestUtils.Simulate.click(input);
    TestUtils.Simulate.change(input, { target: { value: term } });

    return input;
  };

  describe("basic", function () {
    it("should change search term", function () {
      var container = createSearchInput();
      var searchinput = container.searchInput();
      var term = randomString();

      changeSearchTerm(searchinput, term);

      var searchTerm = searchinput.state.searchTerm;

      assert.equal(searchTerm, term, "the search term should have been changed");
    });

    it("should change call the props onChange", function () {
      var container = createSearchInput();
      var searchinput = container.searchInput();
      var term = randomString();

      changeSearchTerm(searchinput, term);

      var searchTerm = container.getSearchTerm();

      assert.equal(searchTerm, term, "the search term should have been changed");
    });
  });

  describe("props", function () {
    it("should test className", function () {
      var searchInput = createSearchInput({
        className: "test"
      }).searchInput();

      assert.equal(searchInput.getDOMNode().className, "search-input test", "there should be a new class");
    });
  });
});
