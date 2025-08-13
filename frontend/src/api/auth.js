import api, { setAuthToken } from '../services/api';

export async function login(username, password) {
  const res = await api.post('/auth/login', { username, password });
  const token = res.data.token;
  setAuthToken(token);
  return token;
}

// optional register (useful to seed manager quickly)
export async function register(username, password) {
  await api.post('/auth/register', { username, password });
}
