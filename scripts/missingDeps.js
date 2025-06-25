#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const child_process = require("child_process");

const ROOT_DIR = process.cwd();

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function getAllPackages() {
  const rootPkg = readJSON(path.join(ROOT_DIR, "package.json"));
  const workspaces = rootPkg.workspaces;
  if (!workspaces)
    throw new Error("No workspaces defined in root package.json");

  // Expand all glob patterns like "packages/*"
  const dirs = workspaces.flatMap((pattern) => glob.sync(pattern));
  return dirs
    .map((dir) => {
      const fullPath = path.join(ROOT_DIR, dir);
      const pkgPath = path.join(fullPath, "package.json");
      if (!fs.existsSync(pkgPath)) return null;
      return {
        name: readJSON(pkgPath).name || dir,
        dir: fullPath,
        pkg: readJSON(pkgPath),
      };
    })
    .filter(Boolean);
}

function getImportsFromFile(file) {
  const content = fs.readFileSync(file, "utf-8");
  const importRegex = /(?:import\s.*?from\s+['"]|require\()['"]([^'"]+)['"]/g;
  const deps = new Set();
  let match;
  while ((match = importRegex.exec(content))) {
    const mod = match[1];
    if (!mod.startsWith(".") && !mod.startsWith("/")) {
      const parts = mod.split("/");
      deps.add(mod.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
    }
  }
  return deps;
}

function checkDeps(packageInfo) {
  const allFiles = glob.sync(`${packageInfo.dir}/**/*.{ts,js}`, {
    ignore: ["**/dist/**", "**/node_modules/**"],
  });

  const usedDeps = new Set();
  allFiles.forEach((file) => {
    getImportsFromFile(file).forEach((dep) => usedDeps.add(dep));
  });

  const declaredDeps = new Set([
    ...Object.keys(packageInfo.pkg.dependencies || {}),
    ...Object.keys(packageInfo.pkg.devDependencies || {}),
    ...Object.keys(packageInfo.pkg.peerDependencies || {}),
  ]);

  const missingDeps = [...usedDeps].filter((dep) => !declaredDeps.has(dep));

  if (missingDeps.length > 0) {
    console.log(`❌ ${packageInfo.name} is missing dependencies:`);
    missingDeps.forEach((dep) => console.log(`   - ${dep}`));
    console.log();
  } else {
    console.log(`✅ ${packageInfo.name} is good.`);
  }
}

function main() {
  const packages = getAllPackages();
  packages.forEach(checkDeps);
}

main();
