const fs = require('fs');
const path = require('path');
const dot = require('dot');

const generate = (genPath) => {
  const absPath = correctPath(genPath);
  const gen = readJSON(absPath);
  const typeConfig = readType(gen.type);
  for (const file of typeConfig.files) {
    const output = convert(gen, `${gen.type}/${file.template}`);
    write(output, absPath, file.output);
  }
};

const write = (data, inputPath, filename) => {
  const dirname = path.dirname(inputPath);
  const absOutputPath = path.join(dirname, filename);
  fs.writeFileSync(absOutputPath, data);
}

const readType = type => {
  const absPath = path.join(__dirname, '../templates', type, 'index.json');
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  return JSON.parse(fileContent);
}

const readJSON = inputPath => {
  const fileContent = fs.readFileSync(inputPath, 'utf-8');
  return JSON.parse(fileContent);
};

const convert = (input, templatePath) => {
  const templateString = readTemplate(templatePath);
  const templateFn = dot.template(templateString, {
    ...dot.templateSettings,
    strip: false
  });
  return templateFn(input);
};

const readTemplate = inputPath => {
  const absPath = path.join(__dirname, '../templates', inputPath);
  return fs.readFileSync(absPath, 'utf-8');
};

const correctPath = inputPath => {
  if (fs.existsSync(inputPath)) {
    return inputPath;
  }
  let absPath = path.join(process.cwd(), inputPath);
  if (fs.existsSync(absPath)) {
    return absPath;
  }
  return null
};

module.exports = generate;
