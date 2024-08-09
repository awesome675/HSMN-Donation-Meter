// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         // Fetch donation data from the API
//         const response = await fetch('/api/donations');
//         const data = await response.json();


//         console.log(data);


//         const donationElement = document.getElementById('donationMeterText');
//         const donationProptext = document.getElementById('donationMeterPropText')
//         const progressBarWidth = document.getElementById('progressBarThing')
//         if (donationElement) {
//             donationElement.textContent = `Total Donations: $${data}`;
//             donationProptext.textContent = `Goal: $${data}      /      $3500`
//             progressBarWidth.style.width = `${(data / 3500) * 100}%`
//             progressBarWidth.textContent = `${Math.round((data / 3500) * 100)}%`
//         }
//     } catch (error) {
//         console.error('Error fetching donation data:', error);
//     }
// });
// document.getElementById('loading').hidden = false
document.getElementById('content').hidden = true
function updateMeter() {

    fetch('/api/donations')
        .then(response => response.json())
        .then(data => {
            console.log('data received')
            document.getElementById('loading').style.visibility = 'hidden'
            console.log('loading hidden')
            document.getElementById('content').hidden = false
            const donationElement = document.getElementById('donationMeterText');
            const donationProptext = document.getElementById('donationMeterPropText')
            const progressBarWidth = document.getElementById('progressBarThing')
            if (donationElement) {
                donationElement.textContent = `Total Donations: $${data}`;
                donationProptext.textContent = `Goal: $${data}      /      $3500`
                progressBarWidth.style.width = `${(data / 3500) * 100}%`
                progressBarWidth.textContent = `${Math.round((data / 3500) * 100)}%`

            }
        })
        .catch(error => {
            console.error('Error getting data: ', error)
        })

}
updateMeter()
setInterval(updateMeter, 600000)

