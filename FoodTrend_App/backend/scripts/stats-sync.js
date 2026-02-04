/**
 * FoodTrend Stats Sync: Supabase → Notion
 * 
 * Pulls key metrics from Supabase and updates a Notion "Metrics Dashboard" page.
 * Can be run manually or scheduled via cron.
 * 
 * Usage:
 *   node stats-sync.js                  # Full sync
 *   node stats-sync.js --create-page    # Create the Metrics page first
 * 
 * @requires @supabase/supabase-js
 * @requires @notionhq/client
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('@notionhq/client');

// Initialize clients
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const FOODTREND_HQ_PAGE_ID = process.env.NOTION_FOODTREND_HQ_PAGE_ID;
let METRICS_PAGE_ID = process.env.NOTION_METRICS_PAGE_ID || null;

/**
 * Fetch stats from Supabase
 */
async function fetchSupabaseStats() {
    console.log('📊 Fetching stats from Supabase...\n');

    const stats = {
        timestamp: new Date().toISOString(),
        restaurants: { total: 0, active: 0, byTier: {} },
        creators: { total: 0, verified: 0, pending: 0 },
        gigs: { total: 0, completed: 0, pending: 0, thisMonth: 0 },
        revenue: { mrr: 0, thisMonth: 0 }
    };

    try {
        // Restaurant stats
        const { data: restaurants, error: restError } = await supabase
            .from('restaurants')
            .select('id, status, tier, created_at');

        if (!restError && restaurants) {
            stats.restaurants.total = restaurants.length;
            stats.restaurants.active = restaurants.filter(r => r.status === 'active').length;

            // Count by tier
            restaurants.forEach(r => {
                const tier = r.tier || 'unknown';
                stats.restaurants.byTier[tier] = (stats.restaurants.byTier[tier] || 0) + 1;
            });
        }

        // Creator stats
        const { data: creators, error: creatorError } = await supabase
            .from('creators')
            .select('id, status, verified, created_at');

        if (!creatorError && creators) {
            stats.creators.total = creators.length;
            stats.creators.verified = creators.filter(c => c.verified === true).length;
            stats.creators.pending = creators.filter(c => c.status === 'pending').length;
        }

        // Gig stats
        const { data: gigs, error: gigError } = await supabase
            .from('gigs')
            .select('id, status, created_at, completed_at');

        if (!gigError && gigs) {
            stats.gigs.total = gigs.length;
            stats.gigs.completed = gigs.filter(g => g.status === 'completed').length;
            stats.gigs.pending = gigs.filter(g => g.status === 'pending' || g.status === 'assigned').length;

            // This month
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);
            stats.gigs.thisMonth = gigs.filter(g => new Date(g.created_at) >= thisMonth).length;
        }

        // Revenue calculation (based on active restaurants by tier)
        const tierPricing = {
            starter: 799,
            growth: 1299,
            reputation: 1599
        };

        Object.entries(stats.restaurants.byTier).forEach(([tier, count]) => {
            const price = tierPricing[tier.toLowerCase()] || 0;
            stats.revenue.mrr += price * count;
        });

    } catch (error) {
        console.error('Error fetching stats:', error.message);
    }

    return stats;
}

/**
 * Create Metrics page in Notion
 */
async function createMetricsPage() {
    console.log('📝 Creating Metrics Dashboard page in Notion...\n');

    const page = await notion.pages.create({
        parent: { page_id: FOODTREND_HQ_PAGE_ID },
        properties: {
            title: {
                title: [{ text: { content: '📊 Metrics Dashboard' } }]
            }
        },
        children: [
            {
                object: 'block',
                type: 'callout',
                callout: {
                    rich_text: [{ type: 'text', text: { content: 'Auto-updated by stats-sync.js' } }],
                    icon: { emoji: '🤖' }
                }
            },
            {
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: 'Last Updated' } }]
                }
            },
            {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content: 'Never' } }]
                }
            },
            {
                object: 'block',
                type: 'divider',
                divider: {}
            },
            {
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: '🏪 Restaurants' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'Total: 0' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'Active: 0' } }]
                }
            },
            {
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: '🎬 Creators' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'Total: 0' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'Verified: 0' } }]
                }
            },
            {
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: '📋 Gigs' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'Total: 0' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'Completed: 0' } }]
                }
            },
            {
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: '💰 Revenue' } }]
                }
            },
            {
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: 'MRR: $0' } }]
                }
            }
        ]
    });

    console.log(`✅ Created Metrics page: ${page.id}`);
    console.log(`\nAdd this to your .env file:`);
    console.log(`NOTION_METRICS_PAGE_ID=${page.id}`);

    return page.id;
}

/**
 * Update Metrics page with new stats
 */
async function updateMetricsPage(pageId, stats) {
    console.log('📝 Updating Metrics page in Notion...\n');

    // Get existing blocks
    const { results: blocks } = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100
    });

    // Delete all existing blocks
    for (const block of blocks) {
        try {
            await notion.blocks.delete({ block_id: block.id });
        } catch (e) {
            // Ignore deletion errors
        }
    }

    // Create new content
    const newBlocks = [
        {
            object: 'block',
            type: 'callout',
            callout: {
                rich_text: [{ type: 'text', text: { content: 'Auto-updated by stats-sync.js' } }],
                icon: { emoji: '🤖' }
            }
        },
        {
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [{ type: 'text', text: { content: '⏰ Last Updated' } }]
            }
        },
        {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [{
                    type: 'text',
                    text: {
                        content: new Date(stats.timestamp).toLocaleString('en-US', {
                            dateStyle: 'full',
                            timeStyle: 'short'
                        })
                    }
                }]
            }
        },
        {
            object: 'block',
            type: 'divider',
            divider: {}
        },
        // Restaurants
        {
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [{ type: 'text', text: { content: '🏪 Restaurants' } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{
                    type: 'text',
                    text: { content: `Total: ${stats.restaurants.total}` },
                    annotations: { bold: true }
                }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `Active: ${stats.restaurants.active}` } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `By Tier: ${JSON.stringify(stats.restaurants.byTier)}` } }]
            }
        },
        // Creators
        {
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [{ type: 'text', text: { content: '🎬 Creators' } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{
                    type: 'text',
                    text: { content: `Total: ${stats.creators.total}` },
                    annotations: { bold: true }
                }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `Verified: ${stats.creators.verified}` } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `Pending: ${stats.creators.pending}` } }]
            }
        },
        // Gigs
        {
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [{ type: 'text', text: { content: '📋 Gigs' } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{
                    type: 'text',
                    text: { content: `Total: ${stats.gigs.total}` },
                    annotations: { bold: true }
                }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `Completed: ${stats.gigs.completed}` } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `Pending: ${stats.gigs.pending}` } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: `This Month: ${stats.gigs.thisMonth}` } }]
            }
        },
        // Revenue
        {
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [{ type: 'text', text: { content: '💰 Revenue' } }]
            }
        },
        {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{
                    type: 'text',
                    text: { content: `MRR: $${stats.revenue.mrr.toLocaleString()}` },
                    annotations: { bold: true, color: 'green' }
                }]
            }
        }
    ];

    await notion.blocks.children.append({
        block_id: pageId,
        children: newBlocks
    });

    console.log('✅ Metrics page updated!');
}

/**
 * Find or create metrics page
 */
async function findMetricsPage() {
    if (METRICS_PAGE_ID) return METRICS_PAGE_ID;

    // Search for existing page
    const { results } = await notion.search({
        query: 'Metrics Dashboard',
        filter: { property: 'object', value: 'page' }
    });

    const metricsPage = results.find(p =>
        p.properties?.title?.title?.[0]?.plain_text?.includes('Metrics')
    );

    if (metricsPage) {
        console.log(`📍 Found existing Metrics page: ${metricsPage.id}`);
        return metricsPage.id;
    }

    return null;
}

/**
 * Main entry point
 */
async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('     FoodTrend Stats Sync: Supabase → Notion');
    console.log('═══════════════════════════════════════════════\n');

    // Validate env
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Missing Supabase credentials in .env');
        process.exit(1);
    }
    if (!process.env.NOTION_TOKEN) {
        console.error('❌ Missing NOTION_TOKEN in .env');
        process.exit(1);
    }

    const args = process.argv.slice(2);

    if (args.includes('--create-page')) {
        if (!FOODTREND_HQ_PAGE_ID) {
            console.error('❌ NOTION_FOODTREND_HQ_PAGE_ID required to create page');
            process.exit(1);
        }
        await createMetricsPage();
        return;
    }

    // Find or require metrics page
    const pageId = await findMetricsPage();

    if (!pageId) {
        console.log('⚠️ No Metrics page found. Run with --create-page first:');
        console.log('   node stats-sync.js --create-page');
        return;
    }

    // Fetch and sync
    const stats = await fetchSupabaseStats();

    console.log('📈 Stats Summary:');
    console.log(`   Restaurants: ${stats.restaurants.total} (${stats.restaurants.active} active)`);
    console.log(`   Creators: ${stats.creators.total} (${stats.creators.verified} verified)`);
    console.log(`   Gigs: ${stats.gigs.total} (${stats.gigs.completed} completed)`);
    console.log(`   MRR: $${stats.revenue.mrr.toLocaleString()}\n`);

    await updateMetricsPage(pageId, stats);
}

main().catch(console.error);
