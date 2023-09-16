import open from "open";

import SDKClient from './sdk/client.js';

const initialData = {
  pluginId: "logi_code_extend",
  pluginCode: "123",
  pluginVersion: "1.2.3",
};

const clientApp = new SDKClient(initialData);
clientApp.init();


clientApp.onTriggerAction = async ({ id, message }) => {
  console.log('onTriggerAction', id, message);
};
