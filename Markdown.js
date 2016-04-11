var React = require('react-native');
var {
  View
} = React;
var _ = require('lodash');
var SimpleMarkdown = require('simple-markdown');

var styles = {
  autolink: {
    color: 'blue'
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImageView: {
    flex: 1,
    overflow: 'hidden',
  },
  view: {
  },
  codeBlock: {
    fontFamily: 'Courier',
    fontWeight: '500'
  },
  del: {
    containerBackgroundColor: '#222222'
  },
  em: {
    fontStyle: 'italic'
  },
  heading: {
    fontWeight: '200'
  },
  heading1: {
    fontSize: 32
  },
  heading2: {
    fontSize: 24
  },
  heading3: {
    fontSize: 18
  },
  heading4: {
    fontSize: 16
  },
  heading5: {
    fontSize: 13
  },
  heading6: {
    fontSize: 11
  },
  hr: {
    backgroundColor: '#cccccc',
    height: 1
  },
  image: {
    height: 50, // TODO: React Native needs to support auto image size
    width: 50 // TODO: React Native needs to support auto image size
  },
  imageBox: {
    flex: 1,
    resizeMode: 'contain',
  },
  inlineCode: {
    backgroundColor: '#eeeeee',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'Courier',
    fontWeight: 'bold'
  },
  list: {

  },
  listItem: {
    flexDirection: 'row'
  },
  listItemText: {
    flex: 1,
  },
  listItemBullet: {
    fontSize: 20,
    lineHeight: 20
  },
  listItemNumber: {
    fontWeight: 'bold',
  },
  listRow: {
    flexDirection: 'row',
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  paragraphCenter: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  paragraphWithImage: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: 'bold'
  },
  table: {
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 3
  },
  tableHeader: {
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  tableRowLast: {
    borderColor: 'transparent'
  },
  tableRowCell: {
    padding: 5
  },
  text: {
    color: '#222222'
  },
  textRow: {
    flexDirection: 'row',
  },
  u: {
    borderColor: '#222222',
    borderBottomWidth: 1
  }
};


var Markdown = React.createClass({

  getDefaultProps: function() {
    return {
      style: styles
    };
  },

  componentWillMount: function() {
    if (this.props.enableLightBox && !this.props.navigator) {
      throw new Error('props.navigator must be specified when enabling lightbox')
    }
    var opts = {
      enableLightBox: this.props.enableLightBox,
      navigator: this.props.navigator,
      imageParam: this.props.imageParam,
      onLink: this.props.onLink,
      bgImage: this.props.bgImage,
      onImageOpen: this.props.onImageOpen,
      onImageClose: this.props.onImageClose,
    }

    var mergedStyles = _.merge({}, styles, this.props.style);
    var rules = require('./rules')(mergedStyles, opts);
    rules = _.merge({}, SimpleMarkdown.defaultRules, rules);

    var parser = SimpleMarkdown.parserFor(rules);
    this.parse = function(source) {
      var blockSource = source + '\n\n';
      return parser(blockSource, {inline: false});
    };
    this.renderer = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'));
  },


  componentDidMount: function() {
    if (this.props.onLoad) {
      this.props.onLoad()
    }
  },

  render: function() {

    var child = _.isArray(this.props.children)
      ? this.props.children.join('') : this.props.children;
    var tree = this.parse(child);
    return <View style={[styles.view, this.props.style.view]}>{this.renderer(tree)}</View>;
  }
});

module.exports = Markdown;
