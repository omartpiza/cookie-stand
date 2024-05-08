'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const toggleModeButton = document.getElementById('toggle-mode');
    const body = document.body;

    toggleModeButton.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        toggleInfoMode();
    });

    const form = document.getElementById('new-location-form');
    const tbody = document.querySelector('#sales-table tbody');
    const tfooter = document.querySelector('#sales-table tfoot');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const inputCity = document.getElementById('city').value;
        const inputMinConsumer = parseInt(document.getElementById('min-customers').value);
        const inputMaxConsumer = parseInt(document.getElementById('max-customers').value);
        const inputAverage = parseFloat(document.getElementById('avg-cookies').value);

        const existentLocation = locales.find(function(ubicacion) {
            form.reset();
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

        const newRow = nuevaLocation.render();
        tbody.appendChild(newRow);

        updateFooter();
        form.reset();
        });
    });

function toggleInfoMode() {
    const locationInfoItems = document.querySelectorAll('.location-info-page h2, .location-info-page li');
    locationInfoItems.forEach(function(item) {
        item.classList.toggle('dark-mode');
    });
}

function Ubicacion(ciudad, minCustomersPerHour, maxCustomersPerHour, averageCostumerPerHour) {
    this.ciudad = ciudad;
    this.minCustomersPerHour = minCustomersPerHour;
    this.maxCustomersPerHour = maxCustomersPerHour;
    this.averageCostumerPerHour = averageCostumerPerHour;
    this.cookiesEachHour = [];

    this.estimateSales = function() {
        const salesPerHour = [];
        let totalSales = 0;
        for (let i = 0; i < horas.length - 1; i++) {
            let costumerPerHour = getRandomArbitrary(this.minCustomersPerHour, this.maxCustomersPerHour);
            let sales = Math.round(costumerPerHour * this.averageCostumerPerHour);
            totalSales += sales;
            salesPerHour.push(sales);
            this.cookiesEachHour.push(sales);
        }
        this.cookiesEachHour.push(totalSales);
        return salesPerHour;
    };

    this.render = function() {
        const row = document.createElement('tr');
        const cityCell = document.createElement('td');
        cityCell.textContent = this.ciudad;
        row.appendChild(cityCell);

        this.cookiesEachHour.forEach(function(cookies) {
            const cookiesCell = document.createElement('td');
            cookiesCell.textContent = cookies ;
            row.appendChild(cookiesCell);
        });

        return row;
    };
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const horas = ['6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm', 'Total'];

const seattleLocal = new Ubicacion('Seattle', 23, 65, 6.3);
const tokyoLocal = new Ubicacion('Tokyo', 3, 24, 1.2);
const dubaiLocal = new Ubicacion('Dubai', 11, 38, 3.7);
const parisLocal = new Ubicacion('Paris', 20, 38, 2.3);
const limaLocal = new Ubicacion('Lima', 2, 16, 4.6);

const locales = [seattleLocal, tokyoLocal, dubaiLocal, parisLocal, limaLocal];
locales.forEach(function(ubicacion) {ubicacion.estimateSales();});

const mainElement = document.querySelector('main');

if (document.body.classList.contains('sales-page')) {
    const table = document.createElement('table');
    table.id = 'sales-table';
    const headerRow = document.createElement('tr');
    const emptyCell = document.createElement('th');
    headerRow.appendChild(emptyCell);
    horas.forEach(function(hora) {
        const headerCell = document.createElement('th');
        headerCell.textContent = hora;
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    const tbody = document.createElement('tbody');
    locales.forEach(function(ubicacion) {
        const locationRow = ubicacion.render();
        tbody.appendChild(locationRow);
    });
    table.appendChild(tbody);

    const footerRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    totalCell.textContent = 'Total';
    footerRow.appendChild(totalCell);
    let totalCookies = 0;
    for (let i = 0; i < horas.length-1 ; i++) {
        let totalHourCookies = 0;
        locales.forEach(function(ubicacion) {
            totalHourCookies += ubicacion.cookiesEachHour[i];
        });
        totalCookies += totalHourCookies;
        const totalCookiesCell = document.createElement('td');
        totalCookiesCell.textContent = totalHourCookies;
        footerRow.appendChild(totalCookiesCell);
    }
    const totalCookiesCell = document.createElement('td');
    totalCookiesCell.textContent = totalCookies ;
    footerRow.appendChild(totalCookiesCell);
    table.appendChild(footerRow);
    mainElement.appendChild(table);   
}

function createLocationInfo(ciudad, horario, telefono, direccion) {
    return {
        ciudad: ciudad,
        horario: horario,
        telefono: telefono,
        direccion: direccion
    };
}

const seattleInfo = createLocationInfo('Seattle', '6am - 7pm', '2901 3rd Ave #300, Seattle, WA 98121', '123-456-7890');
const tokyoInfo = createLocationInfo('Tokyo', '6am - 7pm', '1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-8634', '222-222-2222');
const dubaiInfo = createLocationInfo('Dubai', '6am - 7pm', '1 Sheikh Mohammed bin Rashid Blvd - Dubai', '333-333-3333');
const parisInfo = createLocationInfo('Paris', '6am - 7pm', 'Cahmp de Mars, 5 Avenue Anatole France, 75007 Paris', '444-444-4444');
const limaInfo = createLocationInfo('Lima', '6am - 7pm', 'Ca. Gral. Borgoño Cuadra 8, Miraflores 1504', '555-555-5555');

const locationInfos = [seattleInfo, tokyoInfo, dubaiInfo, parisInfo, limaInfo];

if (document.body.classList.contains('location-info-page')) {
    locationInfos.forEach(function(info) {
        const locationInfo = document.createElement('div');
        const infoHeader = document.createElement('h2');
        const infoList = document.createElement('ul');

        infoHeader.textContent = info.ciudad;
        locationInfo.appendChild(infoHeader);

        const hoursOpenItem = document.createElement('li');
        hoursOpenItem.textContent = 'Hours Open: ' + info.horario;
        infoList.appendChild(hoursOpenItem);

        const contactInfoItem = document.createElement('li');
        contactInfoItem.textContent = 'Contact Info: ' + info.telefono;
        infoList.appendChild(contactInfoItem);

        const locationItem = document.createElement('li');
        locationItem.textContent = 'Location: ' + info.direccion;
        infoList.appendChild(locationItem);

        locationInfo.appendChild(infoList);
        mainElement.appendChild(locationInfo);
    });
}