import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

// 🔥 ЗААВАЛ — ганц л удаа, ЗӨВХӨН ЭНД
(global as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'pusher',

  key: 'gwbri4nlnyuqq8i3cr9e',

  // 🔥 Pusher lib cluster шаардана (Reverb-д нөлөөлөхгүй)
  cluster: 'mt1',

  wsHost: '192.168.1.28',
  wsPort: 8080,
  forceTLS: false,
  enabledTransports: ['ws'],

  authEndpoint: 'http://192.168.1.28/api/broadcasting/auth',
  autoConnect: false,
  auth: {
    headers: {
      Accept: 'application/json',
    },
  },
});
