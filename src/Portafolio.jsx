import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL from './config';

const Portafolio = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Documentos Personales');
  const [searchQuery, setSearchQuery] = useState('');

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString(); // Formato legible según la configuración local
  };

  // Obtener los documentos del usuario
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/${userName}/documents`
        );
        console.log('Datos recibidos:', response.data); // Inspeccionar los datos

        // Enriquecer documentos con una fecha simulada si no existe
        const enrichedDocuments = response.data.documents.map((doc) => ({
          ...doc,
          fecha_registro: doc.fecha_registro || new Date().toISOString(),
        }));

        setFileList(enrichedDocuments);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los documentos:', error);
        Swal.fire('Error al cargar los documentos', '', 'error');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userName]);

  // Función para descargar un documento
  const handleDownload = async (file) => {
    try {
      const { documento, nombre_archivo } = file;

      const base64ContentArray = documento.split(',');
      const base64Data =
        base64ContentArray.length > 1 ? base64ContentArray[1] : documento;

      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: file.extension });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${nombre_archivo}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      Swal.fire('Error al descargar el archivo', '', 'error');
    }
  };

  // Filtrar documentos por nombre
  const filteredDocuments = fileList.filter((file) =>
    file.nombre_archivo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-contentPage">
      <h2 className="text-center mb-4">Portafolio de Documentos</h2>

      <div className="mb-3">
        <button
          className={`btn user-button ${userName === 'Documentos Personales' ? 'active' : ''}`}
          onClick={() => setUserName('Documentos Personales')}
        >
          Documentos Personales
        </button>
        <button
          className={`btn user-button ${userName === 'Diplomas' ? 'active' : ''}`}
          onClick={() => setUserName('Diplomas')}
        >
          Diplomas
        </button>
        <button
          className={`btn user-button ${userName === 'Documentos Generales' ? 'active' : ''}`}
          onClick={() => setUserName('Documentos Generales')}
        >
          Documentos Generales
        </button>
        <button
          className={`btn user-button ${userName === 'Documentos de Trabajo' ? 'active' : ''}`}
          onClick={() => setUserName('Documentos de Trabajo')}
        >
          Documentos de Trabajo
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar documento por nombre"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">Cargando documentos...</div>
      ) : (
        <div className="table-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No. del Documento</th>
                <th>Fecha de Registro</th>
                <th>Tipo de Documento</th>
                <th>Nombre de Documento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((file, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatFecha(file.fecha_registro)}</td>
                    <td>{file.extension}</td>
                    <td>{file.nombre_archivo}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleDownload(file)}
                      >
                        Descargar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No se encontraron documentos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portafolio;

