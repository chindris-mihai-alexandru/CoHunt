const fs = require('fs');

async function testCompleteFlow() {
    console.log('=== Testing Complete CoHunt Flow ===\n');
    
    // Step 1: Upload resume
    console.log('1. Testing resume upload...');
    const formData = new FormData();
    const testFile = new File(['Test resume content with Software Tester skills and experience in Iceland'], 'test-resume.txt', { type: 'text/plain' });
    formData.append('resume', testFile);
    
    const uploadResponse = await fetch('http://localhost:3000/api/upload-resume', {
        method: 'POST',
        body: formData
    });
    
    if (!uploadResponse.ok) {
        console.log('❌ Resume upload failed:', await uploadResponse.text());
        return;
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Resume uploaded successfully');
    console.log('Session ID:', uploadData.sessionId);
    console.log('');
    
    // Step 2: Search for jobs with session ID
    console.log('2. Testing job search with resume...');
    const searchResponse = await fetch('http://localhost:3000/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: 'Software Tester',
            location: 'Iceland',
            sessionId: uploadData.sessionId
        })
    });
    
    if (!searchResponse.ok) {
        console.log('❌ Job search failed:', await searchResponse.text());
        return;
    }
    
    const searchData = await searchResponse.json();
    console.log('✅ Job search completed');
    console.log('Number of jobs found:', searchData.jobs.length);
    
    // Analyze first job
    const firstJob = searchData.jobs[0];
    console.log('\n=== First Job Analysis ===');
    console.log('Title:', firstJob.title);
    console.log('Company:', firstJob.company);
    console.log('Location:', firstJob.location);
    console.log('Match Score:', firstJob.matchScore);
    console.log('URL:', firstJob.url);
    console.log('Salary:', firstJob.salary);
    
    // Test the URL
    console.log('\n3. Testing job URL...');
    console.log('Generated URL:', firstJob.url);
    
    // Check if URL contains the search parameters
    const url = new URL(firstJob.url);
    console.log('URL Domain:', url.hostname);
    console.log('URL Search Params:', url.searchParams.toString());
    
    return {
        uploadWorked: true,
        sessionId: uploadData.sessionId,
        jobsFound: searchData.jobs.length,
        hasMatchScores: firstJob.matchScore !== undefined,
        urlContainsQuery: firstJob.url.includes('Software%20Tester') || firstJob.url.includes('Software Tester'),
        urlContainsLocation: firstJob.url.includes('Iceland'),
        jobLocation: firstJob.location
    };
}

// Run the test
testCompleteFlow().then(result => {
    console.log('\n=== Test Summary ===');
    console.log('Upload worked:', result.uploadWorked);
    console.log('Jobs found:', result.jobsFound);
    console.log('Has match scores:', result.hasMatchScores);
    console.log('URL contains query:', result.urlContainsQuery);
    console.log('URL contains location:', result.urlContainsLocation);
    console.log('Job location correct:', result.jobLocation === 'Iceland');
}).catch(error => {
    console.error('Test failed:', error);
});