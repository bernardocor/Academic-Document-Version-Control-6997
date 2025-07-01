import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SafeIcon from '../common/SafeIcon';
import { useDocuments } from '../contexts/DocumentContext';
import CreateDocumentModal from './CreateDocumentModal';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiFilter, FiFileText, FiCalendar, FiTag, FiEdit, FiTrash2 } = FiIcons;

const DocumentList = () => {
  const { documents, deleteDocument } = useDocuments();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(documents.map(doc => doc.category))];

  const handleDeleteDocument = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      deleteDocument(id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Documentos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y controla las versiones de tus documentos académicos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Nuevo Documento</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="review">En Revisión</option>
            <option value="approved">Aprobado</option>
            <option value="archived">Archivado</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'thesis' ? 'Tesis' :
                 category === 'paper' ? 'Artículo' :
                 category === 'proposal' ? 'Propuesta' :
                 category === 'report' ? 'Reporte' : category}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Document Grid */}
      <AnimatePresence>
        {filteredDocuments.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <SafeIcon icon={FiFileText} className="text-gray-400 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron documentos
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer documento académico'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} />
                <span>Crear Documento</span>
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                variants={itemVariants}
                layout
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link to={`/document/${doc.id}`} className="block">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <SafeIcon icon={FiFileText} className="text-primary-600 text-xl" />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleDeleteDocument(doc.id, e)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar documento"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {doc.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Versión actual:</span>
                        <span className="font-semibold text-primary-600">
                          {doc.currentVersion}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total versiones:</span>
                        <span className="font-semibold">{doc.versions.length}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <SafeIcon icon={FiCalendar} />
                        <span>
                          {format(new Date(doc.updatedAt), "d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        doc.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status === 'draft' ? 'Borrador' :
                         doc.status === 'review' ? 'En Revisión' :
                         doc.status === 'approved' ? 'Aprobado' : 'Archivado'}
                      </span>

                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiTag} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {doc.tags.length} tag{doc.tags.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Document Modal */}
      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </motion.div>
  );
};

export default DocumentList;