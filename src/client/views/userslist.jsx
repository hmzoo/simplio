var React = require('react');


var UserItem = React.createClass({
  getInitialState: function() {
      return {data:''};
  },
  setData:function(t){
    this.setState({data:t});
  },
    render: function() {
        return (
            <div className="box 3/12">{this.props.userName} {this.state.data}</div>
        );
    }
});
module.exports = React.createClass({
    getInitialState: function() {
        return {};
    },

    render: function() {

        return (
            <div id="userslist ">
                {this.props.users.map(function(result) {

                    return (
                        <UserItem key={result.name} userName={result.name}/>
                    );
                })}

            </div>
        )
    }

});
