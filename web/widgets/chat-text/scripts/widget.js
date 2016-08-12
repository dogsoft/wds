      var Spinner = createSpinner();
      var Comment = createComment();
      var CommentList = createCommentList();
      var CommentForm = createCommentForm();

      function createSpinner()
      {
        return React.createClass({
          render: function() {
            return (  
                <div className={this.props.status === 'wait' ? '' : 'hideMe' }>
                  <img src={this.props.imgSrc} className="valign" />
                  <span className="valign">Fetching Your Agent ...</span> 
                </div>          
            );
          }
        });          
      }      

      function createComment()
      {
        return React.createClass({
          rawMarkup: function() {
            var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
            return { __html: rawMarkup };
          },

          render: function() {
            return (
              <div className={this.props.commentClass}>          
                <span dangerouslySetInnerHTML={this.rawMarkup()} />           
              </div>
            );
          }
        });        
      }

      function createCommentList()
      {
        return React.createClass({
          render: function() {
            var commentNodes = this.props.data.map(function(comment) {
              return (
                <Comment key={comment.id} commentClass={comment.type}>
                  {comment.text}
                </Comment>
              );
            });
            return (
              <div className="commentList">
                {commentNodes}
              </div>
            );
          }
        });  
      }    
      function createCommentForm()
      {
        return React.createClass({
          getInitialState: function() {
            return {text: ''};
          },
          handleTextChange: function(e) {
            this.setState({text: e.target.value});
          },
          handleSubmit: function(e) {
            e.preventDefault();
            var text = this.state.text.trim();
            
            if (!text) {
              return;
            }

            this.props.onCommentSubmit({text: text});
            this.setState({text:''});
          },
          render: function() {
            return (
              <form className="commentForm" onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Say something..."
                value={this.state.text}
                onChange={this.handleTextChange}/>
              <input type="submit" value={this.props.submitButtonText} />
              </form>
            );
          }
        });        
      }    