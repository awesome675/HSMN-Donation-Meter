const express = require('express')
const path = require('path')
const moment = require('moment')
const { getSalesData } = require('./src/api/square')


const app = express()
const port = process.env.PORT || 3000
let startDate = '2024-01-01T09:00:00-05:00'
let endDate = String(moment().format())

app.use(express.static(path.join(__dirname + "/src/public")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'index.html'));
});

app.get('/api/donations', async (req, res) => {
    try {
        const salesData = await getSalesData('Donation', startDate, endDate)
        res.json(salesData)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to get donation data' })
    }
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})