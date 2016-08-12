'use strict';

function createAgentCommentBox() {
  var agentChat;
  var commentBox = createCommentBox();

  commentBox.getInitialState = function () {
    return { data: [], status: 'init' };
  };

  commentBox.getDefaultProps = function () {
    return { initUrl: '/api/init-chat/agent', commentClass: 'commentAgent' };
  };

  commentBox.renderCommentForm = function () {
    if (this.state.status === 'init') return React.createElement(Button, { onclick: this.initChatSubmit.bind(this, {}) });else if (this.state.status === 'ready') return React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit, submitButtonText: 'Send' });
  };

  return commentBox;
}

function Button(props) {
  return React.createElement(
    'button',
    { onClick: props.onclick },
    ' Start Chat '
  );
}