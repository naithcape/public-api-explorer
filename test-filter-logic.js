// Simple test script to verify the filter logic

// Mock API data
const mockApis = [
  { id: 1, name: "API 1", status: "New", active: true },
  { id: 2, name: "API 2", status: "New", active: false },
  { id: 3, name: "API 3", status: "Recommended", active: true },
  { id: 4, name: "API 4", status: "Recommended", active: false },
  { id: 5, name: "API 5", status: "Not Recommended", active: true },
  { id: 6, name: "API 6", status: "Not Recommended", active: false }
];

// Mock filter function based on the updated logic
function filterApis(apis, criteria) {
  let result = [...apis];

  // Filter by status
  if (criteria.status !== 'All') {
    // When a specific status is selected, show all APIs with that status regardless of active state
    result = result.filter(api => api.status === criteria.status);
  } else {
    // Only apply active/inactive filter when "All" statuses are selected
    if (criteria.showInactive) {
      result = result.filter(api => !api.active);
    } else {
      result = result.filter(api => api.active);
    }
  }

  // Filter by search term (simplified)
  if (criteria.searchTerm) {
    const term = criteria.searchTerm.toLowerCase();
    result = result.filter(api =>
      api.name.toLowerCase().includes(term)
    );
  }

  return result;
}

// Test cases
const testCases = [
  {
    name: "Test 1: All statuses, active only",
    criteria: { status: 'All', showInactive: false, searchTerm: '' },
    expectedCount: 3, // APIs 1, 3, 5
    expectedIds: [1, 3, 5]
  },
  {
    name: "Test 2: All statuses, inactive only",
    criteria: { status: 'All', showInactive: true, searchTerm: '' },
    expectedCount: 3, // APIs 2, 4, 6
    expectedIds: [2, 4, 6]
  },
  {
    name: "Test 3: New status, regardless of active state",
    criteria: { status: 'New', showInactive: false, searchTerm: '' },
    expectedCount: 2, // APIs 1, 2
    expectedIds: [1, 2]
  },
  {
    name: "Test 4: New status, with showInactive=true (should still show all New)",
    criteria: { status: 'New', showInactive: true, searchTerm: '' },
    expectedCount: 2, // APIs 1, 2
    expectedIds: [1, 2]
  },
  {
    name: "Test 5: Recommended status, regardless of active state",
    criteria: { status: 'Recommended', showInactive: false, searchTerm: '' },
    expectedCount: 2, // APIs 3, 4
    expectedIds: [3, 4]
  },
  {
    name: "Test 6: Not Recommended status, regardless of active state",
    criteria: { status: 'Not Recommended', showInactive: false, searchTerm: '' },
    expectedCount: 2, // APIs 5, 6
    expectedIds: [5, 6]
  }
];

// Run tests
console.log("Running filter logic tests...\n");
let passedTests = 0;

testCases.forEach(test => {
  const result = filterApis(mockApis, test.criteria);
  const resultIds = result.map(api => api.id);
  const passed =
    result.length === test.expectedCount &&
    test.expectedIds.every(id => resultIds.includes(id));

  console.log(`${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (!passed) {
    console.log(`  Expected: ${test.expectedCount} APIs with IDs ${test.expectedIds}`);
    console.log(`  Actual: ${result.length} APIs with IDs ${resultIds}`);
  }

  if (passed) passedTests++;
});

console.log(`\n${passedTests} of ${testCases.length} tests passed.`);
