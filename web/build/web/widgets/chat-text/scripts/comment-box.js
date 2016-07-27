'use strict';

function createCommentBox() {
  var commentBox = {
    getDefaultProps: function getDefaultProps() {
      return { initUrl: '/api/init-chat/guest', commentClass: 'comment' };
    },
    loadCommentsFromServer: function loadCommentsFromServer(comment) {
      //alert(JSON.stringify(comment));
      var comments = this.state.data;
      var newComments = comments.concat(comment.data);
      this.setState({ data: newComments });
      $('html, body').animate({ scrollTop: $("#scroll").offset().top }, 1000);
    },
    handleCommentSubmit: function handleCommentSubmit(comment) {
      comment.type = this.props.commentClass;
      $.ajax({
        url: this.props.url,
        dataType: 'text',
        type: 'POST',
        data: comment,
        success: function (data) {
          //this.setState({data: newComments}); server places on websocket
        }.bind(this),
        error: function (xhr, status, err) {
          this.setState({ data: comments });
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    initChatSubmit: function initChatSubmit(comment) {
      comment.type = this.props.commentClass;
      this.setState({ spinner: true });
      $.ajax({
        url: this.props.initUrl,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function (we) {
          this.setState(we);
          var chat = io.connect('http://localhost:3000/chat');
          chat.on('message', this.loadCommentsFromServer);
        }.bind(this),
        error: function (xhr, status, err) {
          this.setState({ data: [] });
          console.error(this.props.initUrl, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function getInitialState() {
      return { data: [], spinner: false };
    },
    componentDidMount: function componentDidMount() {
      //nothing
    },
    getCommentFormElement: function getCommentFormElement() {
      var commentForm = React.createElement(CommentForm, { onCommentSubmit: this.initChatSubmit, submitButtonText: 'Start Chat' });
      if (this.state.ready) commentForm = React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit, submitButtonText: 'Send' });
      return commentForm;
    },
    render: function render() {
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
          { className: this.state.spinner ? 'hideMe' : '' },
          this.getCommentFormElement()
        ),
        React.createElement(Spinner, { imgSrc: '/img/dog-running.gif', show: this.state.spinner })
      );
    }
  };
  return commentBox;
}