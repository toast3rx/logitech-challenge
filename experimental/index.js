import open from "open";

import SDKClient from "./sdk/client.js";

const initialData = {
  pluginId: "logi_code_extend",
  pluginCode: "123",
  pluginVersion: "1.2.3",
};

const clientApp = new SDKClient(initialData);
clientApp.init();

const FIRST_BUTTON = "mx-master-3s-2b034_c86";
const SECOND_BUTTON = "mx-master-3s-2b034_c83";
const SCROLL_BUTTON = "mx-master-3s-2b034_c82";
const THUMB_BUTTON = "mx-master-3s-2b034_c195";
const PROFILE_BUTTON = "mx-master-3s-2b034_c196";

clientApp.onTriggerAction = async ({ id, message }) => {
  console.log("onTriggerAction", id, message);

  switch (message.actionInstanceId) {
    case FIRST_BUTTON:
      console.log("First button pressed");
      break;
    case SECOND_BUTTON:
      console.log("Second button pressed");
      break;
    case SCROLL_BUTTON:
      console.log("Scroll button pressed");
      break;
    case PROFILE_BUTTON:
      console.log("Profile button pressed");
      break;
    case THUMB_BUTTON:
      console.log("Thumb button pressed");
      break;
    default:
      console.log(message);
  }
};

clientApp.onUpdateAnalogControl = async ({ id, message }) => {
  // message.delta = direction of the wheel
  // > 0 => going up, < -0 => going down
  console.log("onUpdateAnalogControl", id, message);
};
