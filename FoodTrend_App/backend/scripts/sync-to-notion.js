/**
 * FoodTrend Notion Sync Script
 * 
 * This script syncs FoodTrend HQ documents to Notion using the Notion API directly.
 * It bypasses the MCP integration issue in Antigravity.
 * 
 * Usage:
 *   1. Add NOTION_TOKEN to your .env file
 *   2. Run: node sync-to-notion.js
 * 
 * @requires @notionhq/client
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Configuration
const FOODTREND_HQ_PARENT_PAGE_ID = process.env.NOTION_FOODTREND_HQ_PAGE_ID || null;

/**
 * Create a page in Notion
 */
async function createPage(title, parentId, content = []) {
    try {
        const page = await notion.pages.create({
            parent: { page_id: parentId },
            properties: {
                title: {
                    title: [{ text: { content: title } }]
                }
            },
            children: content
        });
        console.log(`✅ Created page: ${title} (${page.id})`);
        return page;
    } catch (error) {
        console.error(`❌ Failed to create page "${title}":`, error.message);
        return null;
    }
}

/**
 * Convert markdown to Notion blocks (simplified)
 */
function markdownToBlocks(markdown) {
    const lines = markdown.split('\n');
    const blocks = [];

    for (const line of lines) {
        if (line.startsWith('# ')) {
            blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: {
                    rich_text: [{ type: 'text', text: { content: line.slice(2) } }]
                }
            });
        } else if (line.startsWith('## ')) {
            blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: line.slice(3) } }]
                }
            });
        } else if (line.startsWith('### ')) {
            blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: {
                    rich_text: [{ type: 'text', text: { content: line.slice(4) } }]
                }
            });
        } else if (line.startsWith('- ')) {
            blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: line.slice(2) } }]
                }
            });
        } else if (line.trim()) {
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content: line } }]
                }
            });
        }
    }

    return blocks;
}

/**
 * Sync a markdown file to Notion
 */
async function syncFile(filePath, parentId) {
    const fileName = path.basename(filePath, '.md');
    const content = fs.readFileSync(filePath, 'utf-8');
    const blocks = markdownToBlocks(content);

    // Notion has a 100 block limit per request, so we chunk
    const chunkedBlocks = blocks.slice(0, 100);

    return await createPage(fileName, parentId, chunkedBlocks);
}

/**
 * Search for existing pages
 */
async function searchPages(query) {
    try {
        const response = await notion.search({
            query: query,
            filter: { property: 'object', value: 'page' }
        });
        return response.results;
    } catch (error) {
        console.error('Search failed:', error.message);
        return [];
    }
}

/**
 * Create FoodTrend HQ structure in Notion
 */
async function createFoodTrendHQStructure(parentPageId) {
    console.log('\n🚀 Creating FoodTrend HQ Structure in Notion...\n');

    // Create main sub-pages
    const pages = [
        'SOP Library',
        'Team & Roles',
        'To-Do / Sprints',
        'Website Notes',
        'Decisions Log'
    ];

    for (const pageName of pages) {
        await createPage(pageName, parentPageId);
    }

    console.log('\n✅ FoodTrend HQ structure created!');
}

/**
 * Sync all FoodTrend HQ documents to Notion
 */
async function syncFoodTrendHQDocuments(parentPageId) {
    console.log('\n📄 Syncing FoodTrend HQ documents...\n');

    const hqDir = path.join(__dirname, '..', '..', 'FoodTrend_HQ');
    const files = [
        'USAGE_GUIDE.md',
        'BUSINESS_DNA.md',
        'OPERATING_SYSTEM.md',
        'SALES_CHART_SPEC.md',
        'DESIGN_GUARDRAILS.md',
        'QUALIFICATION_LOGIC.md',
        'PINECONE_REGISTRY.md'
    ];

    for (const file of files) {
        const filePath = path.join(hqDir, file);
        if (fs.existsSync(filePath)) {
            await syncFile(filePath, parentPageId);
        } else {
            console.log(`⏭️ Skipping ${file} (not found)`);
        }
    }

    console.log('\n✅ Document sync complete!');
}

/**
 * Main entry point
 */
async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('       FoodTrend → Notion Sync Script');
    console.log('═══════════════════════════════════════════════\n');

    // Validate token
    if (!process.env.NOTION_TOKEN) {
        console.error('❌ ERROR: NOTION_TOKEN not found in .env file');
        console.log('\nAdd this to your .env file:');
        console.log('NOTION_TOKEN=ntn_your_token_here');
        process.exit(1);
    }

    // Test connection
    try {
        const me = await notion.users.me();
        console.log(`✅ Connected as: ${me.name || me.id}`);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }

    // Check for parent page ID
    if (!FOODTREND_HQ_PARENT_PAGE_ID) {
        console.log('\n⚠️ NOTION_FOODTREND_HQ_PAGE_ID not set in .env');
        console.log('\nTo use this script:');
        console.log('1. Create a "FoodTrend HQ" page in Notion');
        console.log('2. Copy its page ID from the URL');
        console.log('3. Add to .env: NOTION_FOODTREND_HQ_PAGE_ID=your_page_id');
        console.log('\nFor now, searching for existing pages...\n');

        const results = await searchPages('FoodTrend');
        if (results.length > 0) {
            console.log('Found pages:');
            results.forEach(page => {
                const title = page.properties?.title?.title?.[0]?.plain_text || 'Untitled';
                console.log(`  - ${title} (${page.id})`);
            });
        }
        return;
    }

    // Run sync
    const args = process.argv.slice(2);

    if (args.includes('--structure')) {
        await createFoodTrendHQStructure(FOODTREND_HQ_PARENT_PAGE_ID);
    }

    if (args.includes('--sync') || args.includes('--documents')) {
        await syncFoodTrendHQDocuments(FOODTREND_HQ_PARENT_PAGE_ID);
    }

    if (args.length === 0) {
        console.log('\nUsage:');
        console.log('  node sync-to-notion.js --structure    Create FoodTrend HQ pages');
        console.log('  node sync-to-notion.js --sync         Sync HQ documents');
        console.log('  node sync-to-notion.js --structure --sync  Do both');
    }
}

main().catch(console.error);
