var React = require('react');

//ROOM INPUT
var JoinRoomInput = React.createClass({
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
        this.props.onSubmit(this.state.textValue);
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

//MESSAGING
var SendMessageInput= React.createClass({
    getInitialState: function() {
        return {textValue: ''}
    },

    onChange: function(e) {
        this.setState({textValue: e.target.value.trim()});
    },
    insertText :function(text){
       this.setState({textValue:this.state.textValue+text });
    },

    clearText: function() {
        this.setState({textValue: ''});

    },
    handleSubmit: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSubmit(this.state.textValue);
        this.clearText();
    },

    render: function() {
        return (
            <form action="" onSubmit={this.handleSubmit} autoComplete="off" >

                <div className="grid">
                    <div className="grid-item 10/12">
                        <input id="msginput" className="form-input" type="text" placeholder="Type here" onChange={this.onChange} value={this.state.textValue} autoComplete="off" ></input>
                    </div>
                    <div className="grid-item 2/12">
                        <button type="submit" className="btn  btn-primary">Send</button>
                    </div>
                </div>

            </form>
        );
    }
});

var MessagesBox = React.createClass({

    render: function() {

        return (
            <div id='textbox'>
              {this.props.datas.map(function(result){
                console.log(result);
                return (
                  <div key={result.id} ><b>{result.user} : </b>{result.content}</div>
                );
              })}
            </div>
        );
    }
});
//USERS LIST

UsersList = React.createClass({

    render: function() {
        return (
            <div id='listbox'><h6>U</h6>
              {this.props.datas.map(function(result){
                return (
                  <div key={result.name}><b>{result}</b></div>
                );
              })}
            </div>
        );
    }
});

//APP
var SimpleChat = React.createClass({
    getInitialState: function() {
        return {userName: 'empty', roomName: 'empty', infos: 'empty',messages:[],users:[]}
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
    newMessage:function(data){

  var msgs = this.state.messages.concat([{id:this.state.messages.length,user:data.user,content:data.content}]);
  this.setState({messages:msgs});
},
setUsersList:function(data){
  his.setState({users:data});
},

    render: function() {
        return (
          <div>
            <div className="grid ">
                <div className="grid-item 2/12 "><h3 className="wrapper">{this.state.userName}</h3>  </div>
                <div className="grid-item 2/12 wrapper"><h2 className="wrapper">{this.state.roomName}</h2></div>
                <div className="grid-item 4/12 wrapper"><div className="wrapper">{this.state.infos}</div></div>
                <div className="grid-item 4/12"><div className="wrapper"><JoinRoomInput onSubmit={this.props.onJoinRoom}/></div></div>
            </div>
            <div className="grid ">
              <div className="grid-item 8/12">
                <MessagesBox datas={this.state.messages} />
                <div className="wrapper"><SendMessageInput onSubmit={this.props.onSendMessage}/></div>

                </div>
                <div className="grid-item 8/12">
                  <UsersList datas={this.state.users} />
                </div>
            </div>

</div>
        );
    }
});

module.exports = SimpleChat;
