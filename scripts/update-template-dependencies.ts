/**
 * Script to update dependencies in starter templates to their latest versions
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

// Template paths from lib/template.ts
const TEMPLATE_PATHS = {
  REACT: 'starters/react-ts',
  NEXTJS: 'starters/nextjs',
  EXPRESS: 'starters/express-simple',
  VUE: 'starters/vue',
  HONO: 'starters/hono-nodejs-starter',
  ANGULAR: 'starters/angular',
};

async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`npm view ${packageName} version`);
    return stdout.trim();
  } catch (error) {
    console.error(`Failed to fetch version for ${packageName}`);
    return '';
  }
}

async function updateDependencies(
  dependencies: Record<string, string> | undefined
): Promise<Record<string, string>> {
  if (!dependencies) return {};

  const updatedDeps: Record<string, string> = {};

  for (const [pkg, currentVersion] of Object.entries(dependencies)) {
    console.log(`Checking ${pkg}...`);

    // Skip workspace/file dependencies
    if (
      currentVersion.startsWith('workspace:') ||
      currentVersion.startsWith('file:') ||
      currentVersion.startsWith('link:')
    ) {
      updatedDeps[pkg] = currentVersion;
      continue;
    }

    try {
      const latestVersion = await getLatestVersion(pkg);

      if (latestVersion) {
        const prefix = currentVersion.match(/^[~^]/) ? currentVersion[0] : '^';
        updatedDeps[pkg] = `${prefix}${latestVersion}`;

        if (currentVersion !== `${prefix}${latestVersion}`) {
          console.log(`  ✓ ${pkg}: ${currentVersion} → ${prefix}${latestVersion}`);
        } else {
          console.log(`  - ${pkg}: already up to date`);
        }
      } else {
        updatedDeps[pkg] = currentVersion;
        console.log(`  ! ${pkg}: could not fetch latest version`);
      }
    } catch (error) {
      console.error(`  ✗ ${pkg}: error updating`);
      updatedDeps[pkg] = currentVersion;
    }
  }

  return updatedDeps;
}

async function processTemplate(
  templateName: string,
  templatePath: string
): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing ${templateName} template...`);
  console.log(`${'='.repeat(60)}\n`);

  const packageJsonPath = path.join(process.cwd(), templatePath, 'package.json');

  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    console.log(`Current package: ${packageJson.name}@${packageJson.version}\n`);

    if (packageJson.dependencies) {
      console.log('Updating dependencies...');
      packageJson.dependencies = await updateDependencies(packageJson.dependencies);
    }

    if (packageJson.devDependencies) {
      console.log('\nUpdating devDependencies...');
      packageJson.devDependencies = await updateDependencies(packageJson.devDependencies);
    }

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf-8'
    );

    console.log(`\n✓ Successfully updated ${templateName} template!`);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      console.error(`✗ package.json not found at ${packageJsonPath}`);
    } else {
      console.error(`✗ Error processing ${templateName}:`, error);
    }
  }
}

async function main() {
  console.log('Starting template dependency updates...\n');

  const args = process.argv.slice(2);
  const specificTemplate = args[0];

  if (specificTemplate) {
    const templatePath = TEMPLATE_PATHS[specificTemplate as keyof typeof TEMPLATE_PATHS];
    if (templatePath) {
      await processTemplate(specificTemplate, templatePath);
    } else {
      console.error(
        `Template "${specificTemplate}" not found. Available: ${Object.keys(TEMPLATE_PATHS).join(', ')}`
      );
      process.exit(1);
    }
  } else {
    for (const [templateName, templatePath] of Object.entries(TEMPLATE_PATHS)) {
      await processTemplate(templateName, templatePath);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('All templates processed!');
  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});