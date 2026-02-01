import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native'; // 🔥 ЧУХАЛ

(global as any).Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'reverb',
  key: 'gwbri4nlnyuqq8i3cr9e',

  wsHost: '162.43.37.225',
  wsPort: 8080,
  wssPort: 8080,

  forceTLS: false,
  encrypted: false,
  enabledTransports: ['ws'],

  authEndpoint: 'http://162.43.37.225/api/broadcasting/auth',
  auth: {
    headers: {
      Accept: 'application/json',
    },
  },

  autoConnect: false,
})
