const http = require('http')
const fs = require('fs')
const requests = require('requests')
const indexFile = fs.readFileSync("index.html", "utf-8")
const replaceVal = (tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp)
        temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min)
        temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max)
    return temperature
}
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Surat&appid=a8ee9563288f4cbbf889497861beb778&units=metric")
            .on('data', (chunk) => {
                const arrData = [JSON.parse(chunk)]
                console.log(arrData[0].main)
                const realTimeData = arrData.map((val)=>replaceVal(indexFile,val)).join(" ")
                res.write(realTimeData)
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
            });
    }
})

server.listen(3000,'127.0.0.1')