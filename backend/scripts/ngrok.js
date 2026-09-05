require("dotenv").config();

const ngrok = require("@ngrok/ngrok");

(async function () {
  try {
    const listener = await ngrok.forward({
      addr: 3000,
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: "cake-plethora-bonsai.ngrok-free.dev",
    });

    console.log(`Available at: ${listener.url()}`);
  } catch (error) {
    console.error("NGROK ERROR:");
    console.error(error);
  }
})();

// IMPORTANT: keep ngrok process alive
process.stdin.resume();