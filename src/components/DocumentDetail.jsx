import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SafeIcon from '../common/SafeIcon';
import { useDocuments } from '../contexts/DocumentContext';
import AddVersionModal from './AddVersionModal';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiPlus, FiEdit, FiCalendar, FiUser, FiTag, FiFileText, FiClock, FiCheck, FiArchive, FiFolder, FiFile, FiMessageSquare, FiLink, FiExternalLink, FiCopy, FiUpload, FiDownload, FiCpu, FiEdit3, FiImage, FiVideo, FiMusic } = FiIcons;

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, updateDocument } = useDocuments();
  const [document, setDocument] = useState(null);
  const [showAddVersionModal, setShowAddVersionModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [expandedVersions, setExpandedVersions] = useState({});

  useEffect(() => {
    const doc = getDocumentById(id);
    if (doc) {
      setDocument(doc);
      setEditData({
        title: doc.title,
        description: doc.description,
        tags: doc.tags?.join(', ') || '',
        status: doc.status
      });
    } else {
      navigate('/documents');
    }
  }, [id, getDocumentById, navigate]);

  const handleSaveEdit = () => {
    const updates = {
      ...editData,
      tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    updateDocument(id, updates);
    setDocument({ ...document, ...updates });
    setEditMode(false);
  };

  const toggleVersionExpansion = (versionId) => {
    setExpandedVersions(prev => ({
      ...prev,
      [versionId]: !prev[versionId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías agregar una notificación de éxito
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return FiEdit;
      case 'review': return FiClock;
      case 'approved': return FiCheck;
      case 'archived': return FiArchive;
      default: return FiFileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'review': return 'En Revisión';
      case 'approved': return 'Aprobado';
      case 'archived': return 'Archivado';
      default: return status;
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'document': return FiFileText;
      case 'pdf': return FiFile;
      case 'image': return FiImage;
      case 'video': return FiVideo;
      case 'audio': return FiMusic;
      case 'spreadsheet': return FiFile;
      case 'presentation': return FiFile;
      default: return FiFile;
    }
  };

  const getAIColor = (aiUsed) => {
    switch (aiUsed?.toLowerCase()) {
      case 'chatgpt': return 'bg-green-100 text-green-800';
      case 'gpt-4': return 'bg-green-100 text-green-800';
      case 'claude': return 'bg-purple-100 text-purple-800';
      case 'gemini': return 'bg-blue-100 text-blue-800';
      case 'copilot': return 'bg-indigo-100 text-indigo-800';
      case 'perplexity': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <SafeIcon icon={FiFileText} className="text-gray-400 text-6xl mb-4 mx-auto" />
          <p className="text-gray-600">Cargando documento...</p>
        </div>
      </div>
    );
  }

  const currentVersion = document.versions.find(v => v.status === 'current');
  const sortedVersions = [...document.versions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/documents"
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} />
            <span>Volver a documentos</span>
          </Link>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={FiEdit} />
            <span>{editMode ? 'Cancelar' : 'Editar'}</span>
          </button>
          <button
            onClick={() => setShowAddVersionModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Nueva Versión</span>
          </button>
        </div>
      </div>

      {/* Document Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="draft">Borrador</option>
                <option value="review">En Revisión</option>
                <option value="approved">Aprobado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
              <input
                type="text"
                value={editData.tags}
                onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                placeholder="Separadas por comas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveEdit}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
                <p className="text-gray-600 text-lg">{document.description}</p>
              </div>
              <div className="ml-6">
                <span className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
                  <SafeIcon icon={getStatusIcon(document.status)} className="text-sm" />
                  <span>{getStatusText(document.status)}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiFileText} />
                  <span>Versión actual: <strong>{document.currentVersion}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiCalendar} />
                  <span>Creado: {format(new Date(document.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiClock} />
                  <span>Actualizado: {format(new Date(document.updatedAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiUser} />
                  <span>Autor: {currentVersion?.author || 'No especificado'}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Total de versiones: <strong>{document.versions.length}</strong></span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Categoría: <strong>{document.category === 'thesis' ? 'Tesis' : document.category}</strong></span>
                </div>
              </div>

              <div>
                {document.tags && document.tags.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <SafeIcon icon={FiTag} />
                      <span>Etiquetas:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Version History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Historial de Versiones</h2>
        
        <div className="space-y-4">
          {sortedVersions.map((version, index) => (
            <div
              key={version.id}
              className={`rounded-lg border-2 ${
                version.status === 'current'
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Version Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      version.status === 'current'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      v{version.version}
                    </span>
                    <h3 className="font-semibold text-gray-900">{version.description}</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500">
                      {format(new Date(version.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                    </div>
                    <button
                      onClick={() => toggleVersionExpansion(version.id)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {expandedVersions[version.id] ? 'Contraer' : 'Expandir'}
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{version.changes}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiUser} />
                    <span>{version.author}</span>
                  </span>
                  {version.status === 'current' && (
                    <span className="flex items-center space-x-1 text-primary-600">
                      <SafeIcon icon={FiCheck} />
                      <span>Versión actual</span>
                    </span>
                  )}
                  {version.prompts && version.prompts.length > 0 && (
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiMessageSquare} />
                      <span>{version.prompts.length} prompt{version.prompts.length !== 1 ? 's' : ''}</span>
                    </span>
                  )}
                  {version.attachedFiles && version.attachedFiles.length > 0 && (
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiUpload} />
                      <span>{version.attachedFiles.length} archivo{version.attachedFiles.length !== 1 ? 's' : ''}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Version Details */}
              {expandedVersions[version.id] && (
                <div className="border-t border-gray-200 bg-white p-4 space-y-6">
                  {/* File Information */}
                  {(version.fileLocation || version.fileName) && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <SafeIcon icon={FiFile} className="text-blue-600" />
                        <span>Archivo Principal</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        {version.fileName && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Nombre:</span>
                            <span className="font-mono text-gray-900">{version.fileName}</span>
                          </div>
                        )}
                        {version.fileLocation && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Ubicación:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-gray-900 truncate max-w-xs" title={version.fileLocation}>
                                {version.fileLocation}
                              </span>
                              <button
                                onClick={() => copyToClipboard(version.fileLocation)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Copiar ruta"
                              >
                                <SafeIcon icon={FiCopy} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prompts */}
                  {version.prompts && version.prompts.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <SafeIcon icon={FiMessageSquare} className="text-blue-600" />
                        <span>Prompts Utilizados ({version.prompts.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {version.prompts.map((prompt, promptIndex) => (
                          <div key={prompt.id} className="bg-white p-3 rounded border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">
                                  {prompt.name || `Prompt ${promptIndex + 1}`}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAIColor(prompt.aiUsed)}`}>
                                  <SafeIcon icon={FiCpu} className="inline mr-1" />
                                  {prompt.aiUsed}
                                </span>
                                <span className="text-xs text-gray-500">
                                  <SafeIcon icon={FiCalendar} className="inline mr-1" />
                                  {format(new Date(prompt.date), "d MMM yyyy, HH:mm", { locale: es })}
                                </span>
                              </div>
                              <button
                                onClick={() => copyToClipboard(prompt.content)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Copiar prompt"
                              >
                                <SafeIcon icon={FiCopy} />
                              </button>
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mb-2">
                              <p className="whitespace-pre-wrap">{prompt.content}</p>
                            </div>
                            {prompt.notes && (
                              <p className="text-xs text-gray-600 italic">
                                <SafeIcon icon={FiEdit3} className="inline mr-1" />
                                {prompt.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attached Files Repository */}
                  {version.attachedFiles && version.attachedFiles.length > 0 && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <SafeIcon icon={FiUpload} className="text-purple-600" />
                        <span>Repositorio de Archivos ({version.attachedFiles.length})</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {version.attachedFiles.map((file, fileIndex) => (
                          <div key={file.id} className="bg-white p-3 rounded border border-purple-200">
                            <div className="flex items-start space-x-3">
                              <div className="bg-purple-100 p-2 rounded">
                                <SafeIcon icon={getFileIcon(file.type)} className="text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                                <p className="text-xs text-gray-600 mb-1">{file.description}</p>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <span>{file.size}</span>
                                  <span>
                                    {format(new Date(file.uploadDate), "d MMM yyyy", { locale: es })}
                                  </span>
                                </div>
                              </div>
                              <button className="p-1 text-gray-400 hover:text-gray-600" title="Descargar">
                                <SafeIcon icon={FiDownload} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Documents */}
                  {version.relatedDocuments && version.relatedDocuments.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <SafeIcon icon={FiLink} className="text-green-600" />
                        <span>Documentos Relacionados</span>
                      </h4>
                      <div className="space-y-2">
                        {version.relatedDocuments.map((doc, docIndex) => (
                          <div key={docIndex} className="flex items-center justify-between bg-white p-2 rounded border border-green-200">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-600 font-mono truncate">{doc.url}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => copyToClipboard(doc.url)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Copiar ruta"
                              >
                                <SafeIcon icon={FiCopy} />
                              </button>
                              {doc.url.startsWith('http') && (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Abrir enlace"
                                >
                                  <SafeIcon icon={FiExternalLink} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Version Modal */}
      <AddVersionModal
        isOpen={showAddVersionModal}
        onClose={() => setShowAddVersionModal(false)}
        documentId={id}
        currentVersion={document.currentVersion}
      />
    </motion.div>
  );
};

export default DocumentDetail;