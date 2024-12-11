import React, { useState, useEffect } from 'react';
import API_BASE_URL from './config';

const AdminIPs = () => {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIPs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/ips`);
        if (!response.ok) throw new Error('Error al obtener las IPs');
        const data = await response.json();
        setIps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIPs();
  }, []);

  const toggleBlockStatus = async (ipEntry) => {
    try {
      const updatedStatus = !ipEntry.bloqueada;
      const response = await fetch(`${API_BASE_URL}/ips/${ipEntry.ip}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloqueada: updatedStatus }),
      });
      if (!response.ok) throw new Error('Error al actualizar el estado de la IP');
      const updatedIP = await response.json();

      setIps((prevIps) =>
        prevIps.map((item) =>
          item.ip === updatedIP.ip ? updatedIP : item
        )
      );
    } catch (err) {
      alert('Error al actualizar el estado de la IP');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="admin-ips-container">
      <h2>Administrar IPs</h2>
      <table className="table">
        <thead>
          <tr>
            <th>IP</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ips.map((ip) => (
            <tr key={ip.ip}>
              <td>{ip.ip}</td>
              <td>{ip.bloqueada ? 'Bloqueada' : 'Activa'}</td>
              <td>
                <button
                  onClick={() => toggleBlockStatus(ip)}
                  className={`btn ${ip.bloqueada ? 'btn-danger' : 'btn-success'}`}
                >
                  {ip.bloqueada ? 'Desbloquear' : 'Bloquear'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminIPs;
