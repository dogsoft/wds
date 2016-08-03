'use strict';

function createAgentCommentBox() {
  var commentBox = createCommentBox();
  commentBox.getInitialState = function () {
    return { data: [], ready: false, spinner: false };
  };

  commentBox.getDefaultProps = function () {
    return { initUrl: '/api/init-chat/agent', commentClass: 'commentAgent' };
  };

  commentBox.componentDidMount = function () {
    alert('componentDidMount');
    var schat = io.connect('http://localhost:3000/start-chat');
    schat.on('message', this.startChat);
  };

  commentBox.componentWillUnmount = function () {
    alert('componentWillUnmount');
  };

  commentBox.startChat = function () {
    alert('startChat');
  };

  commentBox.initChatSubmit = function (comment) {
    $.ajax({
      url: this.props.initUrl,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (we) {
        this.setState(we);
        initAgentWS.call(this);
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({ data: [] });
        console.error(this.props.initUrl, status, err.toString());
      }.bind(this)
    });
  };
  return commentBox;
}

function initAgentWS() {
  var chat = io.connect('http://localhost:3000/chat');
  chat.on('message', this.loadCommentsFromServer);
}