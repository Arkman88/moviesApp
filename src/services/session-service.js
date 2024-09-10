import { API_KEY } from './config';

class sessionService {
  constructor() {
    this._apiBase = 'https://api.themoviedb.org/3';
  }

  async fetchRequestToken() {
    const url = `${this._apiBase}/authentication/token/new?api_key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch request token, received ${res.status}`);
    }
    const data = await res.json();
    return data.request_token;
  }

  async createGuestSession(requestToken) {
    const url = `${this._apiBase}/authentication/guest_session/new?api_key=${API_KEY}&request_token=${requestToken}`;
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      throw new Error(`Could not create guest session, received ${res.status}`);
    }
    const data = await res.json();
    return data.guest_session_id;
  }

  async initializeGuestSession() {
    try {
      const requestToken = await this.fetchRequestToken();
      const guestSessionId = await this.createGuestSession(requestToken);
      return guestSessionId;
    } catch (error) {
      console.error('Error initializing guest session:', error);
    }
  }
}

export default sessionService;
