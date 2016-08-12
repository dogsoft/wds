'use strict';

function createCommentBox() {
  var chat = null;
  var commentBox = {
    getDefaultProps: function getDefaultProps() {
      return { initUrl: '/api/init-chat/guest', commentClass: 'comment' };
    },
    addComment: function addComment(comment) {
      //alert(JSON.stringify(comment));
      var comments = this.state.data;
      var newComments = comments.concat(comment.data);
      this.setState({ data: newComments });
      $('html, body').animate({ scrollTop: $("#scroll").offset().top }, 1000);
    },
    handleCommentSubmit: function handleCommentSubmit(comment) {
      comment.type = this.props.commentClass;
      chat.emit('message', comment);
    },
    initChatSubmit: function initChatSubmit(comment) {
      comment.type = this.props.commentClass;
      this.setState({ status: 'wait' });
      $.ajax({
        url: this.props.initUrl,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function (we) {
          chat = io.connect('http://localhost:3000/chat/1');
          chat.on('message', this.addComment);
          this.setState({ status: 'ready' });
        }.bind(this),
        error: function (xhr, status, err) {
          this.setState({ data: [] });
          console.error(this.props.initUrl, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function getInitialState() {
      return { data: [], status: 'init' };
    },
    componentDidMount: function componentDidMount() {
      //alert('componentDidMount');
    },
    componentWillUnmount: function componentWillUnmount() {
      //alert('componentWillUnmount');
    },
    renderCommentForm: function renderCommentForm() {
      if (this.state.status === 'init') return React.createElement(CommentForm, { onCommentSubmit: this.initChatSubmit, submitButtonText: 'Start Chat' });else if (this.state.status === 'ready') return React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit, submitButtonText: 'Send' });
    },
    render: function render() {
      var commentForm = this.renderCommentForm();
      return React.createElement(
        'div',
        { className: 'commentBox' },
        React.createElement(
          'h1',
          null,
          'Comments'
        ),
        React.createElement(CommentList, { data: this.state.data }),
        React.createElement(
          'div',
          null,
          commentForm
        ),
        React.createElement(Spinner, { imgSrc: '/img/dog-running.gif', status: this.state.status })
      );
    }
  };

  return commentBox;
}