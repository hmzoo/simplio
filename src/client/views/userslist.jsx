var React = require('react');

var handleClick= function(t) {
    console.log('You clicked: ' + t);
}

var UserItem = React.createClass({
    getInitialState: function() {
        return {data: ''};
    },
    setData: function(t) {
        this.setState({data: t});
    },

    render: function() {
        return (
            <div className="box 3/12" data-name={this.props.userName} >{this.props.userName} {this.state.data}</div>
        );
    }
});
module.exports = React.createClass({
    getInitialState: function() {
        return {};
    },
    handleClick: function(e) {
        console.log('You clicked: ' + e.target.dataset.name);
    },

    render: function() {

        return (
            <div id="userslist " onClick={this.handleClick}>
                {this.props.users.map(function(result) {

                    return (<UserItem  key={result.name} userName={result.name} />);
                })}

            </div>
        )
    }

});
