document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch donation data from the API
        const response = await fetch('/api/donations');
        const data = await response.json();


        console.log(data);


        const donationElement = document.getElementById('donationMeterText');
        const donationProptext = document.getElementById('donationMeterPropText')
        const progressBarWidth = document.getElementById('progressBarThing')
        if (donationElement) {
            donationElement.textContent = `Total Donations: $${data}`;
            donationProptext.textContent = `Goal: $${data}      /      $3500`
            progressBarWidth.style.width = `${(data / 3500) * 100}%`
            progressBarWidth.textContent = `${Math.round((data / 3500) * 100)}%`
        }
    } catch (error) {
        console.error('Error fetching donation data:', error);
    }
});
