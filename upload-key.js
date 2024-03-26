const axios = require('axios').default;
const keys = require('./keys.json');
const fs = require('fs');
const path = require('path');

const BASE_URL ="https://dev-api-bpms.pouyagaranautomation.com/api";
const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJhNTk2ZmJlMi0xNWQzLTQ4MDMtODk4ZC1mZmQxMjhiZTg1NjAiLCJhY2NvdW50SWQiOiI4MDVhYzA4YS1jYzMxLTRiMWEtYWU3MS00MjUyMzA3OWJkZjciLCJlbXBsb3llZUlkIjoiY2M1MjU0NjUtOTNmNS00YmI0LWI5NDItMjExMjliOWZkMjBiIiwiaXNBZG1pbiI6dHJ1ZSwidXNlcm5hbWUiOiJzLnNvbHRhbmkiLCJlbWFpbCI6InMuc29sdGFuaUBnbWFpbC5jb20iLCJyb2xlcyI6WyJiOGRlOTgwMS05OGI5LTQ3YjEtODk1Ny0xNjhkYzkzZGNlOTAiXSwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE3MTE0MzM5NjAsImV4cCI6MTcxMTQzNTc2MH0.Kmj8D05O3db9X6Qy3vnoJXlrIBRoSD8QTpnANf10-rI";

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
