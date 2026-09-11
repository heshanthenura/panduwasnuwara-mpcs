export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('mpcs_client_id');
  if (!id) {
    id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('mpcs_client_id', id);
  }
  return id;
}
