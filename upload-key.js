const axios = require("axios").default;
const keys = require("./keys.json");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://dev-api-bpms.pouyagaranautomation.com/api";
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfIjoiVXNlclRva2VuIiwic2Vzc2lvbklkIjoiYzRkZDU4MjAtMWU3ZC00MDI1LTk4NGItNTE2NDk2NzEyOGE2IiwiYWNjb3VudElkIjoiODA1YWMwOGEtY2MzMS00YjFhLWFlNzEtNDI1MjMwNzliZGY3IiwiZW1wbG95ZWVJZCI6ImNjNTI1NDY1LTkzZjUtNGJiNC1iOTQyLTIxMTI5YjlmZDIwYiIsImlzQWRtaW4iOnRydWUsInJvbGVzIjpbImI4ZGU5ODAxLTk4YjktNDdiMS04OTU3LTE2OGRjOTNkY2U5MCJdLCJwZXJtaXNzaW9ucyI6WyJocm06cmVhZC1vcmdhbml6YXRpb25hbC1oaWVyYXJjaGllcyIsImhybTpjcmVhdGUtb3JnYW5pemF0aW9uYWwtaGllcmFyY2hpZXMiLCJocm06dXBkYXRlLW9yZ2FuaXphdGlvbmFsLWhpZXJhcmNoaWVzIiwiaHJtOmRlbGV0ZS1vcmdhbml6YXRpb25hbC1oaWVyYXJjaGllcyIsImhybTpyZWFkLW9yZ2FuaXphdGlvbmFsLXN0cnVjdHVyZXMiLCJocm06Y3JlYXRlLW9yZ2FuaXphdGlvbmFsLXN0cnVjdHVyZXMiLCJocm06dXBkYXRlLW9yZ2FuaXphdGlvbmFsLXN0cnVjdHVyZXMiLCJocm06ZGVsZXRlLW9yZ2FuaXphdGlvbmFsLXN0cnVjdHVyZXMiLCJocm06cmVhZC1wb3NpdGlvbnMiLCJocm06Y3JlYXRlLXBvc2l0aW9ucyIsImhybTp1cGRhdGUtcG9zaXRpb25zIiwiaHJtOmRlbGV0ZS1wb3NpdGlvbnMiLCJocm06cmVhZC1yb2xlcyIsImhybTpjcmVhdGUtcm9sZXMiLCJocm06dXBkYXRlLXJvbGVzIiwiaHJtOmRlbGV0ZS1yb2xlcyIsImhybTpyZWFkLWVtcGxveWVlcyIsImhybTpjcmVhdGUtZW1wbG95ZWVzIiwiaHJtOnVwZGF0ZS1lbXBsb3llZXMiLCJocm06ZGVsZXRlLWVtcGxveWVlcyIsImJwbXM6cmVhZC1zZXJ2aWNlLWJ1aWxkZXIiLCJicG1zOmNyZWF0ZS1zZXJ2aWNlLWJ1aWxkZXIiLCJicG1zOnVwZGF0ZS1zZXJ2aWNlLWJ1aWxkZXIiLCJicG1zOmRlbGV0ZS1zZXJ2aWNlLWJ1aWxkZXIiLCJicG1zOnJlYWQtZW50aXR5IiwiYnBtczpjcmVhdGUtZW50aXR5IiwiYnBtczp1cGRhdGUtZW50aXR5IiwiYnBtczpkZWxldGUtZW50aXR5IiwiYnBtczpyZWFkLWZvcm0iLCJicG1zOmNyZWF0ZS1mb3JtIiwiYnBtczp1cGRhdGUtZm9ybSIsImJwbXM6ZGVsZXRlLWZvcm0iLCJicG1zOnJlYWQtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczpjcmVhdGUtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczp1cGRhdGUtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczpkZWxldGUtd29ya2Zsb3ctc3RhdHVzIiwiYnBtczpyZWFkLXdvcmtmbG93IiwiYnBtczpjcmVhdGUtd29ya2Zsb3ciLCJicG1zOnVwZGF0ZS13b3JrZmxvdyIsImJwbXM6ZGVsZXRlLXdvcmtmbG93IiwiYnBtczpyZWFkLXRhYmxlIiwiYnBtczpjcmVhdGUtdGFibGUiLCJicG1zOnVwZGF0ZS10YWJsZSIsImJwbXM6ZGVsZXRlLXRhYmxlIiwiYnBtczpyZWFkLXJlbGF0aW9uIiwiYnBtczpjcmVhdGUtcmVsYXRpb24iLCJicG1zOnVwZGF0ZS1yZWxhdGlvbiIsImJwbXM6ZGVsZXRlLXJlbGF0aW9uIiwiYWNjb3VudHMtbWFuYWdlbWVudDpyZWFkLWFjY291bnRzIiwiYWNjb3VudHMtbWFuYWdlbWVudDpjcmVhdGUtYWNjb3VudCIsImFjY291bnRzLW1hbmFnZW1lbnQ6dXBkYXRlLWFjY291bnQiLCJhY2NvdW50cy1tYW5hZ2VtZW50OmRlbGV0ZS1hY2NvdW50IiwiYWNjb3VudHMtbWFuYWdlbWVudDp1cGRhdGUtcGVybWlzc2lvbnMiLCJpMThuOm1hbmFnZS1sYW5ndWFnZXMiLCJpMThuOm1hbmFnZS10cmFuc2xhdGlvbiJdLCJpYXQiOjE3MTkzMjEzMzUsImV4cCI6MTcxOTMyMzEzNX0.FM2CmZyWWxVz83IDMJK3lETImJO5C8zPzJBaQ2qqquc";

async function main() {
  if (!fs.existsSync("keys")) {
    fs.mkdirSync("keys");
  }
  for (const key of keys) {
    const p = path.join("keys", `${key.key}.json`);
    if (
      !fs.existsSync(p) ||
      JSON.stringify(key) !== fs.readFileSync(p).toString()
    ) {
      await axios.put(
        `${BASE_URL}/v1/i18n/translation-key`,
        {
          key: key.key,
          namespaces: key.namespaces,
          multiLine: key.multiLine,
          maxLength: key.maxLength,
        },
        {
          headers: {
            Authorization: "Bearer custom-token-23456789",
          },
        }
      );
      console.log("key", key.key, "saved");
      if (key.t) {
        for (const locale in key.t) {
          await axios.put(
            `${BASE_URL}/v1/i18n/translations`,
            {
              key: key.key,
              locale: locale,
              value: key.t[locale],
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          console.log("\t translation", locale, "saved");
        }
      }
      fs.writeFileSync(p, JSON.stringify(key));
    }
  }
}

main();
