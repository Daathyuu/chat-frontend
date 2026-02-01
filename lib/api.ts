import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.27/api';

export type ApiResponse = {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
};

export type Dancer = {
  id: number
  name: string
  avatar?: string
  media?: {
    type: 'image' | 'video'
    url: string
  }[]
}

export type User = {
  id: number
  name: string
  phone: string
  email?: string
  avatar?: string
  is_pin_set: boolean
}


async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function post<T = ApiResponse>(
  path: string,
  body: any,
  withAuth: boolean = false
): Promise<T> {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = await AsyncStorage.getItem('token');
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  let data: ApiResponse | null = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      (data?.errors && Object.values(data.errors)[0]?.[0]) ||
      'Алдаа гарлаа';

    throw new Error(message);
  }

  return data as T;
}

async function get<T = ApiResponse>(
  path: string,
  withAuth: boolean = false
): Promise<T> {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = await AsyncStorage.getItem('token');
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers,
  });

  let data: ApiResponse | null = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      (data?.errors && Object.values(data.errors)[0]?.[0]) ||
      'Алдаа гарлаа';

    throw new Error(message);
  }

  return data as T;
}


// ---------------- API ----------------

export function registerPhone(phone: string) {
  return post('/register/phone', { phone });
}

export function verifyOtp(phone: string, otp: string) {
  return post('/register/verify-otp', { phone, otp });
}

export function setPassword(phone: string, password: string) {
  return post('/register/set-password', { phone, password });
}

export function login(phone: string, password: string) {
  return post('/login', { phone, password });
}
export function verifyInvite(code: string) {
  return post('/invite/verify', { code });
}

export function startChatWithUser(userId: number) {
  return post('/chats/start', { user_id: userId }, true);
}

export function getChats() {
  return get(`/chats`, true);
}


export function getMessages(chatId: number) {
  return get(`/chats/${chatId}/messages`, true);
}

export function createChat(payload: { user_id?: number }) {
  return post('/chats', payload, true);
}

export function sendMessage(payload: {
  chat_id: number;
  user_id: number;
  message: string;
}) {
  return post('/messages', payload, true);
}

export function getDancer(id: number | string) {
  return get<Dancer>(`/dancers/${id}`, true)
}

export function getMe() {
  return get<User>('/user', true)
}

export function updateMe(payload: {
  name?: string
  email?: string | null
  avatar?: string | null
}) {
  return post('/user', payload, true)
}
export async function uploadAvatar(file: {
  uri: string
  name: string
  type: string
}) {
  const token = await AsyncStorage.getItem('token')

  const form = new FormData()
  form.append('avatar', file as any)

  const res = await fetch(`${BASE_URL}/user/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })

  const data = await res.json()
  return data as { avatar: string }
}

export function updatePassword(payload: {
  current_password: string
  password: string
  password_confirmation: string
}) {
  return post('/user/password', payload, true)
}

export function setUserPin(pin: string) {
  return post('/user/pin/setup', { pin, is_pin_set: 1 }, true)
}

export function verifyUserPin(pin: string) {
  return post('/user/pin/verify', { pin }, true)
}

export function changeUserPin(payload: {
  current_pin: string
  pin: string
}) {
  return post('/user/pin/change', payload, true)
}
export function getSliders() {
  return get('/sliders',true)
}

export function getDancers() {
  return get('/dancers', true) // auth шаардлагатай бол true
}