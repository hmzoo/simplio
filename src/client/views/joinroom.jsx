var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
      return {
          inputValue: '',
      };
  },
  onChangeInput: function(e) {
      this.setState({inputValue: e.target.value.substring(0,64)});
  },
  handleSubmit: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onSubmit(this.state.inputValue.trim());
      this.setState({inputValue: ''});
  },
  render:function(){


    return (
        <div>
            <div>
                <h1 className="wrapper tc mv">Join a room
                </h1>
            </div>
            <div className="bord">
                <div className="wrapper lg-5/12 bord">
                    <div className="grid gutter-0 " id="joinroom">
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="grid-item  bord">
                                <input id="roominput" className="form-input wrapper tc" type="text" placeholder="Room name" onChange={this.onChangeInput} value={this.state.inputValue}></input>
                            </div>
                            <div className="grid-item   bord tc">

                                <button type="submit" className="btn  btn-primary 5/12 mv+">join</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
  }

});
