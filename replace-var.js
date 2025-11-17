import fs from 'fs';
import path from 'path';

const srcDir = path.join(__dirname, 'src');

// 获取所有.ts文件
const getTSFiles = (dir) => {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = [...files, ...getTSFiles(fullPath)];
    } else if (entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
};

const tsFiles = getTSFiles(srcDir);

// 替换var为let
tsFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\bvar\b/g, 'let');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
});

console.log('All files updated successfully!');