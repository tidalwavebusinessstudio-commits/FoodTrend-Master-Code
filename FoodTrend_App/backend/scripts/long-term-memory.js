/**
 * FoodTrend Long-Term Memory System
 * 
 * Uses Pinecone vector database to store and retrieve important decisions,
 * context, and learnings across sessions.
 * 
 * Categories (from PINECONE_REGISTRY.md):
 * - decisions: Business decisions with rationale
 * - bugs: Bug fixes and solutions
 * - patterns: Code patterns and implementations
 * - user-preferences: User-specific preferences
 * - context: Session context and state
 * 
 * Usage:
 *   node long-term-memory.js store "decision" "We chose Stripe over PayPal because..."
 *   node long-term-memory.js search "payment processing decision"
 *   node long-term-memory.js list decisions
 * 
 * @requires @pinecone-database/pinecone
 */

require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const crypto = require('crypto');

// Initialize Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'foodtrend-memory';

// Memory categories from PINECONE_REGISTRY.md
const CATEGORIES = {
    decisions: 'Business decisions with rationale',
    bugs: 'Bug fixes and solutions',
    patterns: 'Code patterns and implementations',
    'user-preferences': 'User-specific preferences',
    context: 'Session context and state',
    sops: 'Standard operating procedures',
    metrics: 'Performance metrics and benchmarks'
};

/**
 * Simple hash-based embedding (deterministic, no API needed)
 * Creates a 1024-dimension vector from text
 */
function simpleEmbedding(text) {
    const normalized = text.toLowerCase().trim();
    const vector = new Array(1024).fill(0);

    // Use character codes and position to create deterministic embedding
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        const position = i % 1024;
        vector[position] += char / 256;
        vector[(position + char) % 1024] += 0.5;
    }

    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => magnitude > 0 ? val / magnitude : 0);
}

/**
 * Get the index
 */
function getIndex() {
    return pinecone.index(INDEX_NAME);
}

/**
 * Store a memory in Pinecone
 */
async function storeMemory(category, content, metadata = {}) {
    if (!CATEGORIES[category]) {
        console.error(`❌ Invalid category. Valid categories: ${Object.keys(CATEGORIES).join(', ')}`);
        return null;
    }

    const index = getIndex();
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    console.log(`🧠 Storing memory...`);
    const embedding = simpleEmbedding(content);
    console.log(`   Embedding generated: ${embedding.length} dimensions`);

    const records = [{
        id,
        values: embedding,
        metadata: {
            category,
            content: content.slice(0, 30000),
            timestamp,
            ...metadata
        }
    }];

    console.log(`   Upserting to Pinecone...`);
    await index.upsert(records);
    console.log(`✅ Stored memory: ${id}`);
    console.log(`   Category: ${category}`);
    console.log(`   Content: ${content.slice(0, 100)}${content.length > 100 ? '...' : ''}`);

    return id;
}

/**
 * Search for relevant memories
 */
async function searchMemories(query, options = {}) {
    const { category = null, topK = 5 } = options;

    const index = getIndex();

    console.log(`🔍 Searching for: "${query}"...`);
    const queryEmbedding = simpleEmbedding(query);

    const filter = category ? { category: { $eq: category } } : undefined;

    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        filter
    });

    console.log(`\n📚 Found ${results.matches?.length || 0} memories:\n`);

    results.matches?.forEach((match, i) => {
        console.log(`${i + 1}. [${match.metadata.category}] (${(match.score * 100).toFixed(1)}% match)`);
        console.log(`   ${match.metadata.content?.slice(0, 200)}${match.metadata.content?.length > 200 ? '...' : ''}`);
        console.log(`   📅 ${match.metadata.timestamp}`);
        console.log('');
    });

    return results.matches || [];
}

/**
 * List memories by category
 */
async function listByCategory(category) {
    if (!CATEGORIES[category]) {
        console.error(`❌ Invalid category. Valid categories: ${Object.keys(CATEGORIES).join(', ')}`);
        return [];
    }

    return await searchMemories(category, {
        category,
        topK: 20
    });
}

/**
 * Delete a memory by ID
 */
async function deleteMemory(id) {
    const index = getIndex();
    await index.deleteOne(id);
    console.log(`🗑️ Deleted memory: ${id}`);
}

/**
 * Get index stats
 */
async function getStats() {
    const index = getIndex();
    const stats = await index.describeIndexStats();

    console.log('\n📊 Memory Stats:');
    console.log(`   Total vectors: ${stats.totalRecordCount || 0}`);
    console.log(`   Dimension: ${stats.dimension}`);
    console.log(`   Index fullness: ${((stats.indexFullness || 0) * 100).toFixed(2)}%`);

    return stats;
}

/**
 * Main CLI handler
 */
async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('     FoodTrend Long-Term Memory System');
    console.log('═══════════════════════════════════════════════\n');

    if (!process.env.PINECONE_API_KEY) {
        console.error('❌ PINECONE_API_KEY not found in .env');
        process.exit(1);
    }

    const [command, ...args] = process.argv.slice(2);

    switch (command) {
        case 'store':
            const [category, ...contentParts] = args;
            const content = contentParts.join(' ');
            if (!category || !content) {
                console.log('Usage: node long-term-memory.js store <category> <content>');
                console.log(`Categories: ${Object.keys(CATEGORIES).join(', ')}`);
                break;
            }
            await storeMemory(category, content);
            break;

        case 'search':
            const query = args.join(' ');
            if (!query) {
                console.log('Usage: node long-term-memory.js search <query>');
                break;
            }
            await searchMemories(query);
            break;

        case 'list':
            const listCategory = args[0];
            if (!listCategory) {
                console.log('Usage: node long-term-memory.js list <category>');
                console.log(`Categories: ${Object.keys(CATEGORIES).join(', ')}`);
                break;
            }
            await listByCategory(listCategory);
            break;

        case 'delete':
            const deleteId = args[0];
            if (!deleteId) {
                console.log('Usage: node long-term-memory.js delete <id>');
                break;
            }
            await deleteMemory(deleteId);
            break;

        case 'stats':
            await getStats();
            break;

        case 'categories':
            console.log('📁 Available Categories:\n');
            Object.entries(CATEGORIES).forEach(([name, desc]) => {
                console.log(`   ${name}: ${desc}`);
            });
            break;

        default:
            console.log('Usage:');
            console.log('  node long-term-memory.js store <category> <content>');
            console.log('  node long-term-memory.js search <query>');
            console.log('  node long-term-memory.js list <category>');
            console.log('  node long-term-memory.js delete <id>');
            console.log('  node long-term-memory.js stats');
            console.log('  node long-term-memory.js categories');
            console.log('\nCategories: ' + Object.keys(CATEGORIES).join(', '));
    }
}

// Export for programmatic use
module.exports = {
    storeMemory,
    searchMemories,
    listByCategory,
    deleteMemory,
    getStats,
    CATEGORIES
};

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
