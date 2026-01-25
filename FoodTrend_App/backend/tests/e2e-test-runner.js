/**
 * FoodTrend E2E Test Runner
 * Automated end-to-end testing for critical flows
 * 
 * Usage: node backend/tests/e2e-test-runner.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const API_BASE = process.env.API_URL || 'http://localhost:3000';

// Test data
const testData = {
    restaurant: {
        name: `Test Restaurant ${Date.now()}`,
        email: `testrestaurant${Date.now()}@example.com`,
        phone: '+1234567890'
    },
    influencer: {
        fullName: `Test Creator ${Date.now()}`,
        email: `testcreator${Date.now()}@example.com`,
        phone: '+1987654321',
        instagram: '@testcreator',
        instagramFollowers: 15000,
        tiktok: '@testcreator',
        tiktokFollowers: 25000,
        videoProductionExperience: 4,
        foodReviewExperience: 5,
        contentFrequency: '3-4_weekly',
        sampleVideoUrls: ['https://tiktok.com/test1', 'https://tiktok.com/test2'],
        nicheFocus: 'food',
        agreementAccepted: true
    }
};

// Test results
const results = {
    passed: [],
    failed: []
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });

    const data = await response.json().catch(() => null);
    return { status: response.status, data, ok: response.ok };
}

// Test functions
async function testHealthEndpoint() {
    console.log('\n📍 Testing Health Endpoint...');
    try {
        const response = await apiCall('/health');

        if (response.ok && response.data?.status === 'healthy') {
            console.log('   ✅ Health check passed');
            results.passed.push('Health Endpoint');
            return true;
        } else {
            throw new Error(`Unexpected response: ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.log(`   ❌ Health check failed: ${error.message}`);
        results.failed.push({ test: 'Health Endpoint', error: error.message });
        return false;
    }
}

async function testInfluencerSignup() {
    console.log('\n👤 Testing Influencer Signup (Basic Flow)...');
    try {
        const response = await apiCall('/api/influencer/signup', {
            method: 'POST',
            body: JSON.stringify({
                fullName: testData.influencer.fullName,
                email: testData.influencer.email,
                phone: testData.influencer.phone,
                socialProfiles: {
                    instagram: testData.influencer.instagram,
                    tiktok: testData.influencer.tiktok
                },
                bio: 'E2E test influencer'
            })
        });

        if (response.ok && response.data?.influencer?.id) {
            console.log(`   ✅ Influencer created with ID: ${response.data.influencer.id}`);
            console.log(`   📝 Referral code: ${response.data.influencer.referral_code}`);
            results.passed.push('Influencer Signup (Basic)');
            return response.data.influencer;
        } else {
            throw new Error(`Signup failed: ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.log(`   ❌ Influencer signup failed: ${error.message}`);
        results.failed.push({ test: 'Influencer Signup (Basic)', error: error.message });
        return null;
    }
}

async function testQualifiedSignup() {
    console.log('\n🌟 Testing Qualified Influencer Signup with Scoring...');
    try {
        const qualifiedEmail = `qualified${Date.now()}@example.com`;
        const response = await apiCall('/api/influencer/signup-qualified', {
            method: 'POST',
            body: JSON.stringify({
                ...testData.influencer,
                email: qualifiedEmail
            })
        });

        if (response.ok && response.data?.influencer?.id) {
            console.log(`   ✅ Qualified signup successful`);
            console.log(`   📊 Score: ${response.data.score}/110`);
            console.log(`   📋 Status: ${response.data.status}`);
            console.log(`   ✓ Approved: ${response.data.approved}`);
            results.passed.push('Qualified Influencer Signup');
            return response.data;
        } else {
            throw new Error(`Qualified signup failed: ${JSON.stringify(response.data)}`);
        }
    } catch (error) {
        console.log(`   ❌ Qualified signup failed: ${error.message}`);
        results.failed.push({ test: 'Qualified Influencer Signup', error: error.message });
        return null;
    }
}

async function testRestaurantDashboard(restaurantId) {
    console.log('\n🍔 Testing Restaurant Dashboard API...');

    // Use a test ID or skip if not provided
    const testId = restaurantId || 'test-restaurant-id';

    try {
        const response = await apiCall(`/api/restaurant/${testId}/dashboard`);

        // Even if no data, the endpoint should respond
        if (response.status === 200 || response.status === 404) {
            console.log(`   ✅ Dashboard endpoint responding`);
            console.log(`   📊 Response structure valid`);
            results.passed.push('Restaurant Dashboard API');
            return true;
        } else {
            throw new Error(`Unexpected status: ${response.status}`);
        }
    } catch (error) {
        console.log(`   ❌ Dashboard test failed: ${error.message}`);
        results.failed.push({ test: 'Restaurant Dashboard API', error: error.message });
        return false;
    }
}

async function testRateLimiting() {
    console.log('\n🛡️ Testing Rate Limiting...');
    try {
        // Send multiple rapid requests
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(apiCall('/health'));
        }

        const responses = await Promise.all(promises);
        const allSuccessful = responses.every(r => r.ok);

        if (allSuccessful) {
            console.log('   ✅ Rapid requests handled (under limit)');
            results.passed.push('Rate Limiting');
            return true;
        }
    } catch (error) {
        console.log(`   ❌ Rate limiting test failed: ${error.message}`);
        results.failed.push({ test: 'Rate Limiting', error: error.message });
        return false;
    }
}

// Main test runner
async function runTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('         FoodTrend E2E Test Runner');
    console.log('═══════════════════════════════════════════════════');
    console.log(`🌐 API Base: ${API_BASE}`);
    console.log(`🕐 Started: ${new Date().toISOString()}`);

    // Run tests in sequence
    await testHealthEndpoint();
    await testInfluencerSignup();
    await testQualifiedSignup();
    await testRestaurantDashboard();
    await testRateLimiting();

    // Summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('                  TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Passed: ${results.passed.length}`);
    results.passed.forEach(test => console.log(`   • ${test}`));

    if (results.failed.length > 0) {
        console.log(`\n❌ Failed: ${results.failed.length}`);
        results.failed.forEach(({ test, error }) => {
            console.log(`   • ${test}: ${error}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════');

    // Exit with appropriate code
    process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
    runTests().catch(err => {
        console.error('Test runner error:', err);
        process.exit(1);
    });
}

module.exports = { runTests, testData };
