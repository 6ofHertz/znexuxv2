#!/usr/bin/env node

/**
 * ZURVAN Progress Analyzer
 * 
 * Automatically analyzes git history and updates PROGRESS.md
 * Run: npm run update-progress
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROGRESS_FILE = path.join(__dirname, '..', 'PROGRESS.md');
const DAYS_TO_ANALYZE = 30;

console.log('🔍 Analyzing project progress...\n');

// Helper function to run git commands
function runGit(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch (error) {
    return '';
  }
}

// Get git statistics
function getGitStats() {
  const stats = {
    totalCommits: 0,
    recentCommits: 0,
    contributors: new Set(),
    filesChanged: 0,
    lastCommitDate: '',
    recentActivity: []
  };

  // Total commits
  const totalCommits = runGit('git rev-list --count HEAD');
  stats.totalCommits = parseInt(totalCommits) || 0;

  // Recent commits (last 30 days)
  const since = new Date();
  since.setDate(since.getDate() - DAYS_TO_ANALYZE);
  const sinceDate = since.toISOString().split('T')[0];
  
  const recentCommits = runGit(`git rev-list --count HEAD --since="${sinceDate}"`);
  stats.recentCommits = parseInt(recentCommits) || 0;

  // Contributors
  const contributors = runGit('git log --format="%an" | sort -u');
  contributors.split('\n').forEach(name => {
    if (name) stats.contributors.add(name);
  });

  // Files changed recently
  const filesChanged = runGit(`git log --since="${sinceDate}" --name-only --pretty=format: | sort -u`);
  stats.filesChanged = filesChanged.split('\n').filter(f => f.trim()).length;

  // Last commit date
  const lastCommit = runGit('git log -1 --format="%ai"');
  if (lastCommit) {
    stats.lastCommitDate = new Date(lastCommit).toISOString().split('T')[0];
  }

  // Recent activity (last 10 commits)
  const recentLog = runGit('git log -10 --format="%h|%ai|%s|%an"');
  if (recentLog) {
    stats.recentActivity = recentLog.split('\n').map(line => {
      const [hash, date, message, author] = line.split('|');
      return { hash, date: date ? date.split(' ')[0] : '', message, author };
    });
  }

  return stats;
}

// Analyze file changes by category
function categorizeChanges(stats) {
  const categories = {
    features: [],
    fixes: [],
    docs: [],
    config: [],
    other: []
  };

  stats.recentActivity.forEach(commit => {
    const msg = commit.message.toLowerCase();
    
    if (msg.includes('fix') || msg.includes('bug') || msg.includes('issue')) {
      categories.fixes.push(commit);
    } else if (msg.includes('doc') || msg.includes('readme')) {
      categories.docs.push(commit);
    } else if (msg.includes('config') || msg.includes('setup')) {
      categories.config.push(commit);
    } else if (msg.includes('add') || msg.includes('feature') || msg.includes('implement')) {
      categories.features.push(commit);
    } else {
      categories.other.push(commit);
    }
  });

  return categories;
}

// Generate progress update section
function generateProgressUpdate(stats, categories) {
  const now = new Date().toISOString().split('T')[0];
  
  let update = `# ZURVAN - Project Progress Tracker\n\n`;
  update += `> **Last Auto-Update:** ${now}  \n`;
  update += `> **Status:** ✅ Active Development  \n`;
  update += `> **Version:** 1.0.0\n\n`;
  update += `---\n\n`;
  
  update += `## 📊 Quick Status Overview\n\n`;
  update += `| Category | Status | Details |\n`;
  update += `|----------|--------|----------|\n`;
  update += `| Total Commits | ${stats.totalCommits} | Since project start |\n`;
  update += `| Recent Activity | ${stats.recentCommits} commits | Last ${DAYS_TO_ANALYZE} days |\n`;
  update += `| Contributors | ${stats.contributors.size} | Active developers |\n`;
  update += `| Files Modified | ${stats.filesChanged} | Recently changed |\n`;
  update += `| Last Update | ${stats.lastCommitDate} | Latest commit |\n\n`;
  
  update += `---\n\n`;
  update += `## 🔄 Recent Activity (Last 10 Commits)\n\n`;
  
  if (stats.recentActivity.length > 0) {
    stats.recentActivity.forEach(commit => {
      update += `- **[${commit.hash}]** ${commit.message} _(${commit.date})_\n`;
    });
  } else {
    update += `- No recent commits found\n`;
  }
  
  update += `\n---\n\n`;
  update += `## 📈 Activity Breakdown\n\n`;
  update += `### ✨ New Features (${categories.features.length})\n`;
  if (categories.features.length > 0) {
    categories.features.forEach(c => {
      update += `- ${c.message} _(${c.date})_\n`;
    });
  } else {
    update += `- No new features in recent commits\n`;
  }
  
  update += `\n### 🐛 Bug Fixes (${categories.fixes.length})\n`;
  if (categories.fixes.length > 0) {
    categories.fixes.forEach(c => {
      update += `- ${c.message} _(${c.date})_\n`;
    });
  } else {
    update += `- No bug fixes in recent commits\n`;
  }
  
  update += `\n### 📚 Documentation (${categories.docs.length})\n`;
  if (categories.docs.length > 0) {
    categories.docs.forEach(c => {
      update += `- ${c.message} _(${c.date})_\n`;
    });
  } else {
    update += `- No documentation updates in recent commits\n`;
  }
  
  update += `\n---\n\n`;
  update += `## 👥 Contributors\n\n`;
  stats.contributors.forEach(name => {
    update += `- ${name}\n`;
  });
  
  update += `\n---\n\n`;
  update += `## 🎯 How to Use This Document\n\n`;
  update += `This progress tracker combines:\n`;
  update += `1. **Auto-generated stats** from git history (updates when you run \`npm run update-progress\`)\n`;
  update += `2. **Manual curation** during development sessions\n`;
  update += `3. **Real-time updates** as code is committed\n\n`;
  update += `### Commands:\n`;
  update += `\`\`\`bash\n`;
  update += `# Update progress from git history\n`;
  update += `npm run update-progress\n\n`;
  update += `# View local session notes (not in git)\n`;
  update += `cat .session-log.md\n`;
  update += `\`\`\`\n\n`;
  update += `---\n\n`;
  update += `*Auto-generated by scripts/analyze-progress.js*\n`;
  
  return update;
}

// Main execution
try {
  // Check if we're in a git repository
  const isGitRepo = runGit('git rev-parse --is-inside-work-tree');
  if (!isGitRepo) {
    console.error('❌ Not a git repository. Cannot analyze progress.');
    process.exit(1);
  }

  // Get statistics
  console.log('📊 Gathering git statistics...');
  const stats = getGitStats();
  
  console.log(`   Total commits: ${stats.totalCommits}`);
  console.log(`   Recent commits (${DAYS_TO_ANALYZE} days): ${stats.recentCommits}`);
  console.log(`   Contributors: ${stats.contributors.size}`);
  console.log(`   Files changed: ${stats.filesChanged}`);
  
  // Categorize changes
  console.log('\n🏷️  Categorizing changes...');
  const categories = categorizeChanges(stats);
  
  console.log(`   Features: ${categories.features.length}`);
  console.log(`   Fixes: ${categories.fixes.length}`);
  console.log(`   Docs: ${categories.docs.length}`);
  
  // Generate update
  console.log('\n✍️  Generating progress update...');
  const progressContent = generateProgressUpdate(stats, categories);
  
  // Read existing PROGRESS.md to preserve manual sections
  let existingContent = '';
  if (fs.existsSync(PROGRESS_FILE)) {
    existingContent = fs.readFileSync(PROGRESS_FILE, 'utf-8');
  }
  
  // Write updated content
  // Note: This overwrites the auto-generated sections but preserves manual edits
  // For now, we'll append to keep both auto and manual content
  const separator = '\n\n---\n\n## 📝 MANUALLY CURATED SECTIONS BELOW\n\n';
  
  // Check if manual sections exist
  const manualSectionIndex = existingContent.indexOf('MANUALLY CURATED SECTIONS');
  let manualSections = '';
  if (manualSectionIndex > -1) {
    manualSections = existingContent.substring(manualSectionIndex);
  }
  
  const finalContent = progressContent + (manualSections ? separator + manualSections : '');
  
  fs.writeFileSync(PROGRESS_FILE, finalContent, 'utf-8');
  
  console.log('\n✅ Progress updated successfully!');
  console.log(`   File: ${PROGRESS_FILE}`);
  console.log('\n💡 Tip: Commit this update with your changes to keep progress tracked\n');
  
} catch (error) {
  console.error('\n❌ Error analyzing progress:', error.message);
  process.exit(1);
}
