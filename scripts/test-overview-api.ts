async function testOverviewAPI() {
  const testData = {
    businessUrl: "https://www.linkedin.com/company/penske-automotive-group/",
    aiSummary: "Penske Automotive Group is a diversified transportation services company operating automotive and commercial truck dealerships in the United States, Canada, and Western Europe. They also distribute commercial vehicles, engines, power systems and related parts and services principally in Australia and New Zealand. The company focuses on premium automotive brands and offers new and used vehicle sales, finance and insurance products, and vehicle maintenance and repair services.",
    userDescription: "We are looking to modernize our operations and improve customer experience through AI integration"
  };

  try {
    console.log('Sending request to generate-overview API...');
    const response = await fetch('http://localhost:3002/api/generate-overview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error || 'Failed to generate overview');
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOverviewAPI();
