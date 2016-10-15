var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
      return {
      };
  },
  handleLeave: function(e) {
      this.props.onLeave();
  },
    render: function() {
      return (
      <div className="grid">
          <div className="grid-item 12/12 bord">
              <div className="fr">
                  <button onClick={this.handleLeave} className="btn  btn-xs ">leave</button>
              </div>
              <div className="roomtitle wrapper wrapper-flush">{this.props.roomName}</div>
          </div>
      </div>);
    }
  });
