const axios = require('axios');

const API_URL = 'https://api-testing.infrapilot.in/api/v1';

async function test() {
    try {
        console.log("Attempting login to get token...");
        const auth = await axios.post(`${API_URL}/auth/verify_otp`, { mobile: '7875641067', otp: '123456' });
        const token = auth.data?.token?.access_token;
        console.log("Token Acquired:", !!token);

        if (!token) {
            console.log("Could not get token. Exiting.");
            return;
        }

        console.log("Fetching /projects...");
        const res = await axios.get(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 100 }
        });

        const data = res.data;
        const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
        console.log(`Successfully fetched ${items.length} projects.`);
        console.log("Project 1:", items[0]);
        console.log("Project array format keys:", Object.keys(items[0] || {}));

        console.log("Raw Response Type:", Array.isArray(data) ? 'Array' : 'Object');
        if (!Array.isArray(data)) console.log("Raw Response Keys:", Object.keys(data));

    } catch (e) {
        console.log("Error status:", e.response?.status);
        console.log("Error data:", JSON.stringify(e.response?.data));
        console.log("Error msg:", e.message);
    }
}
test();
