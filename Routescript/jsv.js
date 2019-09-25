const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const fs = require('fs');

const creds = require('./client_secret.json');

const parseRouteSheet = async(sheet) => {
  let currentPlan = [];
  let route = {Weekday: currentPlan};

  const rows =  await promisify(sheet.getRows)({
    offset: 0
  });
  rows.forEach((row,index) => {
    if (row[0].indexOf(':') == -1) {
      currentPlan = [];
      route[row[0]] = currentPlan;
    } else {
      const data = {time: row[0], duration: row[1], id: row[2]}
      currentPlan.push(data);
    }
  });

  return route;
}


async function accessSpredsheet () {
  const doc = new GoogleSpreadsheet('1AnXZ8p9DLiDIXP3R3EJlnV6X4HqRx5bP4Br1xYH42Y4');
  //doc.useServiceAccountAuth
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheets = info.worksheets;
  const routes = {};
  const output = {route: routes};
  for(var i = 0; i < sheets.length; i ++) {
    const sheet = sheets[i];
    if(sheet.title !== 'Red'){
      const route =  await parseRouteSheet(sheet);
      routes[sheet.title] = route;
    }
  };

  const json = JSON.stringify(output);
  await promisify(fs.writeFile)('boatjs.json', json);
  console.log(output);
}

accessSpredsheet();