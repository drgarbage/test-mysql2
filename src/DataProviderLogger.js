const mysql = require('mysql2/promise');

class DataProviderLogger {

  constructor(provider) {
    this.provider = provider;
    this.enableLog = false;
    this.showQuery = false;
  }

  startContext(configs) {
    if (this.enableLog)
      console.log('startContext', configs);

    return this.provider.startContext(configs);
  }

  query(context, command) {
    if (this.enableLog)
      console.log('query', command);

    if (this.showQuery)
      console.info(command);

    return this.provider.query(context, command);
  }

  abortContext(context) {
    if (this.enableLog)
      console.log('abortContext');

    return this.provider.abortContext(context);
  }

  endContext(context) {
    if (this.enableLog)
      console.log('endContext');

    return this.provider.endContext(context);
  }

}

module.exports = { DataProviderLogger };