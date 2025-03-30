const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const mergeWith = require("lodash/mergeWith");

const creds = require("./client_secret.json");

const arrayMerger = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

const parseRouteSheet = async (sheet) => {
  let currentPlan = [];
  let route = { Weekday: currentPlan };

  await sheet.loadCells();

  for (let i = 0; i < sheet.rowCount; i++) {
    const time = sheet.getCell(i, 0).value;
    if (time === null) {
      continue;
    }

    if (time.indexOf(":") == -1) {
      currentPlan = [];
      route[time] = currentPlan;
    } else {
      const duration = sheet.getCell(i, 1).value;
      const id = sheet.getCell(i, 2).value;
      const call = !!sheet.getCell(i, 3).value;

      const data = {
        time,
        duration,
        id,
        call,
      };
      currentPlan.push(data);
    }
  }
  return route;
};

async function parseRedDays(sheet) {
  const rows = await sheet.getRows();
  console.log(rows);
  return rows.map((row) => ({
    day: row.date,
    route: row.plan,
    message: row.message,
  }));
}

const timeToNumber = (time) => {
  return parseInt(time.replace(":", ""), 10);
};

async function accessSpredsheet() {
  const doc = new GoogleSpreadsheet("1AnXZ8p9DLiDIXP3R3EJlnV6X4HqRx5bP4Br1xYH42Y4");

  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  const routes = {};
  const output = { route: routes };
  for (var i = 0; i < doc.sheetCount; i++) {
    const sheet = doc.sheetsByIndex[i];

    if (sheet.title !== "Red") {
      //sheet.rowCount
      const route = await parseRouteSheet(sheet);
      const direction = sheet.title.split("_")[1];
      const mergedRoute = mergeWith(routes[direction] || {}, route, arrayMerger);
      // sort the boat times
      Object.keys(mergedRoute).forEach((group) => {
        mergedRoute[group].sort((a, b) => {
          return timeToNumber(a.time) > timeToNumber(b.time) ? 1 : -1;
        });
      });
      routes[direction] = mergedRoute;
    } else {
      const red = await parseRedDays(sheet);
      output.red = red;
    }
  }

  const json = JSON.stringify(output);
  console.log("Routes fetch and json generated");
  await promisify(fs.writeFile)(path.join(__dirname, "../src/boat.json"), json);
}

accessSpredsheet();
