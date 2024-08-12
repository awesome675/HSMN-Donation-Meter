// Configure environment variables
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + "/.." + "/.." + "/process.env" });
const { Client, Environment, ApiError } = require('square')


// Square authorization
const client = new Client({
    bearerAuthCredentials: {
        accessToken: process.env.SQUARE_ACCESS_TOKEN
    },
    environment: Environment.Production,
});

const { ordersApi } = client



// Calling API and retrieving data
async function getSalesData(itemName, startDate, endDate) {
    let donationSales = 0
    let data = []
    let pagCursor = null
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
            data = data.concat(response.result)
            pagCursor = response.result.cursor
        }




        // Loop to iterate through object and find donations
        // for (let i of data) {
        //     for (let order of i.orders) {
        //         if (order.lineItems) {
        //             for (let item of order.lineItems) {
        //                 if (item.name == 'Donation') {
        //                     donationSales += parseInt(item.grossSalesMoney.amount)
        //                 }
        //             }
        //         }
        //     }
        // }
        // return donationSales / 100
        console.log(data)




    } catch (e) {
        console.log('Error fetching sales data: ', e)
    }




}

module.exports = { getSalesData }

