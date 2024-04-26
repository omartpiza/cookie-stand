'use strict';

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ubicacion = {
    create: function(ciudad, minCustomersPerHour, maxCustomersPerHour, averageCostumerPerHour) {
        return {
            ciudad: ciudad,
            minCustomersPerHour: minCustomersPerHour,
            maxCustomersPerHour: maxCustomersPerHour,
            averageCostumerPerHour: averageCostumerPerHour,
            cookiesEachHour: [],
        };
    }
};

const horas = ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', 'Total'];

function estimateSales(ubicacion) {
    const salesPerHour = [];
    let totalSales = 0;
    for (let i = 0; i < horas.length - 1; i++) {
        let costumerPerHour = getRandomArbitrary(ubicacion.minCustomersPerHour, ubicacion.maxCustomersPerHour);
        let sales = Math.round(costumerPerHour * ubicacion.averageCostumerPerHour);
        totalSales += sales;
        salesPerHour.push(sales);
        ubicacion.cookiesEachHour.push(sales);
    }
    ubicacion.cookiesEachHour.push(totalSales);
    return salesPerHour;
}

const seattleLocal = ubicacion.create('Seattle', 23, 65, 6.3);
const tokyoLocal = ubicacion.create('Tokyo', 3, 24, 1.2);
const dubaiLocal = ubicacion.create('Dubai', 11, 38, 3.7);
const parisLocal = ubicacion.create('Paris', 20, 38, 2.3);
const limaLocal = ubicacion.create('Lima', 2, 16, 4.6);

const locales = [seattleLocal, tokyoLocal, dubaiLocal, parisLocal, limaLocal];
locales.forEach(ubicacion => {estimateSales(ubicacion);});

const mainElement = document.querySelector('main');
locales.forEach(ubicacion => {
    const locationList = document.createElement('ul');
    const locationHeader = document.createElement('h2');
    locationHeader.textContent = ubicacion.ciudad;
    locationList.appendChild(locationHeader);
    for (let i = 0; i < horas.length; i++) {
        const listItem = document.createElement('li');
        if (i === horas.length - 1) {
            listItem.textContent = `${horas[i]}: ${ubicacion.cookiesEachHour[i]} galletas`;
        } else {
            listItem.textContent = `${horas[i]}: ${ubicacion.cookiesEachHour[i]} galletas`;
        }
        locationList.appendChild(listItem);
    }
    mainElement.appendChild(locationList);
});