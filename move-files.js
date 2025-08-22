const fs = require('fs');
const path = require('path');

// Função para mover arquivos recursivamente
function moveFilesRecursively(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      moveFilesRecursively(sourcePath, targetPath);
    } else {
      // Mover arquivo
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Moved: ${file}`);
    }
  });
}

// Mover arquivos de docs/browser para docs
const browserDir = path.join(__dirname, 'docs', 'browser');
const docsDir = path.join(__dirname, 'docs');

if (fs.existsSync(browserDir)) {
  console.log('Moving files from browser/ to docs/...');
  moveFilesRecursively(browserDir, docsDir);

  // Remover pasta browser vazia
  fs.rmSync(browserDir, { recursive: true, force: true });
  console.log('Removed empty browser/ folder');

  console.log('Files moved successfully!');
} else {
  console.log('Browser directory not found. Run npm run build:gh-pages first.');
}
