const axios = require('axios').default;
const keys = require('./keys.json');
const fs = require('fs');
const path = require('path');

const BASE_URL ="https://dev-api-bpms.pouyagaranautomation.com/api";
const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiIxZWIyYWJhMy1hODQwLTQwNzUtYjU4NS1lNTJhYTI1OGQ2NzAiLCJhY2NvdW50SWQiOiI4MDVhYzA4YS1jYzMxLTRiMWEtYWU3MS00MjUyMzA3OWJkZjciLCJlbXBsb3llZUlkIjoiY2M1MjU0NjUtOTNmNS00YmI0LWI5NDItMjExMjliOWZkMjBiIiwiaXNBZG1pbiI6dHJ1ZSwidXNlcm5hbWUiOiJzLnNvbHRhbmkiLCJlbWFpbCI6InMuc29sdGFuaUBnbWFpbC5jb20iLCJyb2xlcyI6WyJiOGRlOTgwMS05OGI5LTQ3YjEtODk1Ny0xNjhkYzkzZGNlOTAiXSwicGVybWlzc2lvbnMiOlsiaHJtOnJlYWQtb3JnYW5pemF0aW9uYWwtaGllcmFyY2hpZXMiLCJocm06Y3JlYXRlLW9yZ2FuaXphdGlvbmFsLWhpZXJhcmNoaWVzIiwiaHJtOnVwZGF0ZS1vcmdhbml6YXRpb25hbC1oaWVyYXJjaGllcyIsImhybTpkZWxldGUtb3JnYW5pemF0aW9uYWwtaGllcmFyY2hpZXMiLCJocm06cmVhZC1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOmNyZWF0ZS1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOnVwZGF0ZS1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOmRlbGV0ZS1vcmdhbml6YXRpb25hbC1zdHJ1Y3R1cmVzIiwiaHJtOnJlYWQtcG9zaXRpb25zIiwiaHJtOmNyZWF0ZS1wb3NpdGlvbnMiLCJocm06dXBkYXRlLXBvc2l0aW9ucyIsImhybTpkZWxldGUtcG9zaXRpb25zIiwiaHJtOnJlYWQtcm9sZXMiLCJocm06Y3JlYXRlLXJvbGVzIiwiaHJtOnVwZGF0ZS1yb2xlcyIsImhybTpkZWxldGUtcm9sZXMiLCJocm06cmVhZC1lbXBsb3llZXMiLCJocm06Y3JlYXRlLWVtcGxveWVlcyIsImhybTp1cGRhdGUtZW1wbG95ZWVzIiwiaHJtOmRlbGV0ZS1lbXBsb3llZXMiLCJicG1zOnJlYWQtc2VydmljZS1idWlsZGVyIiwiYnBtczpjcmVhdGUtc2VydmljZS1idWlsZGVyIiwiYnBtczp1cGRhdGUtc2VydmljZS1idWlsZGVyIiwiYnBtczpkZWxldGUtc2VydmljZS1idWlsZGVyIiwiYnBtczpyZWFkLWVudGl0eSIsImJwbXM6Y3JlYXRlLWVudGl0eSIsImJwbXM6dXBkYXRlLWVudGl0eSIsImJwbXM6ZGVsZXRlLWVudGl0eSIsImJwbXM6cmVhZC1mb3JtIiwiYnBtczpjcmVhdGUtZm9ybSIsImJwbXM6dXBkYXRlLWZvcm0iLCJicG1zOmRlbGV0ZS1mb3JtIiwiYnBtczpyZWFkLXdvcmtmbG93LXN0YXR1cyIsImJwbXM6Y3JlYXRlLXdvcmtmbG93LXN0YXR1cyIsImJwbXM6dXBkYXRlLXdvcmtmbG93LXN0YXR1cyIsImJwbXM6ZGVsZXRlLXdvcmtmbG93LXN0YXR1cyIsImJwbXM6cmVhZC13b3JrZmxvdyIsImJwbXM6Y3JlYXRlLXdvcmtmbG93IiwiYnBtczp1cGRhdGUtd29ya2Zsb3ciLCJicG1zOmRlbGV0ZS13b3JrZmxvdyIsImJwbXM6cmVhZC10YWJsZSIsImJwbXM6Y3JlYXRlLXRhYmxlIiwiYnBtczp1cGRhdGUtdGFibGUiLCJicG1zOmRlbGV0ZS10YWJsZSIsImJwbXM6cmVhZC1yZWxhdGlvbiIsImJwbXM6Y3JlYXRlLXJlbGF0aW9uIiwiYnBtczp1cGRhdGUtcmVsYXRpb24iLCJicG1zOmRlbGV0ZS1yZWxhdGlvbiIsImFjY291bnRzLW1hbmFnZW1lbnQ6cmVhZC1hY2NvdW50cyIsImFjY291bnRzLW1hbmFnZW1lbnQ6Y3JlYXRlLWFjY291bnQiLCJhY2NvdW50cy1tYW5hZ2VtZW50OnVwZGF0ZS1hY2NvdW50IiwiYWNjb3VudHMtbWFuYWdlbWVudDpkZWxldGUtYWNjb3VudCIsImFjY291bnRzLW1hbmFnZW1lbnQ6dXBkYXRlLXBlcm1pc3Npb25zIiwiaTE4bjptYW5hZ2UtbGFuZ3VhZ2VzIiwiaTE4bjptYW5hZ2UtdHJhbnNsYXRpb24iXSwiaWF0IjoxNzEzNjk2MDg2LCJleHAiOjE3MTM2OTc4ODZ9.Jax9vn1rFXHX8q6EG-oM4BneHijQENTSimM-ucLDmDY";

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
