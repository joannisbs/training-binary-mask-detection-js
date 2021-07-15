const { join } = require('path');
const { readdirSync, renameSync } = require('fs');
// const [dir, search, replace] = process.argv.slice(2);

const dir = '../with_mask'
const search = '.+[\.]'
const replace = '.'
const match = RegExp(search, 'g');
const files = readdirSync(dir);


const count = 0
files
  // .filter(file => file.match(match))
  .forEach(file => {
    const filePath = join(dir, file);
    const newFilePath = join(dir, file.replace(match, count + replace));
    count ++;
    renameSync(filePath, newFilePath);
  });