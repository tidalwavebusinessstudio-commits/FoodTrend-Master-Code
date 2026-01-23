#!/usr/bin/env node

/**
 * Tool Suggester
 * 
 * Usage: node tool-suggester.js "your task description"
 * Example: node tool-suggester.js "compress images"
 * 
 * Reads TOOLS_REGISTRY.md and suggests the best FREE tool for your task.
 */

const fs = require('fs');
const path = require('path');

// Tool database (extracted from TOOLS_REGISTRY.md)
// In a real implementation, this would parse the markdown file
const TOOLS = [
    {
        name: 'Squoosh',
        category: 'images',
        keywords: ['compress', 'optimize', 'reduce', 'smaller', 'image', 'photo', 'picture'],
        cost: 'FREE',
        setup: 'READY NOW',
        url: 'https://squoosh.app',
        description: 'Makes big pictures tiny without making them ugly'
    },
    {
        name: 'Remove.bg',
        category: 'images',
        keywords: ['background', 'remove', 'transparent', 'logo', 'png'],
        cost: 'FREE (50/mo)',
        setup: 'READY NOW',
        url: 'https://remove.bg',
        description: 'Removes backgrounds from photos automatically'
    },
    {
        name: 'Browser DevTools',
        category: 'testing',
        keywords: ['error', 'debug', 'console', 'inspect', 'test', 'bug', 'broken'],
        cost: 'FREE',
        setup: 'READY NOW',
        url: 'Press F12 in browser',
        description: 'Shows errors and lets you inspect code'
    },
    {
        name: 'Lighthouse',
        category: 'testing',
        keywords: ['speed', 'performance', 'slow', 'fast', 'optimize', 'seo', 'accessibility'],
        cost: 'FREE',
        setup: 'READY NOW',
        url: 'F12 → Lighthouse tab',
        description: 'Grades your website speed and quality'
    },
    {
        name: 'GitHub Pages',
        category: 'hosting',
        keywords: ['deploy', 'host', 'publish', 'website', 'live', 'online'],
        cost: 'FREE',
        setup: 'NEEDS SETUP (5 min)',
        url: 'GitHub Settings → Pages',
        description: 'Hosts your website for free'
    },
    {
        name: 'Live Server',
        category: 'code',
        keywords: ['refresh', 'auto', 'reload', 'live', 'preview', 'watch'],
        cost: 'FREE',
        setup: 'NEEDS SETUP (2 min)',
        url: 'VS Code Extension',
        description: 'Auto-refreshes browser when you save code'
    },
    {
        name: 'Prettier',
        category: 'code',
        keywords: ['format', 'clean', 'messy', 'spacing', 'indent', 'style'],
        cost: 'FREE',
        setup: 'NEEDS SETUP (3 min)',
        url: 'VS Code Extension',
        description: 'Auto-fixes messy code spacing'
    },
    {
        name: 'Make.com',
        category: 'automation',
        keywords: ['form', 'email', 'webhook', 'automate', 'connect', 'integration'],
        cost: 'FREE (1000/mo)',
        setup: 'NEEDS SETUP (30 min)',
        url: 'https://make.com',
        description: 'Connects apps together (form → email → sheet)'
    },
    {
        name: 'Canva Free',
        category: 'graphics',
        keywords: ['graphic', 'design', 'banner', 'social', 'image', 'create'],
        cost: 'FREE',
        setup: 'NEEDS SETUP (5 min)',
        url: 'https://canva.com',
        description: 'Make pretty graphics and social media posts'
    },
    {
        name: 'Responsively',
        category: 'testing',
        keywords: ['mobile', 'responsive', 'tablet', 'phone', 'screen', 'device'],
        cost: 'FREE',
        setup: 'NEEDS SETUP (10 min)',
        url: 'https://responsively.app',
        description: 'See website on phone, tablet, desktop all at once'
    }
];

// Get task from command line
const task = process.argv.slice(2).join(' ').toLowerCase();

if (!task) {
    console.log('📋 Tool Suggester - Find the right FREE tool for your task\n');
    console.log('Usage: node tool-suggester.js "your task"\n');
    console.log('Examples:');
    console.log('  node tool-suggester.js "compress images"');
    console.log('  node tool-suggester.js "test mobile layout"');
    console.log('  node tool-suggester.js "find errors"');
    console.log('  node tool-suggester.js "deploy website"\n');
    process.exit(0);
}

// Search for matching tools
const matches = TOOLS.filter(tool => {
    return tool.keywords.some(keyword => task.includes(keyword));
});

// Sort: READY NOW first, then by cost (FREE first)
matches.sort((a, b) => {
    if (a.setup === 'READY NOW' && b.setup !== 'READY NOW') return -1;
    if (a.setup !== 'READY NOW' && b.setup === 'READY NOW') return 1;
    if (a.cost === 'FREE' && b.cost !== 'FREE') return -1;
    if (a.cost !== 'FREE' && b.cost === 'FREE') return 1;
    return 0;
});

// Display results
console.log(`\n🔍 Searching for: "${task}"\n`);

if (matches.length === 0) {
    console.log('❌ No tools found for this task.');
    console.log('💡 Try different keywords or check .agent/tools/TOOLS_REGISTRY.md\n');
    process.exit(0);
}

console.log(`✅ Found ${matches.length} tool(s):\n`);

matches.forEach((tool, index) => {
    const icon = tool.setup === 'READY NOW' ? '🟢' : '🟡';
    console.log(`${icon} ${index + 1}. ${tool.name}`);
    console.log(`   💰 Cost: ${tool.cost}`);
    console.log(`   ⚙️  Setup: ${tool.setup}`);
    console.log(`   📝 What it does: ${tool.description}`);
    console.log(`   🔗 How: ${tool.url}`);

    if (index < matches.length - 1) console.log('');
});

console.log('\n💡 Tip: Use the first tool (it\'s the best match!)\n');

// Show next steps
const bestMatch = matches[0];
console.log('📋 Next steps:');
if (bestMatch.setup === 'READY NOW') {
    console.log(`   1. ${bestMatch.url}`);
    console.log('   2. Do your thing!');
    console.log('   3. Done! ✅');
} else {
    console.log(`   1. Check .agent/tools/TOOLS_REGISTRY.md for setup steps`);
    console.log(`   2. Setup time: ${bestMatch.setup.replace('NEEDS SETUP', '').trim()}`);
    console.log('   3. Follow the instructions');
    console.log('   4. Done! ✅');
}

console.log('');
