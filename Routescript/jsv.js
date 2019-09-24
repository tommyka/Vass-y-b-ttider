const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');

async function accessSpredsheet () {
  const doc = new GoogleSpreadsheet('1AnXZ8p9DLiDIXP3R3EJlnV6X4HqRx5bP4Br1xYH42Y4');
  //doc.useServiceAccountAuth
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheets = info.worksheets;

  const sheet = sheets[0];

  const rows =  await promisify(sheet.getRows)({
    offset: 0
  });
  console.log(sheet.id, sheet.title, sheet.rowCount, sheet.colCount)
  console.log(rows[0]);
}

accessSpredsheet();