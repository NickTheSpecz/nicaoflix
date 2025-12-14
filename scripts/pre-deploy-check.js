#!/usr/bin/env node

/**
 * Pre-Deployment Check Script for NicãoFlix
 * 
 * Runs a series of checks before deploying to ensure everything is ready
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NicãoFlix Pre-Deployment Check\n');
console.log('Running comprehensive checks before deployment...\n');

let hasErrors = false;
let hasWarnings = false;

// Helper function to run commands
function runCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`);
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ ${description} - PASSED\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - FAILED`);
    console.error(error.stdout?.toString() || error.message);
    console.log('');
    return false;
  }
}

// Helper function to check file exists
function checkFileExists(filePath, description) {
  console.log(`⏳ Checking ${description}...`);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} - EXISTS\n`);
    return true;
  } else {
    console.error(`❌ ${description} - NOT FOUND`);
    console.error(`   Expected at: ${filePath}\n`);
    return false;
  }
}

// 1. Check required files
console.log('📁 Checking Required Files\n');
const requiredFiles = [
  ['package.json', 'Package configuration'],
  ['next.config.mjs', 'Next.js configuration'],
  ['tsconfig.json', 'TypeScript configuration'],
  ['tailwind.config.ts', 'Tailwind configuration'],
  ['vercel.json', 'Vercel configuration'],
  ['.env.example', 'Environment example file'],
];

requiredFiles.forEach(([file, desc]) => {
  if (!checkFileExists(file, desc)) {
    hasErrors = true;
  }
});

// 2. Check TypeScript
console.log('🔍 TypeScript Check\n');
if (!runCommand('npx tsc --noEmit', 'TypeScript compilation')) {
  hasErrors = true;
}

// 3. Check ESLint
console.log('🔍 ESLint Check\n');
if (!runCommand('npm run lint', 'ESLint validation')) {
  hasWarnings = true; // Lint warnings shouldn't block deployment
}

// 4. Run Tests
console.log('🧪 Running Tests\n');
if (!runCommand('npm run test', 'Test suite')) {
  hasErrors = true;
}

// 5. Check Build
console.log('🏗️  Building Application\n');
if (!runCommand('npm run build', 'Production build')) {
  hasErrors = true;
}

// 6. Check package.json scripts
console.log('📦 Checking Package Scripts\n');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'lint', 'test'];
let scriptsOk = true;

requiredScripts.forEach(script => {
  if (!packageJson.scripts[script]) {
    console.error(`❌ Missing script: ${script}`);
    scriptsOk = false;
    hasErrors = true;
  }
});

if (scriptsOk) {
  console.log('✅ All required scripts present\n');
}

// 7. Check dependencies
console.log('📚 Checking Dependencies\n');
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'typescript',
  '@vercel/analytics',
  '@vercel/speed-insights'
];

let depsOk = true;
requiredDeps.forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    console.error(`❌ Missing dependency: ${dep}`);
    depsOk = false;
    hasErrors = true;
  }
});

if (depsOk) {
  console.log('✅ All required dependencies present\n');
}

// 8. Check environment variables documentation
console.log('🔐 Checking Environment Documentation\n');
if (checkFileExists('.env.example', 'Environment example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_SITE_URL',
  ];
  
  let envVarsOk = true;
  requiredEnvVars.forEach(envVar => {
    if (!envExample.includes(envVar)) {
      console.error(`⚠️  Missing in .env.example: ${envVar}`);
      envVarsOk = false;
      hasWarnings = true;
    }
  });
  
  if (envVarsOk) {
    console.log('✅ All required environment variables documented\n');
  }
}

// 9. Check build output
console.log('📊 Checking Build Output\n');
if (fs.existsSync('.next')) {
  const stats = fs.statSync('.next');
  console.log('✅ Build output exists');
  console.log(`   Created: ${stats.mtime.toLocaleString()}\n`);
} else {
  console.error('❌ Build output not found\n');
  hasErrors = true;
}

// 10. Check for common issues
console.log('🔍 Checking for Common Issues\n');

// Check for console.logs in production code (warning only)
try {
  const result = execSync('git grep -n "console.log" -- "*.ts" "*.tsx" ":(exclude)*.test.*" ":(exclude)*.example.*" ":(exclude)scripts/*"', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  if (result) {
    console.log('⚠️  Found console.log statements in production code:');
    console.log(result);
    console.log('   Consider removing or using console.error/warn\n');
    hasWarnings = true;
  }
} catch (error) {
  // No console.logs found (grep returns non-zero when no matches)
  if (error.status === 1) {
    console.log('✅ No console.log statements in production code\n');
  }
}

// Summary
console.log('═'.repeat(60));
console.log('📋 Pre-Deployment Check Summary\n');

if (hasErrors) {
  console.log('❌ FAILED - Critical errors found');
  console.log('   Please fix the errors above before deploying\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  PASSED WITH WARNINGS');
  console.log('   Review warnings above, but deployment can proceed\n');
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED');
  console.log('   Ready for deployment!\n');
  console.log('Next steps:');
  console.log('1. Commit your changes: git add . && git commit -m "Ready for deployment"');
  console.log('2. Push to GitHub: git push origin main');
  console.log('3. Vercel will automatically deploy\n');
  console.log('Or deploy manually:');
  console.log('   vercel --prod\n');
  process.exit(0);
}
