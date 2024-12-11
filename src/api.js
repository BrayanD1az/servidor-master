import API_BASE_URL from './config';

export const fetchIpData = async () => {
  const response = await fetch(`${API_BASE_URL}/get-ip`);
  if (!response.ok) throw new Error('Error al obtener la IP');
  return response.json();
};

export const verifyIp = async (ip) => {
  const response = await fetch(`${API_BASE_URL}/ips/check-or-save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { status: response.status, error: data.error };
  }

  return data;
};
