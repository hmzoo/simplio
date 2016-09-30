var React = require('react');

//INFOS
var InfoBox = React.createClass({

    render: function() {
        return (
            <div className="grid">
                <div className="grid-item 4/12">
                    <h3>{this.props.userName}</h3>
                </div>
                <div className="grid-item 4/12">
                    <h3>{this.props.roomName}</h3>
                </div>
                <div className="grid-item 4/12">
                    {this.props.infos}
                </div>
            </div>
        );
    }
});
//ROOM INPUT
JoinRoomInput = React.createClass({
    getInitialState: function() {
        return {textValue: ''}
    },

    onChange: function(e) {
        this.setState({textValue: e.target.value.trim()});
    },
    insertText: function(text) {
        this.setState({
            textValue: this.state.textValue + text
        });
    },

    clearText: function() {
        this.setState({textValue: ''});

    },
    handleSubmit: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onJoinRoom(this.state.textValue);
        this.clearText();
    },

    render: function() {
        return (

            <form action="" onSubmit={this.handleSubmit}>
                <div className="grid">
                    <div className="grid-item 10/12">
                        <input id="joininput" className="form-input" type="text" placeholder="Type here" onChange={this.onChange} value={this.state.textValue}></input>
                    </div>
                    <div className="grid-item 2/12">
                        <button className="btn  btn-primary" type="submit">Join</button>
                    </div>
                </div>
            </form>

        );
    }
});

//APP
var SimpleChat = React.createClass({
  getInitialState: function() {
      return {userName: '',roomName:'',infos:''}
  },
  setRoomName: function(t) {
      this.setState({roomName: t});
  },
  setUserName: function(t) {
      this.setState({userName: t});
  },
  setInfos: function(t) {
      this.setState({infos: t});
  },

    render: function() {
        return (
            <div>
                <div >
                    <InfoBox userName={this.state.userName}  roomName={this.state.roomName} infos={this.state.infos} />
                </div>
                <div >
                    <JoinRoomInput onJoinRoom={this.props.onJoinRoom}/>
                </div>
            </div>

        );
    }
});

module.exports = SimpleChat;
