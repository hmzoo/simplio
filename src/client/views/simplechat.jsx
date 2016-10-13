var React = require('react');

var MessageItem = React.createClass({
    render: function() {
        return (
            <div className="grid">
                <div className="grid-item 1/12 useritem">{this.props.user}</div>
                <div className="grid-item 11/12">{this.props.content}</div>
            </div>
        );
    }
});

var SimpleChat = React.createClass({
    getInitialState: function() {
        return {
            userName: '#####',
            roomName: '',
            infos: '',
            messages: [],
            users: [],
            messageInputValue: '',
            roomInputValue: '',
            roomReady: false
        };
    },
    setInfos: function(t) {
        this.setState({infos: t});
    },
    setRoomName: function(room) {
        this.setState({roomName: room});
        if (this.state.roomName != '') {
            this.setState({roomReady: true});
        }
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
    cleanRoom: function() {
        this.setState({users: [], messages: [], roomName: '', roomReady: false, infos: ""});
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
    onChangeRoomInput: function(e) {
        this.setState({roomInputValue: e.target.value.trim()});
    },
    handleSubmitRoomForm: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSubmitRoomForm(this.state.roomInputValue);
        this.setState({roomInputValue: ''});
    },
    onChangeMessageInput: function(e) {
        this.setState({messageInputValue: e.target.value});
    },
    handleSubmitMessageForm: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSubmitMessageForm(this.state.messageInputValue);
        this.setState({messageInputValue: ''});
    },

    render: function() {

        if (this.state.roomReady) {
            return (
                <div>
                    <div className="grid">
                        <div className="grid-item 8/12 bord">
                            <div id="roomTitle">
                                <h4>{this.state.roomName}</h4>
                            </div>
                        </div>
                        <div className="grid-item 4/12 bord">

                            <div className="grid gutter-0 " id="joinroom">
                                <form action="" onSubmit={this.handleSubmitRoomForm}>
                                    <div className="grid-item 8/12 bord">
                                        <input id="roominput" className="form-input wrapper" type="text" placeholder="Room name" onChange={this.onChangeRoomInput} value={this.state.roomInputValue}></input>
                                    </div>
                                    <div className="grid-item 4/12 bord">
                                        <button type="submit" className="btn  btn-primary wrapper ">join</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="grid-item 10/12 bord">
                            <div id="messages">
                                {this.state.messages.map(function(result) {
                                    return (<MessageItem key={result.id} user={result.user} content={result.content}/>);
                                })}
                            </div>
                        </div>
                        <div className="grid-item 2/12 bord">
                            <div id="userslist">
                                {this.state.users.map(function(result) {

                                    return (
                                        <div className="useritem" key={result}>{result}
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>
                    <div className="grid bord">
                        <form action="" onSubmit={this.handleSubmitMessageForm} autoComplete="off">
                            <div className="grid-item 2/12 bord dn md-dib">
                              <div className="wrapper">
                                <div className="username tc ">
                                    {this.state.userName}
                                </div>
                              </div>
                            </div>
                            <div className="grid-item 10/12 md-8/12 bord">

                                <input id="msginput" className="form-input wrapper" type="text" placeholder="Type here" autoComplete="off" onChange={this.onChangeMessageInput} value={this.state.messageInputValue}></input>
                            </div>
                            <div className="grid-item 2/12 bord">

                                <button type="submit" className="btn  btn-primary wrapper">send</button>

                            </div>
                        </form>

                    </div>

                </div>
            );
        } else {
            var infoElement;

            if (this.state.infos != "") {

                infoElement = (
                    <div className="box wrapper">{this.state.infos}</div >
                );
            }
            return (
                <div>
                    <div>
                        <h1 className="wrapper tc">Join a room
                        </h1>
                    </div>
                    <div className="bord">
                        <div className="wrapper md-6/12 bord">
                            <div className="grid gutter-0 " id="joinroom">
                                <form action="" onSubmit={this.handleSubmitRoomForm}>
                                    <div className="grid-item 9/12 bord">
                                        <input id="msginput" className="form-input wrapper" type="text" placeholder="Room name" onChange={this.onChangeRoomInput} value={this.state.roomInputValue}></input>
                                    </div>
                                    <div className="grid-item 3/12 bord">
                                        <button type="submit" className="btn  btn-primary wrapper ">join</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="grid">

                        <div className="grid-item 12/12">
                            {infoElement}
                        </div>

                    </div>
                </div>
            );
        }
    }
});

module.exports = SimpleChat;
