const path = require("path");
const fs = require("fs");
const Mustache = require("mustache");

const configsPath = path.resolve(__dirname, "../config");
const templatePath = path.resolve(__dirname, "../subgraph.template.yaml");
const specificConfig = process.argv[2];

try {
  const template = fs.readFileSync(templatePath, "utf8");

  if (specificConfig) {
    const configFile = specificConfig.endsWith('.json') ? specificConfig : `${specificConfig}.json`;
    const configFilePath = path.join(configsPath, configFile);
    
    if (!fs.existsSync(configFilePath)) {
      console.error(`Config file '${configFile}' not found`);
      process.exit(1);
    }
    
    const data = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    const contents = Mustache.render(template, data);
    const [filename] = configFile.split(".");
    const outputFile = filename === "default" ? "subgraph.yaml" : `${filename}.subgraph.yaml`;
    
    fs.writeFileSync(outputFile, contents);
  } else {
    fs.readdirSync(configsPath).forEach((file: string) => {
      if (!file.endsWith('.json')) return;
      
      const data = JSON.parse(fs.readFileSync(`${configsPath}/${file}`, "utf-8"));
      const contents = Mustache.render(template, data);
      const [filename] = file.split(".");
      const outputFile = filename === "default" ? "subgraph.yaml" : `${filename}.subgraph.yaml`;
      
      fs.writeFileSync(outputFile, contents);
    });
  }
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
