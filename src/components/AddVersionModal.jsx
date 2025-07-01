import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useDocuments } from '../contexts/DocumentContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiGitBranch, FiPlus, FiTrash2, FiFolder, FiFile, FiMessageSquare, FiLink, FiUpload, FiCalendar, FiCpu, FiEdit3, FiDownload, FiFileText, FiImage, FiVideo, FiMusic } = FiIcons;

const AddVersionModal = ({ isOpen, onClose, documentId, currentVersion }) => {
  const { addVersion } = useDocuments();
  const [formData, setFormData] = useState({
    version: '',
    description: '',
    changes: '',
    author: 'Estudiante Doctoral',
    fileLocation: '',
    fileName: '',
    prompts: [],
    relatedDocuments: [],
    attachedFiles: []
  });

  const generateNextVersion = () => {
    const parts = currentVersion.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2]);
    
    return `${major}.${minor}.${patch + 1}`;
  };

  const generateNextMinorVersion = () => {
    const parts = currentVersion.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    
    return `${major}.${minor + 1}.0`;
  };

  const generateNextMajorVersion = () => {
    const parts = currentVersion.split('.');
    const major = parseInt(parts[0]);
    
    return `${major + 1}.0.0`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addVersion(documentId, formData);
    onClose();
    setFormData({
      version: '',
      description: '',
      changes: '',
      author: 'Estudiante Doctoral',
      fileLocation: '',
      fileName: '',
      prompts: [],
      relatedDocuments: [],
      attachedFiles: []
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVersionSuggestion = (version) => {
    setFormData({
      ...formData,
      version
    });
  };

  // Prompt management functions
  const addPrompt = () => {
    const newPrompt = {
      id: Date.now().toString(),
      name: '',
      content: '',
      aiUsed: 'ChatGPT',
      date: new Date().toISOString(),
      notes: ''
    };
    setFormData({
      ...formData,
      prompts: [...formData.prompts, newPrompt]
    });
  };

  const removePrompt = (index) => {
    const newPrompts = formData.prompts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      prompts: newPrompts
    });
  };

  const updatePrompt = (index, field, value) => {
    const newPrompts = formData.prompts.map((prompt, i) => 
      i === index ? { ...prompt, [field]: value } : prompt
    );
    setFormData({
      ...formData,
      prompts: newPrompts
    });
  };

  // Related documents management
  const addRelatedDocument = () => {
    setFormData({
      ...formData,
      relatedDocuments: [...formData.relatedDocuments, { name: '', url: '' }]
    });
  };

  const removeRelatedDocument = (index) => {
    const newRelatedDocs = formData.relatedDocuments.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      relatedDocuments: newRelatedDocs
    });
  };

  const updateRelatedDocument = (index, field, value) => {
    const newRelatedDocs = formData.relatedDocuments.map((doc, i) => 
      i === index ? { ...doc, [field]: value } : doc
    );
    setFormData({
      ...formData,
      relatedDocuments: newRelatedDocs
    });
  };

  // File repository management
  const addAttachedFile = () => {
    const newFile = {
      id: Date.now().toString(),
      name: '',
      type: 'document',
      size: '',
      uploadDate: new Date().toISOString(),
      description: ''
    };
    setFormData({
      ...formData,
      attachedFiles: [...formData.attachedFiles, newFile]
    });
  };

  const removeAttachedFile = (index) => {
    const newFiles = formData.attachedFiles.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attachedFiles: newFiles
    });
  };

  const updateAttachedFile = (index, field, value) => {
    const newFiles = formData.attachedFiles.map((file, i) => 
      i === index ? { ...file, [field]: value } : file
    );
    setFormData({
      ...formData,
      attachedFiles: newFiles
    });
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

  const aiOptions = [
    'ChatGPT',
    'GPT-4',
    'Claude',
    'Gemini',
    'Copilot',
    'Perplexity',
    'Otro'
  ];

  const fileTypeOptions = [
    { value: 'document', label: 'Documento' },
    { value: 'pdf', label: 'PDF' },
    { value: 'image', label: 'Imagen' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'spreadsheet', label: 'Hoja de cálculo' },
    { value: 'presentation', label: 'Presentación' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <SafeIcon icon={FiGitBranch} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Nueva Versión</h2>
                  <p className="text-sm text-gray-600">Versión actual: {currentVersion}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Información básica de la versión */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de versión *
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: 2.1.0"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleVersionSuggestion(generateNextVersion())}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Patch: {generateNextVersion()}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVersionSuggestion(generateNextMinorVersion())}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Minor: {generateNextMinorVersion()}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVersionSuggestion(generateNextMajorVersion())}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Major: {generateNextMajorVersion()}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de la versión *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Revisión con comentarios del comité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambios realizados *
                </label>
                <textarea
                  name="changes"
                  value={formData.changes}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe los cambios principales realizados en esta versión..."
                />
              </div>

              {/* Información del archivo */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiFile} className="text-primary-600" />
                  <span>Información del Archivo Principal</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiFolder} className="inline mr-1" />
                      Ubicación del archivo
                    </label>
                    <input
                      type="text"
                      name="fileLocation"
                      value={formData.fileLocation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: /Documents/Tesis/Propuesta_v2.1.0.docx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiFile} className="inline mr-1" />
                      Nombre del archivo
                    </label>
                    <input
                      type="text"
                      name="fileName"
                      value={formData.fileName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: Propuesta_v2.1.0.docx"
                    />
                  </div>
                </div>
              </div>

              {/* Prompts utilizados */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <SafeIcon icon={FiMessageSquare} className="text-blue-600" />
                    <span>Prompts Utilizados</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addPrompt}
                    className="flex items-center space-x-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span>Agregar Prompt</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.prompts.map((prompt, index) => (
                    <div key={prompt.id} className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Prompt #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removePrompt(index)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            <SafeIcon icon={FiEdit3} className="inline mr-1" />
                            Nombre del prompt
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Revisión metodología"
                            value={prompt.name}
                            onChange={(e) => updatePrompt(index, 'name', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            <SafeIcon icon={FiCpu} className="inline mr-1" />
                            IA utilizada
                          </label>
                          <select
                            value={prompt.aiUsed}
                            onChange={(e) => updatePrompt(index, 'aiUsed', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            {aiOptions.map(ai => (
                              <option key={ai} value={ai}>{ai}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            <SafeIcon icon={FiCalendar} className="inline mr-1" />
                            Fecha
                          </label>
                          <input
                            type="datetime-local"
                            value={prompt.date ? new Date(prompt.date).toISOString().slice(0, 16) : ''}
                            onChange={(e) => updatePrompt(index, 'date', new Date(e.target.value).toISOString())}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Contenido del prompt
                        </label>
                        <textarea
                          placeholder="Pega aquí el prompt utilizado..."
                          value={prompt.content}
                          onChange={(e) => updatePrompt(index, 'content', e.target.value)}
                          rows={3}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Notas adicionales
                        </label>
                        <input
                          type="text"
                          placeholder="Notas sobre el contexto o resultado..."
                          value={prompt.notes}
                          onChange={(e) => updatePrompt(index, 'notes', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {formData.prompts.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">
                      No hay prompts agregados aún
                    </p>
                  )}
                </div>
              </div>

              {/* Repositorio de archivos */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <SafeIcon icon={FiUpload} className="text-purple-600" />
                    <span>Repositorio de Archivos</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addAttachedFile}
                    className="flex items-center space-x-2 text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span>Agregar Archivo</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.attachedFiles.map((file, index) => (
                    <div key={file.id} className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={getFileIcon(file.type)} className="text-purple-600" />
                          <span className="font-medium text-gray-900">Archivo #{index + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachedFile(index)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nombre del archivo
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: documento.pdf"
                            value={file.name}
                            onChange={(e) => updateAttachedFile(index, 'name', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tipo de archivo
                          </label>
                          <select
                            value={file.type}
                            onChange={(e) => updateAttachedFile(index, 'type', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                          >
                            {fileTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tamaño
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: 2.3 MB"
                            value={file.size}
                            onChange={(e) => updateAttachedFile(index, 'size', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Fecha de subida
                          </label>
                          <input
                            type="date"
                            value={file.uploadDate ? new Date(file.uploadDate).toISOString().slice(0, 10) : ''}
                            onChange={(e) => updateAttachedFile(index, 'uploadDate', new Date(e.target.value).toISOString())}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Descripción del archivo
                        </label>
                        <input
                          type="text"
                          placeholder="Breve descripción del contenido..."
                          value={file.description}
                          onChange={(e) => updateAttachedFile(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {formData.attachedFiles.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">
                      No hay archivos adjuntos aún
                    </p>
                  )}
                </div>
              </div>

              {/* Documentos relacionados */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <SafeIcon icon={FiLink} className="text-green-600" />
                    <span>Documentos Relacionados</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addRelatedDocument}
                    className="flex items-center space-x-2 text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span>Agregar Documento</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.relatedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre del documento"
                          value={doc.name}
                          onChange={(e) => updateRelatedDocument(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Ruta o URL del documento"
                          value={doc.url}
                          onChange={(e) => updateRelatedDocument(index, 'url', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRelatedDocument(index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                    </div>
                  ))}
                  
                  {formData.relatedDocuments.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">
                      No hay documentos relacionados agregados aún
                    </p>
                  )}
                </div>
              </div>

              {/* Convención de versionado */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Convención de versionado:</h4>
                <div className="text-sm text-orange-800 space-y-1">
                  <p><strong>Major (X.0.0):</strong> Cambios importantes o reestructuración</p>
                  <p><strong>Minor (X.Y.0):</strong> Nuevas secciones o contenido significativo</p>
                  <p><strong>Patch (X.Y.Z):</strong> Correcciones menores y ajustes</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} />
                  <span>Crear Versión</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddVersionModal;