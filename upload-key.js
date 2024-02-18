const axios = require('axios').default;
const keys = require('./keys.json');
const fs = require('fs');
const path = require('path');

const BASE_URL ="https://dev-api-bpms.pouyagaranautomation.com/api";
const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiIwNWVlMjQ4Ny1lMzU1LTRmNzYtYjEyYS03Y2JiZThlYjhjOGMiLCJhY2NvdW50SWQiOiJhZmNlNzYyMC0yNjk3LTQ3YTItODhjOS1mZTFmMDA2MWU3ZmYiLCJlbXBsb3llZUlkIjoiNTUzMzI4MmMtNGU5ZC00NDU1LTgzOWQtMDI1MThlNjZlMDRjIiwiaXNBZG1pbiI6ZmFsc2UsInVzZXJuYW1lIjoiYS5naG9zaSIsImVtYWlsIjoiYS5naG9zaUBnbWFpbC5jb20iLCJyb2xlcyI6WyIzODVkNDkzOC02ODUwLTQ2ZmUtOTQzYy05MGMwZGVmMDIwZGMiLCIwOGRjM2E5Yi01ZDlkLTQ0OGYtYjc5NC05MjgwYTdmZDE0ZjQiXSwicGVybWlzc2lvbnMiOlsiaHJtOnJlYWQtb3JnYW5pemF0aW9uYWwtaGllcmFyY2hpZXMiLCJocm06Y3JlYXRlLW9yZ2FuaXphdGlvbmFsLWhpZXJhcmNoaWVzIiwiaHJtOnVwZGF0ZS1vcmdhbml6YXRpb25hbC1oaWVyYXJjaGllcyIsImhybTpkZWxldGUtb3JnYW5pemF0aW9uYWwtaGllcmFyY2hpZXMiLCJocm06cmVhZC1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOmNyZWF0ZS1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOnVwZGF0ZS1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOmRlbGV0ZS1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOnJlYWQtcG9zaXRpb25zIiwiaHJtOmNyZWF0ZS1wb3NpdGlvbnMiLCJocm06dXBkYXRlLXBvc2l0aW9ucyIsImhybTpkZWxldGUtcG9zaXRpb25zIiwiaHJtOnJlYWQtcm9sZXMiLCJocm06Y3JlYXRlLXJvbGVzIiwiaHJtOnVwZGF0ZS1yb2xlcyIsImhybTpkZWxldGUtcm9sZXMiLCJocm06cmVhZC1lbXBsb3llZXMiLCJocm06Y3JlYXRlLWVtcGxveWVlcyIsImhybTp1cGRhdGUtZW1wbG95ZWVzIiwiaHJtOmRlbGV0ZS1lbXBsb3llZXMiLCJicG1zOnJlYWQtc2VydmljZS1idWlsZGVyIiwiYnBtczpjcmVhdGUtc2VydmljZS1idWlsZGVyIiwiYnBtczp1cGRhdGUtc2VydmljZS1idWlsZGVyIiwiYnBtczpkZWxldGUtc2VydmljZS1idWlsZGVyIiwiYnBtczpyZWFkLWZvcm0iLCJicG1zOmNyZWF0ZS1mb3JtIiwiYnBtczp1cGRhdGUtZm9ybSIsImJwbXM6ZGVsZXRlLWZvcm0iLCJicG1zOnJlYWQtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczpjcmVhdGUtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczp1cGRhdGUtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczpkZWxldGUtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczpyZWFkLXdvcmtmbG93IiwiYnBtczpjcmVhdGUtd29ya2Zsb3ciLCJicG1zOnVwZGF0ZS13b3JrZmxvdyIsImJwbXM6ZGVsZXRlLXdvcmtmbG93IiwiYnBtczpyZWFkLWN1c3RvbS1wYWdlIiwiYnBtczpjcmVhdGUtY3VzdG9tLXBhZ2UiLCJicG1zOnVwZGF0ZS1jdXN0b20tcGFnZSIsImJwbXM6ZGVsZXRlLWN1c3RvbS1wYWdlIiwiYWNjb3VudHMtbWFuYWdlbWVudDpyZWFkLWFjY291bnRzIiwiYWNjb3VudHMtbWFuYWdlbWVudDpjcmVhdGUtYWNjb3VudCIsImFjY291bnRzLW1hbmFnZW1lbnQ6dXBkYXRlLWFjY291bnQiLCJhY2NvdW50cy1tYW5hZ2VtZW50OmRlbGV0ZS1hY2NvdW50IiwiYWNjb3VudHMtbWFuYWdlbWVudDp1cGRhdGUtcGVybWlzc2lvbnMiLCJpMThuOm1hbmFnZS1sYW5ndWFnZXMiLCJpMThuOm1hbmFnZS10cmFuc2xhdGlvbiJdLCJpYXQiOjE3MDgyNjAzNTIsImV4cCI6MTcwODI2MjE1Mn0.zMDMq3UNrbJ3lHR2TqiE0FSzgb9xcvGGRmjsDLHplhI";

async function main() {
    if (!fs.existsSync('keys')) {
        fs.mkdirSync('keys')
    }
    for (const key of keys) {
        const p = path.join('keys', `${key.key}.json`)
        if (!fs.existsSync(p) || JSON.stringify(key) !== fs.readFileSync(p).toString()) {
            await axios.put(`${BASE_URL}/v1/i18n/translation-key`, {
                key: key.key,
                namespaces: key.namespaces,
                multiLine: key.multiLine,
                maxLength: key.maxLength,
            }, {
                headers: {
                    Authorization: 'Bearer custom-token-23456789'
                },
            });
            console.log('key', key.key, 'saved')
            if (key.t) {
                for (const locale in key.t) {
                    await axios.put(`${BASE_URL}/v1/i18n/translations`, {
                        key: key.key,
                        locale: locale,
                        value: key.t[locale]
                    }, {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        },
                    });
                    console.log('\t translation', locale, 'saved')
                }
            }
            fs.writeFileSync(p, JSON.stringify(key))
        }
    }
}

main();
