import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import DocumentForm from './DocumentForm';
import Portafolio from './Portafolio';
import Login from './Login';
import AdminIPs from './AdminIPs'; // Importar el nuevo componente
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilos.css';

const App = () => {
  const [fileList, setFileList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación

  const addDocument = (document) => {
    setFileList([...fileList, document]);
  };

  // Función para eliminar un documento
  const deleteDocument = (docId) => {
    setFileList(fileList.filter((file) => file.id !== docId));
  };

  // Función para editar un documento
  const editDocument = (updatedDocument) => {
    setFileList(
      fileList.map((file) =>
        file.id === updatedDocument.id ? updatedDocument : file
      )
    );
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      ) : (
        <div>
          <section className="full-box cover dashboard-sideBar">
            <div className="full-box dashboard-sideBar-ct">
              <div className="full-box text-uppercase text-center text-titles dashboard-sideBar-title">
                Servidor
              </div>

              <ul className="list-unstyled full-box dashboard-sideBar-Menu">
                <li>
                  <Link to="/">Principal</Link>
                </li>
                <li>
                  <Link to="/portafolio">Portafolio</Link>
                </li>
                <li>
                  <Link to="/documents">Documentos</Link>
                </li>
                <li>
                  <Link to="/admin">Administrar IPs</Link>
                </li>
              </ul>

              <div className="full-box text-center mt-auto">
                <button onClick={handleLogout} className="btn btn-transparent">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </section>

          <section className="full-box dashboard-contentPage">
            <Routes>
              <Route path="/" element={<h2>Bienvenido a tu página institucional</h2>} />
              <Route path="/documents" element={<DocumentForm addDocument={addDocument} />} />
              <Route
                path="/portafolio"
                element={
                  <Portafolio
                    fileList={fileList}
                    deleteDocument={deleteDocument}
                    editDocument={editDocument}
                  />
                }
              />
              <Route path="/admin" element={<AdminIPs />} /> {/* Nueva ruta */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </section>
        </div>
      )}
    </Router>
  );
};

export default App;
