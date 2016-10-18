var React = require('react');
var JoinRoom = require('./joinroom.jsx');
var SimpleChat = require('./simplechat.jsx');
var RoomHead = require('./roomhead.jsx');
var UsersList = require('./userslist.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {userName: '#####', roomName: '', infos: '', messages: [], users: []};
    },
    clean: function() {
        this.setState({users: [], messages: [], roomName: '', infos: ""});
    },
    setInfos: function(t) {
        this.setState({infos: t});
    },
    setRoomName: function(room) {
     room=room.substr(0,1).toUpperCase() + room.substr(1).toLowerCase();
        this.setState({users: [], messages: [],roomName: room});
    },
    setEncRoomName: function(t) {
  console.log(t);
    },
    setUserName: function(user) {
        this.setState({userName: user});
    },
    newMessage: function(user, content) {

        var msgs = this.state.messages.concat([
            {
                id: this.state.messages.length,
                user: user,
                content: content
            }
        ]);
        this.setState({messages: msgs});
    },
    addUser: function(user) {
        if (this.state.users.indexOf(user) != -1) {
            return;
        }
        var u = this.state.users.concat([user]);

        this.setState({users: u});
    },
    removeUser: function(user) {
        var u = this.state.users;
        var index = u.indexOf(user);
        if (index > -1) {
            u.splice(index, 1);
            this.setState({users: u});
        }

    },
    setUsers:function(users){
      this.setState({users: users});
    },
    render: function() {

        if (this.state.roomName == '') {
            return (<JoinRoom userName={this.state.userName} infos={this.state.infos} onSubmit={this.props.onSubmitRoom}/>);
        } else {

            return (
              <div>
                <RoomHead userName={this.state.userName} roomName={this.state.roomName} onLeave={this.props.onLeave}/>
              <SimpleChat userName={this.state.userName} messages={this.state.messages} onSubmit={this.props.onSubmitMessage}/>
              <UsersList users={this.state.users} />
            </div>
            )
        }
    }

});
