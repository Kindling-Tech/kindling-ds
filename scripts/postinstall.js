#!/usr/bin/env node

/**
 * Symlinks design skills from @kindling/ds into the consuming repo's
 * .claude/skills/ directory so they appear as slash commands in Claude Code.
 *
 * Runs automatically via npm postinstall.
 */

import { existsSync, mkdirSync, symlinkSync, unlinkSync, lstatSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '..');
const skillsSource = join(packageRoot, 'skills');

// Walk up from node_modules/@kindling/ds to find the consuming repo root
const repoRoot = resolve(packageRoot, '..', '..', '..');
const targetDir = join(repoRoot, '.claude', 'skills');

// Safety check: don't run if we're not inside node_modules
if (!packageRoot.includes('node_modules')) {
  process.exit(0);
}

// Ensure .claude/skills/ exists
mkdirSync(targetDir, { recursive: true });

// Symlink each skill directory
const skills = readdirSync(skillsSource, { withFileTypes: true })
  .filter(entry => entry.isDirectory());

for (const skill of skills) {
  const source = join(skillsSource, skill.name);
  const target = join(targetDir, skill.name);

  // Remove existing symlink or directory at target
  if (existsSync(target)) {
    const stat = lstatSync(target);
    if (stat.isSymbolicLink()) {
      unlinkSync(target);
    } else {
      // Don't overwrite a real directory — the repo may have its own version
      continue;
    }
  }

  symlinkSync(source, target, 'dir');
}
