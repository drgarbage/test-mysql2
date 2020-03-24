// let { DataProvider } = require('./DataProvider');
let { DataProvider } = require('./DataProviderNoPool');
let { DataProviderLogger } = require('./DataProviderLogger');

const CONFIG = {
  host: '[host]',
  user: '[user]',
  password: '[password]'
};

const callService = async () => {

  let provider = new DataProviderLogger(new DataProvider());
  // provider.enableLog = true;
  // provider.showQuery = true;

  let context = null;
  let total = 500.0;
  let gap = total / 1000.0;

  try {

    context = await provider.startContext(CONFIG);

    for (let i = 0.0; i < total; i++) {
      // insert a data to db01, get id

      await provider.query(context, `INSERT INTO eztable.please_delete_me ( content ) VALUES ( 'DATA-NUM-${i}' )`);
      let [rowOfEztable] = await provider.query(context, `SELECT LAST_INSERT_ID() AS ID`);
      let idOfEztable = rowOfEztable[0]['ID'];


      await provider.query(context, `INSERT INTO share.delete_me_please ( content, fid ) VALUES ( 'REF-DATA-NUM-${i}', ${idOfEztable} )`)
      let [rowOfShare] = await provider.query(context, `SELECT LAST_INSERT_ID() AS ID`);
      let idOfShare = rowOfShare[0]['ID'];

      if (i % gap == 0) {
        console.clear();
        console.info(`progress ${i / total * 100} %`);
      }

    }

    let [rowEztable] = await provider.query(context, "SELECT COUNT(*) As CNT FROM eztable.please_delete_me");
    let [rowShare] = await provider.query(context, "SELECT COUNT(*) As CNT FROM share.delete_me_please");
    let cntEztable = rowEztable[0]['CNT'];
    let cntShare = rowShare[0]['CNT'];

    console.info(`eztable:${cntEztable} share:${cntShare}`);

    if (cntEztable != cntShare)
      throw new Error("Data count of both table isn't matched.");

    // always fail
    // await provider.query(context, "SELECT * FROM eztable.no_such_table");

    await provider.endContext(context);

  } catch (err) {

    console.error(err.message);

    if (context != null)
      await provider.abortContext(context);

  }

}

callService().catch(err => console.error(err));