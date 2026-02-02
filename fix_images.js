const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'frontend/public/images');
const seedFile = path.join(__dirname, 'backend/prisma/seed.ts');

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            // Rename directory to lowercase
            const lowerName = file.toLowerCase();
            if (file !== lowerName) {
                const newPath = path.join(dir, lowerName);
                fs.renameSync(filePath, newPath);
                console.log(`Renamed dir: ${file} -> ${lowerName}`);
                walk(newPath);
            } else {
                walk(filePath);
            }
        } else {
            // Rename file to lowercase
            const lowerName = file.toLowerCase();
            if (file !== lowerName) {
                const newPath = path.join(dir, lowerName);
                fs.renameSync(filePath, newPath);
                console.log(`Renamed file: ${file} -> ${lowerName}`);
            }
        }
    });
}

// 1. Lowercase all files and folders in imagesDir
console.log('Renaming files to lowercase...');
try {
    walk(imagesDir);
} catch (e) {
    console.error('Error renaming files:', e);
}

// 2. Update seed.ts
console.log('Updating seed.ts...');
let seedContent = fs.readFileSync(seedFile, 'utf8');

// Regex to find image paths: /images/...
// We will replace the WHOLE path with its lowercase version
seedContent = seedContent.replace(/['"]\/images\/[^'"]+['"]/g, (match) => {
    return match.toLowerCase();
});

fs.writeFileSync(seedFile, seedContent);
console.log('Updated seed.ts with lowercase paths.');
