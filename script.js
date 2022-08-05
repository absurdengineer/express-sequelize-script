#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// App name is mandatory

if (process.argv.length < 3) {
  console.log("Please specify the project name:");
  console.log(
    "\x1b[36m   npx create-express-sequelize-app \x1b[32m <project-name> \x1b[0m"
  );
  console.log("\nFor example:");
  console.log(
    "\x1b[36m   npx create-express-sequelize-app \x1b[32m my-express-sequelize-app \x1b[0m"
  );
  process.exit(1);
}

// Store data in variables

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/webformulator/express-sequelize.git";

// Verify project name is available

try {
  fs.mkdirSync(projectPath);
  console.log(
    `\nCreating a new Express app in \x1b[32m${projectPath}\x1b[0m.\n`
  );
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      `The directory \x1b[31m${projectName}\x1b[0m already exists.\n`
    );
    console.log(
      `Either try using a different project name, or remove the already existing directory.`
    );
  } else console.log(error);
  process.exit(1);
}

// main() function responsible for everything

async function main() {
  try {
    console.log("Downloading files...\n");
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    const package = require(`${projectPath}/package.json`);

    const newPackage = {
      name: projectName,
      version: package.version,
      main: package.main,
      scripts: package.scripts,
      author: "",
      license: package.license,
      dependencies: package.dependencies,
      devDependencies: package.devDependencies,
    };

    fs.writeFileSync(
      `${projectPath}/package.json`,
      JSON.stringify(newPackage, null, 4)
    );

    console.log("\nInstalling packages. This might take a couple of minutes.");
    console.log(
      "Installing",
      "\x1b[36mexpress\x1b[0m, \x1b[36msequelize\x1b[0m, \x1b[36mnodemon\x1b[0m with \x1b[36mcesa-template\x1b[0m \n"
    );
    execSync("npm install");

    console.log("Removing useless files\n");
    execSync("npx rimraf ./.git");

    console.log(`Success! Created ${projectName} at ${projectPath}`);
    console.log("Inside that directory, you can run several commands:\n");
    console.log("\x1b[36m   npm start \x1b[0m");
    console.log("      Starts the app\n");
    console.log("\x1b[36m   npm start:dev \x1b[0m");
    console.log("      Starts the app in development mode\n");
    console.log("We suggest that you begin by typing:\n");
    console.log(`\x1b[36m   cd\x1b[0m ${projectName}`);
    console.log("\x1b[36m   npm start\x1b[0m\n");
    console.log("Keep formulating!\n");
    console.log(
      "\x1b[36mNote:\x1b[0m Don't forget to install psql/mysql2/other package based on your database choice!"
    );
    console.log(
      `\x1b[32mHelp:\x1b[0m Git Repository created by Webformulator can be found at ${git_repo}`
    );
  } catch (error) {
    console.log(error);
  }
}

// Calling the main()

main();
