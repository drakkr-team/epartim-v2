#!/usr/bin/env node

import { program } from "commander";

import merge from "./core.ts";

program.name("i18next-merger").description("Merge i18next JSON locale files");

program
	.requiredOption("-l, --locales [locales...]", "Array of locale codes to merge")
	.requiredOption("-g, --glob <glob>", "Glob pattern to match JSON files")
	.requiredOption("-o, --output-dir <outputDir>", "Directory to output merged JSON files");

program.parse();

const { locales, glob, outputDir } = program.opts();

merge({ locales, glob, outputDir });
