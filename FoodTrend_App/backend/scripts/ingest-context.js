/**
 * FoodTrend Context Ingestion
 * 
 * Reads all core documents and ingests them into Pinecone for long-term memory.
 * This ensures AI sessions can query for any FoodTrend context.
 * 
 * Usage:
 *   node ingest-context.js           # Ingest all documents
 *   node ingest-context.js --dry-run # Preview what would be ingested
 * 
 * @requires @pinecone-database/pinecone
 */

require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'foodtrend-memory';

// Documents to ingest with their categories
const DOCUMENTS = [
    { file: 'BUSINESS_DNA.md', category: 'mission', priority: 'critical' },
    { file: 'OPERATING_SYSTEM.md', category: 'sops', priority: 'critical' },
    { file: 'SALES_CHART_SPEC.md', category: 'patterns', priority: 'high' },
    { file: 'DESIGN_GUARDRAILS.md', category: 'patterns', priority: 'high' },
    { file: 'QUALIFICATION_LOGIC.md', category: 'patterns', priority: 'high' },
    { file: 'PINECONE_REGISTRY.md', category: 'sops', priority: 'medium' },
    { file: 'USAGE_GUIDE.md', category: 'sops', priority: 'medium' }
];

// Also ingest from .agent folder
const AGENT_DOCUMENTS = [
    { file: 'SSOT.md', category: 'mission', priority: 'critical' },
    { file: 'PRIME_DIRECTIVE.md', category: 'sops', priority: 'critical' }
];

/**
 * Simple hash-based embedding (matches long-term-memory.js)
 */
function simpleEmbedding(text) {
    const normalized = text.toLowerCase().trim();
    const vector = new Array(1024).fill(0);

    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        const position = i % 1024;
        vector[position] += char / 256;
        vector[(position + char) % 1024] += 0.5;
    }

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => magnitude > 0 ? val / magnitude : 0);
}

/**
 * Extract key sections from markdown
 */
function extractSections(content, fileName) {
    const sections = [];
    const lines = content.split('\n');

    let currentSection = { title: fileName, content: [], level: 0 };

    for (const line of lines) {
        // Check for headers
        const h1Match = line.match(/^# (.+)/);
        const h2Match = line.match(/^## (.+)/);
        const h3Match = line.match(/^### (.+)/);

        if (h1Match || h2Match) {
            // Save previous section if it has content
            if (currentSection.content.length > 0) {
                sections.push({
                    title: currentSection.title,
                    content: currentSection.content.join('\n').trim()
                });
            }

            currentSection = {
                title: h1Match ? h1Match[1] : h2Match[1],
                content: [],
                level: h1Match ? 1 : 2
            };
        } else if (h3Match) {
            // Include H3 in current section
            currentSection.content.push(line);
        } else {
            currentSection.content.push(line);
        }
    }

    // Don't forget last section
    if (currentSection.content.length > 0) {
        sections.push({
            title: currentSection.title,
            content: currentSection.content.join('\n').trim()
        });
    }

    return sections;
}

/**
 * Extract specific important facts from content
 */
function extractKeyFacts(content, fileName) {
    const facts = [];

    // Extract pricing if present
    const pricingPatterns = [
        /\$(\d+)(?:\/month)?.*?(?:Starter|Momentum)/gi,
        /\$(\d+)(?:\/month)?.*?(?:Growth|Velocity)/gi,
        /\$(\d+)(?:\/month)?.*?(?:Reputation|Dominance)/gi,
        /Starter.*?\$(\d+)/gi,
        /Growth.*?\$(\d+)/gi,
        /Reputation.*?\$(\d+)/gi
    ];

    // Extract rules/constraints
    const rulePattern = /(?:NEVER|ALWAYS|MUST|SHALL|REQUIRED|DO NOT|DON'T)[^.!?\n]+[.!?]/gi;
    const rules = content.match(rulePattern) || [];
    rules.forEach(rule => {
        facts.push({
            type: 'rule',
            content: rule.trim(),
            source: fileName
        });
    });

    // Extract color definitions
    const colorPattern = /#[A-Fa-f0-9]{6}|rgb\([^)]+\)|hsl\([^)]+\)/gi;
    const colors = content.match(colorPattern) || [];
    if (colors.length > 0) {
        facts.push({
            type: 'design',
            content: `Color palette from ${fileName}: ${colors.slice(0, 10).join(', ')}`,
            source: fileName
        });
    }

    return facts;
}

/**
 * Store a chunk in Pinecone
 */
async function storeChunk(index, chunk, metadata) {
    const id = crypto.randomUUID();
    const embedding = simpleEmbedding(chunk);

    await index.upsert([{
        id,
        values: embedding,
        metadata: {
            content: chunk.slice(0, 30000),
            ...metadata,
            timestamp: new Date().toISOString()
        }
    }]);

    return id;
}

/**
 * Ingest a single document
 */
async function ingestDocument(index, filePath, config, dryRun = false) {
    const fileName = path.basename(filePath);

    if (!fs.existsSync(filePath)) {
        console.log(`   ⏭️  Skipping ${fileName} (not found)`);
        return 0;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = extractSections(content, fileName);
    const facts = extractKeyFacts(content, fileName);

    let stored = 0;

    // Store document summary
    const summary = `Document: ${fileName}\n\n${content.slice(0, 2000)}`;
    if (!dryRun) {
        await storeChunk(index, summary, {
            category: config.category,
            source: fileName,
            type: 'document_summary',
            priority: config.priority
        });
    }
    stored++;

    // Store sections
    for (const section of sections) {
        if (section.content.length > 100) { // Only store meaningful sections
            const chunkContent = `[${fileName}] ${section.title}\n\n${section.content}`;
            if (!dryRun) {
                await storeChunk(index, chunkContent, {
                    category: config.category,
                    source: fileName,
                    section: section.title,
                    type: 'section',
                    priority: config.priority
                });
            }
            stored++;
        }
    }

    // Store key facts
    for (const fact of facts.slice(0, 20)) { // Limit facts per doc
        const factContent = `[${fact.source}] [${fact.type.toUpperCase()}] ${fact.content}`;
        if (!dryRun) {
            await storeChunk(index, factContent, {
                category: config.category,
                source: fileName,
                type: fact.type,
                priority: 'critical'
            });
        }
        stored++;
    }

    console.log(`   ✅ ${fileName}: ${stored} chunks`);
    return stored;
}

/**
 * Main ingestion function
 */
async function ingestAll(dryRun = false) {
    console.log('═══════════════════════════════════════════════');
    console.log('     FoodTrend Context Ingestion');
    console.log('═══════════════════════════════════════════════\n');

    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No data will be stored\n');
    }

    const index = pinecone.index(INDEX_NAME);
    const hqDir = path.join(__dirname, '..', '..', 'FoodTrend_HQ');
    const agentDir = path.join(__dirname, '..', '..', '.agent');

    let totalChunks = 0;

    // Ingest FoodTrend_HQ documents
    console.log('📁 Ingesting FoodTrend_HQ documents...\n');
    for (const doc of DOCUMENTS) {
        const filePath = path.join(hqDir, doc.file);
        totalChunks += await ingestDocument(index, filePath, doc, dryRun);
    }

    // Ingest .agent documents
    console.log('\n📁 Ingesting .agent documents...\n');
    for (const doc of AGENT_DOCUMENTS) {
        const filePath = path.join(agentDir, doc.file);
        totalChunks += await ingestDocument(index, filePath, doc, dryRun);
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log(`   Total chunks ${dryRun ? 'to be ' : ''}stored: ${totalChunks}`);
    console.log('═══════════════════════════════════════════════\n');

    if (!dryRun) {
        // Get final stats
        const stats = await index.describeIndexStats();
        console.log('📊 Pinecone Stats:');
        console.log(`   Total vectors: ${stats.totalRecordCount}`);
        console.log(`   Dimension: ${stats.dimension}`);
    }
}

// CLI
async function main() {
    if (!process.env.PINECONE_API_KEY) {
        console.error('❌ PINECONE_API_KEY not found in .env');
        process.exit(1);
    }

    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');

    await ingestAll(dryRun);
}

main().catch(console.error);
