const axios = require('axios').default;
const keys = require('./keys.json');
const fs = require('fs');
const path = require('path');

const BASE_URL ="https://dev-api-bpms.pouyagaranautomation.com/api";
const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiIwZDE5YWNjZi05ODRlLTQwMjItYTRiZC1jMWY3NmUwZjY3OGIiLCJhY2NvdW50SWQiOiJlYWFlMTdkOC1jOTljLTQwOGQtYWY3Yi0wZGYxYWRkOTBmNjAiLCJlbXBsb3llZUlkIjpudWxsLCJpc0FkbWluIjp0cnVlLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJjaGFuZ2UuaXRAYWRtaW4uY29tIiwicm9sZXMiOltdLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTcxMDU5NzIwMywiZXhwIjoxNzEwNTk5MDAzfQ.sIQtaWBzfKaXbyWTstDhbUCjm46fXq9WO4cOsb5e9Aw";

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
