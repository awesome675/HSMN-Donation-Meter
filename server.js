const express = require('express');
const path = require('path');
const moment = require('moment');
const { getSalesData } = require('./src/api/square');

const app = express();
const port = process.env.PORT || 3000;
const startDate = '2024-01-01T09:00:00-05:00';

app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'index.html'));
});

app.get('/api/donations', async (req, res) => {
    const endDate = moment().format();
    try {
        const salesData = await getSalesData('Donation', startDate, endDate);
        res.json(salesData);
        console.log('data sent')
    } catch (error) {
        console.error('Error fetching donation data:', error);
        res.status(500).json({ error: 'Failed to retrieve donation data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
