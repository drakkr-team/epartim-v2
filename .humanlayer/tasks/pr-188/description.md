## Why the change

Locale merging is centralized in a shared workspace package so the client and admin apps generate translations consistently during installation, builds, and development.

## Special things to note

- The app-specific merge scripts and their `concurrently` and `nodemon` watchers are replaced by the package CLI and Vite plugin.
- Locale JSON parse errors are logged while the remaining files continue to merge.
- The CI Biome version is aligned with the repository dependency version.

## Change outline

The shared package owns locale discovery and merging, then exposes the same behavior through command-line and Vite entry points.

```text
packages/i18next-merger/
├── src/core.ts       # finds locale files, deep-merges JSON, and writes one file per locale
├── src/cli.ts        # exposes merge options for postinstall and manual runs
├── src/vite.ts       # merges at build start and watches locale changes in development
├── package.json      # publishes workspace, CLI, core, and Vite entry points
└── tsconfig.json     # applies strict package type checking
```

Both frontend apps now use the shared package instead of maintaining identical scripts and watcher processes.

```diff
 client / admin
-  postinstall -> app-specific compile-locales.js
-  development -> Vite + nodemon locale watcher
+  postinstall -> i18next-merger CLI
+  build start -> i18next-merger Vite plugin
+  locale add/change/unlink -> merge through the Vite watcher
```

The merge flow is shared across both entry points.

```text
MergeOptions { locales, glob, outputDir }
  for each locale
    find <glob>/<locale>.json
    parse and deep-merge matching files
    write <outputDir>/<locale>.json
```
