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

module.exports = React.createClass({
    getInitialState: function() {
        return { locked: false};
    },


    lock: function() {
        console.log("lock");
        this.setState({locked: true})
    },
    unlock: function() {
        console.log("unlock");
        this.setState({
            locked: false
        }, function() {
            this.scroll();
        });

    },

    scroll: function() {
        if (this.state.locked) {
            return;
        }
        var node = document.getElementById("messages");
        //if(node.scrollHeight<node.height){return;}

        var delta = (node.scrollHeight - node.offsetHeight) - node.scrollTop;
        console.log(node.offsetHeight, node.scrollTop, node.scrollHeight, node.scrollHeight - node.offsetHeight, delta);
        node.scrollTop = node.scrollTop + 1 + delta / 10;

    },

    componentDidUpdate: function(prevProps, prevState) {
        if (prevProps.messages.length != this.props.messages.length) {
            this.scroll();
        }
    },
    render: function() {
        return (

            <div id="messages" onScroll={this.scroll} onMouseDown={this.lock} onMouseUp={this.unlock} onTouchStart={this.lock} onTouchEnd={this.unlock}>
                {this.props.messages.map(function(result) {
                    return (<MessageItem key={result.id} user={result.user} content={result.content}/>);
                })}
            </div>

        );
    }

});
