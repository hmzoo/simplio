var React = require('react');


var mainView = {
    on: function(actionName, action) {
        this[actionName] = action;
    }

};




module.exports = mainView;
