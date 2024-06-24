const express = require('express');
const { co2, hosting } = require("@tgwf/co2");

const app = express();
const co2Emission = new co2();
const co3Emission = new co2({ results: "segment" });
const bytesSent = 1000 * 1000 * 1000; // Example: 1GB
const greenHost = false;

const styles = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }
  .container {
    width: 80%;
    margin: auto;
    overflow: hidden;
  }
  header {
    background: #333;
    color: #fff;
    padding-top: 30px;
    min-height: 70px;
    border-bottom: #77aaff 3px solid;
  }
  header a {
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 16px;
  }
  header ul {
    padding: 0;
    list-style: none;
  }
  header li {
    display: inline;
    padding: 0 20px 0 20px;
  }
  header nav {
    float: right;
    margin-top: 10px;
  }
  .content {
    padding: 20px;
    background: #fff;
    margin-top: 20px;
    border: #ccc 1px solid;
    border-radius: 5px;
    white-space: pre-wrap;
    font-family: monospace;
    font-size:20px;
  }
  .footer {
    background: #333;
    color: #fff;
    text-align: center;
    padding: 10px;
    margin-top: 20px;
  }
`;

const menu = `
  <header>
    <div class="container">
      <h1>CO2 Emission Calculator</h1>
      <nav>
        <ul>
          <li><a href="/api/co2-per-visit">CO2 per Visit</a></li>
          <li><a href="/api/co2-per-visit-detailed">Detailed CO2 per Visit</a></li>
          <li><a href="/api/check-hosting">Check Hosting</a></li>
          <li><a href="/api/co2-per-byte">CO2 per Byte</a></li>
        </ul>
      </nav>
    </div>
  </header>
`;

app.get('/api/co2-per-visit', (req, res) => {
  const estimatedCO3 = co3Emission.perVisit(bytesSent, greenHost);
  res.send(`
    <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        ${menu}
        <div class="container">
          <div class="content">
            <h2>CO3 Emissions per Visit</h2>
            <pre>${JSON.stringify(estimatedCO3, null, 2)}</pre>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 CO2 Emission Calculator</p>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/co2-per-visit-detailed', (req, res) => {
  const options1 = {
    dataReloadRatio: 0.6,
    firstVisitPercentage: 0.9,
    returnVisitPercentage: 0.1,
    gridIntensity: {
      device: 565.629,
      dataCenter: { country: "TWN" },
      network: 442,
    },
  };
  const estimatedCO2 = co2Emission.perVisitTrace(bytesSent, greenHost, options1);
  res.send(`
    <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        ${menu}
        <div class="container">
          <div class="content">
            <h2>Detailed CO2 Emissions per Visit</h2>
            <pre>${JSON.stringify(estimatedCO2, null, 2)}</pre>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 CO2 Emission Calculator</p>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/check-hosting', (req, res) => {
  const options = {
    verbose: true,
    userAgentIdentifier: "myGreenApp",
  };
  hosting.check("google.com", options).then((result) => {
    res.send(`
      <html>
        <head>
          <style>${styles}</style>
        </head>
        <body>
          ${menu}
          <div class="container">
            <div class="content">
              <h2>Hosting Check</h2>
              <pre>${JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 CO2 Emission Calculator</p>
          </div>
        </body>
      </html>
    `);
  });
});

app.get('/api/co2-per-byte', (req, res) => {
  const estimatedCO2PerByte = co2Emission.perByte(bytesSent, greenHost);
  res.send(`
    <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        ${menu}
        <div class="container">
          <div class="content">
            <h2>CO2 Emissions per Byte</h2>
            <pre>Sending a gigabyte had a carbon footprint of ${estimatedCO2PerByte.toFixed(3)} grams of CO2</pre>
            <pre>Estimated CO2 per Byte: ${estimatedCO2PerByte}</pre>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 CO2 Emission Calculator</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
