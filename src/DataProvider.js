const mysql = require('mysql2/promise');

class DataProvider {

  async startContext(configs) {

    if (!this.pool) {
      this.pool = mysql.createPool(configs);
    }

    let context = await this.pool.getConnection();

    await context.beginTransaction();

    return context;
  }

  async query(context, command) {

    return await context.query(command);

  }

  async abortContext(context) {

    await context.rollback();

    await context.release();

  }

  async endContext(context) {

    await context.commit();

    await context.release();

  }

}

module.exports = { DataProvider };