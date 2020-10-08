var server;
var btConnected = false;
let encoder = new TextEncoder('utf-8');

const masterService = '2392fab3-b378-4d6e-a995-3e37a5e7e1da';
const rgbService = '2392fab3-b378-4d6e-a995-4e37a5e7e1db';
const patternService = '2392fab3-b378-4d6e-a995-5e37a5e7e1da';

async function onBleConnect() {
    try {
        console.log('Requesting list of Bluetooth device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{name: ['BRIGHTLY']}],
            optionalServices: [masterService, 
                                rgbService,
                                patternService]
        });

        console.log('Connecting to Brightly device...');
        server = await device.gatt.connect();

        onDeviceConnected();
    } catch(error) {
        console.log('Error connecting to device: ' + error);
  }
}

function onDeviceConnected() {
    document.getElementById('connectDiv').style.display='none';
    document.getElementById('connectedText').textContent = 'Connected to Brightly!';

    document.getElementById('controls').style.opacity = 1;
    document.getElementById('controls').style.pointerEvents = "auto";
    document.getElementById('footer').style.opacity = 1;
    document.getElementById('footer').style.pointerEvents = "auto";

    btConnected = true;
}

async function bleSetMasterVals(type, val) {
    try {
        console.log('Getting Master LED Service...');
        const service = await server.getPrimaryService(masterService);

        switch(type) {
            case 'blackout':
                console.log('Connecting to ' + type + ' characteristic');
                const blackoutCharacteristic = await service.getCharacteristic('2392fab3-b378-4d6e-a195-3e37a5e7e1ea');

                val = val.toString();
                console.log('Writing ' + type + ' value: ' + val);
                const blackoutValue  = await blackoutCharacteristic.writeValue(encoder.encode(val));
                break;
            case 'brightness':
                console.log('Connecting to ' + type + ' characteristic');
                const brightnessCharacteristic = await service.getCharacteristic('2392fab3-b378-4d6e-a195-3e37a5e7e1eb');

                val = val.toString();
                console.log('Writing ' + type + ' value: ' + val);
                const brightnessValue  = await brightnessCharacteristic.writeValue(encoder.encode(val));
                break;
            case 'temperature':
                console.log('Connecting to ' + type + ' characteristic');
                const temperatureCharacteristic = await service.getCharacteristic('2392fab3-b378-4d6e-a195-3e37a5e7e1ec');

                val = val.toString();
                console.log('Writing ' + type + ' value: ' + val);
                const temperatureValue  = await temperatureCharacteristic.writeValue(encoder.encode(val));
                break;
        }
    } catch(error) {
        console.log('Error writing to master ' + type + '. Error: ' + error);
  }
}

async function bleSetRgbVals(rgbString) {
    try {
        console.log('Getting RGB Service...');
        const service = await server.getPrimaryService(rgbService);

        console.log('Connecting to RGB characteristic');
        const characteristic = await service.getCharacteristic('2392fab3-b378-4d6e-a295-4e37a5e7e1ec');

        console.log('Writing RGB value: ' + rgbString);
        const value  = await characteristic.writeValue(rgbString);

    } catch(error) {
        console.log('Error writing RGB values. Error: ' + error);
  }
}

async function bleSetPattern(patternString, rgbString) {
    try {
        console.log('Getting Pattern Service...');
        const service = await server.getPrimaryService(patternService);

        console.log('Connecting to Pattern RGB characteristic');
        const characteristic = await service.getCharacteristic('2392fab3-b378-4d6e-a395-5e37a5e7e1eb');

        console.log('Writing Pattern ' + patternString + ', RGB value: ' + rgbString);
        val = patternString + rgbString;
        const value  = await characteristic.writeValue(val);

    } catch(error) {
        console.log('Error writing RGB values. Error: ' + error);
  }
}
