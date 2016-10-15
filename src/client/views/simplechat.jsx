var React = require('react');
var MsgBox=require('./msgbox.jsx');
var MsgInputBox=require('./msginputbox.jsx');



var SimpleChat = React.createClass({

    render: function() {


            return (
                <div >

                  <MsgBox messages={this.props.messages}/>
                  <MsgInputBox onSubmit={this.props.onSubmit} userName={this.props.userName} />

                </div>
            );

    }
});

module.exports = SimpleChat;
