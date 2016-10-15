var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
      return {
          userName: '#####',
          destName: '',
          inputValue: '',
      };
  },
  onChangeInput: function(e) {
      this.setState({inputValue: e.target.value});
  },
  handleSubmit: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onSubmit(this.state.inputValue);
      this.setState({inputValue: ''});
  },
  render: function() {
      return (

        <div className="grid bord">
            <form action="" onSubmit={this.handleSubmit} autoComplete="off">
                <div className="grid-item 2/12 bord dn md-dib">
                    <div className="wrapper">
                        <div className="username tc ">
                            {this.props.userName}
                        </div>
                    </div>
                </div>
                <div className="grid-item 10/12 md-8/12 bord">

                    <input id="msginput" className="form-input wrapper" type="text" placeholder="Type here" autoComplete="off" onChange={this.onChangeInput} value={this.state.inputValue}></input>
                </div>
                <div className="grid-item 2/12 bord">

                    <button type="submit" className="btn  btn-primary wrapper">send</button>

                </div>
            </form>

        </div>

      );
  }





  });
