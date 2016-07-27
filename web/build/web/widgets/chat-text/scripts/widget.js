'use strict';

var Spinner = createSpinner();
var Comment = createComment();
var CommentList = createCommentList();
var CommentForm = createCommentForm();

function createSpinner() {
  return React.createClass({
    render: function render() {
      return React.createElement(
        'div',
        { className: this.props.show ? '' : 'hideMe' },
        React.createElement('img', { src: this.props.imgSrc, className: 'valign' }),
        React.createElement(
          'span',
          { className: 'valign' },
          'Fetching Your Agent ...'
        )
      );
    }
  });
}

function createComment() {
  return React.createClass({
    rawMarkup: function rawMarkup() {
      var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
      return { __html: rawMarkup };
    },

    render: function render() {
      return React.createElement(
        'div',
        { className: this.props.commentClass },
        React.createElement('span', { dangerouslySetInnerHTML: this.rawMarkup() })
      );
    }
  });
}

function createCommentList() {
  return React.createClass({
    render: function render() {
      var commentNodes = this.props.data.map(function (comment) {
        return React.createElement(
          Comment,
          { key: comment.id, commentClass: comment.type },
          comment.text
        );
      });
      return React.createElement(
        'div',
        { className: 'commentList' },
        commentNodes
      );
    }
  });
}
function createCommentForm() {
  return React.createClass({
    getInitialState: function getInitialState() {
      return { text: '' };
    },
    handleTextChange: function handleTextChange(e) {
      this.setState({ text: e.target.value });
    },
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      var text = this.state.text.trim();

      if (!text) {
        return;
      }

      this.props.onCommentSubmit({ text: text });
      this.setState({ text: '' });
    },
    render: function render() {
      return React.createElement(
        'form',
        { className: 'commentForm', onSubmit: this.handleSubmit },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Say something...',
          value: this.state.text,
          onChange: this.handleTextChange }),
        React.createElement('input', { type: 'submit', value: this.props.submitButtonText })
      );
    }
  });
}