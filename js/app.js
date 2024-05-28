'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const toggleModeButton = document.getElementById('toggle-mode');
    const body = document.body;
    const form = document.getElementById('formData');
    const tbody = document.getElementById('bodyRow');
    const tfoot = document.getElementById('footRow');
    const horas = ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm'];

    toggleModeButton.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
    });

    function Ubicacion(ciudad, minCustomersPerHour, maxCustomersPerHour, averageCostumerPerHour) {
        this.ciudad = ciudad;
        this.minCustomersPerHour = minCustomersPerHour;
        this.maxCustomersPerHour = maxCustomersPerHour;
        this.averageCostumerPerHour = averageCostumerPerHour;
        this.cookiesEachHour = [];

        this.estimateSales = function () {
            const salesPerHour = [];
            let totalSales = 0;
            for (let i = 0; i < horas.length; i++) {
                let costumerPerHour = getRandomArbitrary(this.minCustomersPerHour, this.maxCustomersPerHour);
                let sales = Math.round(costumerPerHour * this.averageCostumerPerHour);
                totalSales += sales;
                salesPerHour.push(sales);
                this.cookiesEachHour.push(sales);
            }
            this.cookiesEachHour.push(totalSales);
            return salesPerHour;
        };

        this.render = function () {
            const row = document.createElement('tr');
            const cityCell = document.createElement('td');
            cityCell.textContent = this.ciudad;
            row.appendChild(cityCell);

            this.cookiesEachHour.forEach(function (cookies) {
                const cookiesCell = document.createElement('td');
                cookiesCell.textContent = cookies;
                row.appendChild(cookiesCell);
            });
            return row;
        };

        this.renderInfo = function () {
            const section = document.createElement('section');
            const title = document.createElement('h2');
            title.textContent = this.ciudad;
            section.appendChild(title);

            const ul = document.createElement('ul');
            this.cookiesEachHour.forEach(function (cookies, index) {
                const li = document.createElement('li');
                li.textContent = index < horas.length ? `${horas[index]}: ${cookies} cookies` : `Total: ${cookies} cookies`;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            return section;
        };
    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const seattleLocal = new Ubicacion('Seattle', 23, 65, 6.3);
    const tokyoLocal = new Ubicacion('Tokyo', 3, 24, 1.2);
    const dubaiLocal = new Ubicacion('Dubai', 11, 38, 3.7);
    const parisLocal = new Ubicacion('Paris', 20, 38, 2.3);
    const limaLocal = new Ubicacion('Lima', 2, 16, 4.6);

    const locales = [seattleLocal, tokyoLocal, dubaiLocal, parisLocal, limaLocal];
    locales.forEach(function (ubicacion) { ubicacion.estimateSales(); });

    if (body.classList.contains('sales-page')) {
        locales.forEach(function (ubicacion) {
            const locationRow = ubicacion.render();
            tbody.appendChild(locationRow);
        });

        updateFooter();
    }

    if (body.classList.contains('location-info-page')) {
        const storeInfo = document.getElementById('store-info');
        locales.forEach(function (ubicacion) {
            const locationInfo = ubicacion.renderInfo();
            storeInfo.appendChild(locationInfo);
        });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const inputCity = document.getElementById('city').value;
        const inputMinConsumer = parseInt(document.getElementById('minCostumer').value);
        const inputMaxConsumer = parseInt(document.getElementById('maxCostumer').value);
        const inputAverage = parseFloat(document.getElementById('avgCookies').value);

        const existentLocation = locales.find(function (ubicacion) {
            return ubicacion.ciudad === inputCity;
        });

        if (existentLocation) {
            alert('Ya existe una ubicación con el mismo nombre de ciudad.');
            form.reset();
            return;
        }

        const nuevaLocation = new Ubicacion(inputCity, inputMinConsumer, inputMaxConsumer, inputAverage);
        nuevaLocation.estimateSales();
        locales.push(nuevaLocation);

        if (body.classList.contains('sales-page')) {
            const newRow = nuevaLocation.render();
            tbody.appendChild(newRow);
            updateFooter();
        }

        if (body.classList.contains('location-info-page')) {
            const storeInfo = document.getElementById('store-info');
            const locationInfo = nuevaLocation.renderInfo();
            storeInfo.appendChild(locationInfo);
        }

        form.reset();
    });

    function updateFooter() {
        tfoot.innerHTML = '';
        const footerRow = document.createElement('tr');
        const totalCell = document.createElement('td');
        totalCell.textContent = 'Total';
        footerRow.appendChild(totalCell);

        let totalCookies = 0;
        for (let i = 0; i < horas.length; i++) {
            let totalHourCookies = 0;
            locales.forEach(function (ubicacion) {
                totalHourCookies += ubicacion.cookiesEachHour[i];
            });
            totalCookies += totalHourCookies;
            const totalCookiesCell = document.createElement('td');
            totalCookiesCell.textContent = totalHourCookies;
            footerRow.appendChild(totalCookiesCell);
        }
        const totalCookiesCell = document.createElement('td');
        totalCookiesCell.textContent = totalCookies;
        footerRow.appendChild(totalCookiesCell);
        tfoot.appendChild(footerRow);
    }
});