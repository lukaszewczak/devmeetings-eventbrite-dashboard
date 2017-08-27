const moment = require('moment');
const cachedData = {};

module.exports = {
  clear () {
    Object.keys(cachedData).forEach(key => delete cachedData[key]);
  },

  set (key, data) {
    cachedData[key] = {
      lastCache: moment(),
      data: data
    };
  },

  get (key) {
    return cachedData[key];
  },

  isValid (key) {
    const data = cachedData[key];
    if (!data) {
      return false;
    }
    return data && moment.isMoment(data.lastCache) && moment().diff(data.lastCache, 'hours') < 1;
  }

};
