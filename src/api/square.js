// Configure environment variables
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + "/.." + "/.." + "/process.env" });

const fs = require('fs')
const moment = require('moment')

const { Client, Environment, ApiError } = require('square')

// Square authorization
const client = new Client({
    bearerAuthCredentials: {
        accessToken: process.env.SQUARE_ACCESS_TOKEN
    },
    environment: Environment.Production,
});

const { ordersApi } = client

// Changing BigInt values into strings to be readable
function bigInttoString(key, value) {
    return typeof value === 'bigint' ? value.toString() : value
}



// Calling API and retrieving data
async function getSalesData(itemName, startDate, endDate) {
    let donationSales = 0
    let data = []
    try {

        let response = await client.ordersApi.searchOrders({
            locationIds: [
                process.env.LOCATION_ID
            ],
            query: {
                filter: {
                    dateTimeFilter: {
                        createdAt: {
                            startAt: startDate,
                            endAt: endDate
                        }
                    }
                }
            },
            limit: 1000



        });
        // let orders = response.result.orders
        // if (orders) {
        //     orders.forEach(order => {
        //         order.lineItems.forEach(item => {
        //             if (item.name === itemName) {
        //                 totalSales += parseInt(item.quantity) * (item.basePriceMoney.amount / 100); // Converting from cents to dollars
        //             }
        //         });
        //     });
        // }
        data = data.concat(response.result)
        let pagCursor = response.result.cursor
        while (pagCursor) {
            let response = await client.ordersApi.searchOrders({
                locationIds: [
                    process.env.LOCATION_ID
                ],
                cursor: pagCursor,
                query: {
                    filter: {
                        dateTimeFilter: {
                            createdAt: {
                                startAt: startDate,
                                endAt: endDate
                            }
                        }
                    }
                },
                limit: 1000



            });
            // orders = response.result.orders
            // if (orders) {
            //     orders.forEach(order => {
            //         order.lineItems.forEach(item => {
            //             if (item.name === itemName) {
            //                 totalSales += parseInt(item.quantity) * (item.basePriceMoney.amount / 100); // Converting from cents to dollars
            //             }
            //         });
            //     });
            // }
            data = data.concat(response.result)
            pagCursor = response.result.cursor
        }

        // redo this and maybe change data = statements as well
        fs.writeFileSync('output.json', JSON.stringify(data, bigInttoString, 2), 'utf-8')


        // Loop to iterate through object and find donations
        for (let i in data) {
            for (let j in data[i].orders) {
                if (data[i].orders[j].lineItems) {
                    for (let k in data[i].orders[j].lineItems) {
                        if (data[i].orders[j].lineItems[k].name == 'Donation') {
                            donationSales += parseInt(data[i].orders[j].lineItems[k].grossSalesMoney.amount)
                        }
                    }
                }
            }
        }
        return (donationSales / 100)





    } catch (e) {
        console.log('Error fetching sales data: ', e)
    }




}

module.exports = { getSalesData }

