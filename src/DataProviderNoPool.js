const mysql = require('mysql2/promise');

class DataProvider {

  async startContext(configs) {

    let context = await mysql.createConnection(configs);

    await context.beginTransaction();

    return context;

  }

  async query(context, command) {

    return await context.query(command);

  }

  async abortContext(context) {

    await context.rollback();

    await context.close();

  }

  async endContext(context) {

    await context.commit();

    await context.close();

  }

}

module.exports = { DataProvider };