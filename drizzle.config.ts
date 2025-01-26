export default {
  dialect: "postgresql",
  schema: "./src/utils/schema.tsx",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.VITE_DATA_BASE_URL,
    connectionString: process.env.VITE_DATA_BASE_URL,
  },
};
