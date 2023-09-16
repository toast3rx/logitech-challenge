import open from "open";

import SDKClient from './sdk/client.js';

const initialData = {
  pluginId: 'logi_weather_plug_in',
  pluginCode: "123",
  pluginVersion: "1.2.3"
};

const clientApp = new SDKClient(initialData);
clientApp.init();

clientApp.onTriggerAction = async ({ id, message }) => {
  if (message.actionId === 'get_local_weather') {
    await open('https://wttr.in');    
  }
};
