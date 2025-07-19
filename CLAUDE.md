# Instructions

- Read the DEEPSEEK_API.md file
- Provide a detailed implementation plan for extending this codebase to include DeepSeek models and support the DeepSeek API. Users should be able to chooose a "provider" and "model" from the cli.

## Files to help you navigate and understand this repository

** REPO_MAP.md**

Excerpt from `REPO_MAP.md`:

```bash
## Repository map

#### Here are summaries of some files present in my git repository.
Do not propose changes to these files, treat them as *read-only*.
If you need to edit any of these files, ask me to *add them to the chat* first.


eslint-rules/no-relative-cross-package-imports.js:
⋮
│function findPackageName(filePath, root) {
│  let currentDir = path.dirname(path.resolve(filePath));
│  while (currentDir !== root) {
│    const parentDir = path.dirname(currentDir);
│    const packageJsonPath = path.join(currentDir, 'package.json');
│    if (fs.existsSync(packageJsonPath)) {
│      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
│      return pkg.name;
│    }
│
⋮

integration-tests/test-helper.js:
⋮
│function sanitizeTestName(name) {
│  return name
│
```

**FILE_TREE_MAP.json**

This file contains the full tree list of all files and directories in this repository in JSON format.  Excerpt from `FILE_TREE_MAP.md`:

```json
{
  "type": "directory",
  "name": ".",
  "path": ".",
  "contents": [
    {
      "type": "file",
      "name": "CLAUDE.md",
      "path": "CLAUDE.md"
    },

    ...

    {
      "type": "directory",
      "name": ".gemini",
      "path": "./.gemini",
      "contents": [
        {
          "type": "file",
          "name": "config.yaml",
          "path": ".gemini/config.yaml"
        }
      ]
    },
    ...
```
