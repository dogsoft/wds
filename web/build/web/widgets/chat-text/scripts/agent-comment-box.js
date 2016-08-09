'use strict';

function createAgentCommentBox() {
  var agentChat = null;
  var commentBox = createCommentBox();
  commentBox.getInitialState = function () {
    return { data: [], ready: false, spinner: false };
  };

  commentBox.getDefaultProps = function () {
    return { initUrl: '/api/init-chat/agent', commentClass: 'commentAgent' };
  };

  commentBox.componentDidMount = function () {
    agentChat = io.connect('http://localhost:3000/chat');
    agentChat.on('message', this.addComment);
  };

  commentBox.componentWillUnmount = function () {
    alert('componentWillUnmount');
  };

  commentBox.initChatSubmit = function (comment) {
    $.ajax({
      url: this.props.initUrl,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (we) {
        this.setState(we);
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({ data: [] });
        console.error(this.props.initUrl, status, err.toString());
      }.bind(this)
    });
  };

  commentBox.handleCommentSubmit = function (comment) {
    comment.type = this.props.commentClass;
    agentChat.emit('message', comment);
  };

  commentBox.getCommentFormElement = function () {
    return React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit, submitButtonText: 'Send' });
  };

  return commentBox;
}