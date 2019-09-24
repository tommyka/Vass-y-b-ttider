import gspread
import json
import codecs
from oauth2client.service_account import ServiceAccountCredentials

def parse_sheet(sheet):
    route = {}
    currentPlan = None

    data = sheet.get_all_values()

    for row in data:
        if ":" not in row[0]:
            currentPlan = []
            route[row[0]] = currentPlan
        else:
            data = {"time":row[0], "duration":row[1], "id": str(int(row[2]))}
            try:
                if row[3] and row[3] is "*":
                    data["call"] = True
            except:
                d =""

            currentPlan.append(data)

    return route

def parse_red_days(sheet):
    currentPlan = []

    data = sheet.get_all_values()

    for row in data:
        data = {"day":row[0], "route":row[1], "changes": row[2], "message": row[3]}

        currentPlan.append(data)

    return currentPlan

#json_key = json.load(open('Vassoy-boat-timer-a54e1fbccc05.json'))
scope = ['https://spreadsheets.google.com/feeds']

#credentials = ServiceAccountCredentials(json_key['client_email'], json_key['private_key'].encode(), scope)
credentials = ServiceAccountCredentials.from_json_keyfile_name('Vassoy-boat-timer-a54e1fbccc05.json', scope)

gc = gspread.authorize(credentials)

#gc = gspread.login('dommy.ka@gmail.com', 'dssnzlqcgbirqebq')
print(gc)
#print(gc.openall())

wks = gc.open_by_key("1AnXZ8p9DLiDIXP3R3EJlnV6X4HqRx5bP4Br1xYH42Y4")
#wks = gc.open_by_url('https://drive.google.com/open?id=1AnXZ8p9DLiDIXP3R3EJlnV6X4HqRx5bP4Br1xYH42Y4')

sheet_names = wks.worksheets()
routeplan = {}
output = {"route":routeplan}
for sheet in sheet_names:
    print(sheet.title)
    if sheet.title != 'Red':
    	routeplan[sheet.title] = parse_sheet(sheet)
    else:
    	output['red'] = parse_red_days(sheet)

serialized = json.dumps(output)

with open("boat.json", 'w') as jsonf:
    jsonf.write(serialized)