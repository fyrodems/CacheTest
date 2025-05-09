// Helper functions
function formatDate(date) {
  return date.toLocaleDateString();
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.value, 0);
}

// Padding to ~10KB
let padding = "x".repeat(10000);
