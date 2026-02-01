import Echo from "laravel-echo";
import Pusher from "pusher-js";

(global as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: "reverb", // 🔥 ЧУХАЛ

  key: "local", // ямар ч string байж болно

  wsHost: "162.43.37.225",
  wsPort: 8080,
  wssPort: 8080,

  forceTLS: false, // 🔥 iOS-д заавал
  encrypted: false,
  enabledTransports: ["ws"],

  // 🔥 Auth
  authEndpoint: "http://162.43.37.225/api/broadcasting/auth",
  auth: {
    headers: {
      Accept: "application/json",
      // Authorization: `Bearer ${token}`, // private channel бол ЗААВАЛ
    },
  },

  autoConnect: false,
});
