const http = require('http');
const readline = require('readline');
const config = require('./config');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'В каком городе вы хотите узнать погоду ',
});

const myAPIKey = process.env.myAPIKey || config.myAPIKey

function weatherApi(key, city = config.city) {

    const url = `http://api.weatherstack.com/current?access_key=${key}&query=${city}`;
    http.get(url, (res) => {
        const {
            statusCode
        } = res
        if (statusCode !== 200) {
            console.log(`statusCode: ${statusCode}`)
            return
        }

        res.setEncoding('utf8')
        let rowData = ''
        res.on('data', (chunk) => rowData += chunk);
        res.on('end', () => {
            let parseData = JSON.parse(rowData)
            if (parseData.current === undefined) {
                rl.question('Ввеведите коретный город',
                    function (city) {
                        weatherApi(myAPIKey, city)
                    })
            } else {
                console.log(`Погода в ${city} : ${parseData.current.temperature}C`)
                rl.close();
            }
        })
    }).on('error', (err) => {
        console.error(err)
    })
}

rl.prompt();

rl.on('line', (line) => {
    weatherApi(myAPIKey, line)
})