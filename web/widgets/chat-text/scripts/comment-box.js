      function createCommentBox()
      {          
          var chat = null;
          var commentBox = {
          getDefaultProps: function() {
            return { initUrl: '/api/init-chat/guest',commentClass:'comment'};
          },        
          addComment: function(comment) {
              //alert(JSON.stringify(comment));
              var comments = this.state.data;
              var newComments = comments.concat(comment.data);       
              this.setState({data: newComments});
              $('html, body').animate({scrollTop: $("#scroll").offset().top}, 1000);                               
          },
          handleCommentSubmit: function(comment) {
            comment.type=this.props.commentClass; 
            chat.emit('message', comment);
          },        
          initChatSubmit: function(comment) {
            comment.type=this.props.commentClass;          
            this.setState({status: 'wait'});
            $.ajax({
              url: this.props.initUrl,
              dataType: 'json',
              type: 'POST',
              data: comment,
              success: function(we) {
                chat = io.connect('http://localhost:3000/chat/1');
                chat.on( 'message', this.addComment);  
                this.setState({status:'ready'});
              }.bind(this),
              error: function(xhr, status, err) {
                this.setState({data: []});
                console.error(this.props.initUrl, status, err.toString());
              }.bind(this)
            });
          },
          getInitialState: function() {
            return { data: [], status: 'init'};
          },
          componentDidMount: function() {
            //alert('componentDidMount');
          },
          componentWillUnmount: function() {
            //alert('componentWillUnmount');
          },
          renderCommentForm: function () {            
            if(this.state.status === 'init')
              return  <CommentForm onCommentSubmit={this.initChatSubmit} submitButtonText="Start Chat"/>
            else if(this.state.status === 'ready')
              return <CommentForm onCommentSubmit={this.handleCommentSubmit} submitButtonText="Send"/>
          },
          render : function () {                        
            var commentForm = this.renderCommentForm();        
            return (
              <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>                
                <div>{commentForm}</div>
                <Spinner imgSrc="/img/dog-running.gif" status={this.state.status}/>
              </div>
            );
          }
        };

        return commentBox;       
      }    