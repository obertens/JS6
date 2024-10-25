let chartInstance = null;


const getCurrencyName = (currency) => {
    if (currency === 'dolar') {
        return '$ (USD)';
    } else if (currency === 'euro') {
        return '€ (EUR)';
    } else if (currency === 'uf') {
        return 'UF';
    }
    return '';
}

document.getElementById('convert-btn').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    if (amount <= 0) {
        document.getElementById('result').textContent = 'El monto debe ser un número mayor a cero "0".';
        return;
    }
    const currency = document.getElementById('currency').value;

    try {
        const response = await fetch(`https://mindicador.cl/api`);
        const data = await response.json();

        const exchangeRate = data[currency].valor;
        const convertedAmount = (amount / exchangeRate).toFixed(2);
        const currencyName = getCurrencyName(currency);

        document.getElementById('result').textContent = 
            `Resultado: ${convertedAmount} ${currencyName}`;

        renderHistoryChart(currency);
        
        document.getElementById('history-container').style.display = 'block';
        
    } catch (error) {
        document.getElementById('result').textContent = 
            'Error al obtener los datos. Intente nuevamente.';
    }
});

async function renderHistoryChart(currency) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        const data = await response.json();
        const labels = data.serie.slice(0, 10).map(item => item.fecha.slice(0, 10));
        const values = data.serie.slice(0, 10).map(item => item.valor);

        if (chartInstance !== null) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById('historyChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Historial de ${currency.toUpperCase()}`,
                    data: values,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false
                }]
            }
        });
        
    } catch (error) {
        console.error('Error al obtener el historial:', error);
    }
}