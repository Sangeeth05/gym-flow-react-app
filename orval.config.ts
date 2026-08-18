import { defineConfig } from "orval";

export default defineConfig({
  gymflow: {
    input: {
      // Your API must be running locally for this to fetch the live spec.
      // Swap to a checked-in swagger.json file if you'd rather not require
      // the backend to be running every time you regenerate.
      target: "http://localhost:55282/swagger/v1/swagger.json",
    },
    output: {
      mode: "tags-split", // one folder per controller (Auth, Members, Gyms, ...)
      target: "src/api/generated",
      schemas: "src/api/generated/models",
      client: "react-query", // generates TanStack Query hooks
      httpClient: "axios",
      override: {
        mutator: {
          // Points generated calls through YOUR existing axios instance,
          // so your JWT interceptor / refresh-token logic still applies.
          path: "./src/api/axios-mutator.ts",
          name: "axiosInstance",
        },
      },
    },
  },
});
