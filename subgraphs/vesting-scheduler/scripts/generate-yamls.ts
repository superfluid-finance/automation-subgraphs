const path = require("path");
const fs = require("fs");
const Mustache = require("mustache");

const configsPath = path.resolve(__dirname, "../config");
const templatePath = path.resolve(__dirname, "../subgraph.yaml");

try {
  const template = fs.readFileSync(templatePath, "utf8");

  fs.readdirSync(configsPath).forEach((file: string) => {
    const data = JSON.parse(fs.readFileSync(`${configsPath}/${file}`, "utf-8"));
    const contents = Mustache.render(template, data);
    const [filename] = file.split(".");

    const outputFile =
      filename === "default" ? "subgraph.yaml" : `${filename}.subgraph.yaml`;
    console.info(`✅ Rendering into ${outputFile} done.`);

    fs.writeFileSync(outputFile, contents);
  });
} catch {
  console.error(
    `Something went wrong, probably files in the ${configsPath} folder, or the ${templatePath} are missing`
  );
}
