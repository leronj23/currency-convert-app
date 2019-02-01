require('dotenv').config();
var keys = require('./keys.js');
const axios = require("axios");
var inquirer = require('inquirer');

const getExchangeRate = async (from, to) => {
    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${keys.fixerio.api}`)
    const euro = 1 / response.data.rates[from];
    return euro * response.data.rates[to];
}

const getCountries = async (currencyCode) => {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`)
    return response.data.map((country) => country.name);
}

const covertCurrency = async (from, to, amount) => {
    const rate = await getExchangeRate(from, to);
    const countries = await getCountries(to);
    const convertedAmount = (amount * rate).toFixed(2);

    console.log(`${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`)
}

inquirer
    .prompt([
        {
            type: "input",
            name: "from",
            message: "Country code to convert from?"
        }, {
            type: "input",
            name: "to",
            message: "Country code to convert to?"
        }, {
            type: "input",
            name: "amount",
            message: "Convert this amount?"
        }
    ])
    .then(answers => {

        covertCurrency(answers.from.toUpperCase(), answers.to.toUpperCase(), answers.amount)
    });