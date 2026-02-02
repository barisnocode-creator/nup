import { getChaiBuilderTailwindConfig } from "@chaibuilder/sdk/tailwind";

const chaiConfig = getChaiBuilderTailwindConfig(["./src/**/*.{js,ts,jsx,tsx}"]);

export default chaiConfig;
