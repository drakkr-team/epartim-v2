import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

function getAbsolutePath(value: string) {
	return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	framework: getAbsolutePath("@storybook/react-vite"),
	addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
	docs: {
		defaultName: "Documentation",
	},
};

export default config;
