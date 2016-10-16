var tab = [];
var index = {};

var exists = function(id) {
    return (id in index)
        ? true
        : false;
}

var getTab = function() {
    return tab;
}

var tabdb = {

    exists: exists,
    getTab: getTab,
    index:index,
    onUpdated: function(tab) {
        console.log(tab);
    }

};

tabdb.add = function(id, obj) {
  console.log(exists(id));
    if (!exists(id)) {
        tab.push(obj);
        index[id] = tab.length - 1;
        console.log(index);
        tabdb.onUpdated(tab);
    }else{
      tabdb.set(id,obj)
    }
}
tabdb.del = function(id) {
    if (exists(id)) {
        tab.splice(index[id], 1);
        delete index[id],
        tabdb.onUpdated(tab);
    }
}

tabdb.get = function(id) {
    return index[id]
        ? tab[index[id]]
        : {};
}

tabdb.set = function(id, obj) {
    if (exists(id)) {
        for (var key in obj) {
            tab[index[id]][key] = obj[key];
        }
        tabdb.onUpdated(tab);
    }

}

module.exports = tabdb;
