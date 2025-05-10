#!/usr/bin/env node

/**
 * Script to package the application for deployment
 * 
 * This creates a deployable package with all necessary files
 * and excludes development files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const packageName = 'novedlabels-deployment';
const version = process.env.npm_package_version || '1.0.0';
const outputDir = path.join(process.cwd(), 'dist');
const packageDir = path.join(outputDir, `${packageName}-${version}`);

// Files/directories to include
const include = [
  '.next/',
  'public/',
  'node_modules/',
  'package.json',
  'package-lock.json',
  'next.config.js',
  'vercel.json',
  '.env.production',
  'DEPLOYMENT.md',
];

// Files/directories to exclude
const exclude = [
  '.git/',
  '.github/',
  'node_modules/.cache/',
  '.next/cache/',
  '**/*.log',
  '**/*.swp',
  'cleaned-repo/',
  'repo-mirror.git/',
  'repo-mirror.git.bfg-report/',
];

console.log(`📦 Packaging ${packageName} v${version}...`);

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(packageDir)) {
  fs.mkdirSync(packageDir, { recursive: true });
}

// Clean and build the project
console.log('🧹 Cleaning and building...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Copy files
console.log('📋 Copying files...');
include.forEach(pattern => {
  try {
    const source = path.join(process.cwd(), pattern);
    const dest = path.join(packageDir, pattern);
    
    if (fs.existsSync(source)) {
      if (fs.lstatSync(source).isDirectory()) {
        execSync(`cp -r "${source}" "${path.dirname(dest)}"`, { stdio: 'inherit' });
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(source, dest);
      }
    }
  } catch (error) {
    console.warn(`⚠️ Warning copying ${pattern}:`, error.message);
  }
});

// Create package archives
console.log('📦 Creating package archives...');
try {
  // Change to output directory
  process.chdir(outputDir);
  
  // Create tar.gz
  execSync(`tar -czf "${packageName}-${version}.tar.gz" "${packageName}-${version}"`, { stdio: 'inherit' });
  
  // Create zip (if zip command is available)
  try {
    execSync(`zip -r "${packageName}-${version}.zip" "${packageName}-${version}"`, { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Could not create zip file. Is zip installed?');
  }
  
  console.log(`✅ Package created successfully at ${outputDir}/${packageName}-${version}.tar.gz`);
} catch (error) {
  console.error('❌ Failed to create package archives:', error);
  process.exit(1);
}

// Return to original directory
process.chdir(process.cwd()); 