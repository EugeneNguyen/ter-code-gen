const { program } = require('commander');
const framework = require('../framework');

program
  .option('-f, --file <file>', 'input file');

program.parse(process.argv);

if (program.file) {
  framework.generate(program.file)
}