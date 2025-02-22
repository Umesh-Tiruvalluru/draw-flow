import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extends: {},
  },
  plugins: [],
};

export default config;
