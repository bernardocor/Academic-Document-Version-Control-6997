import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SafeIcon from '../common/SafeIcon';
import { useDocuments } from '../contexts/DocumentContext';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiClock, FiTrendingUp, FiPlus, FiEdit, FiEye, FiCalendar } = FiIcons;

const Dashboard = () => {
  const { documents } = useDocuments();

  const recentDocuments = documents
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const stats = {
    totalDocuments: documents.length,
    activeDocuments: documents.filter(doc => doc.status !== 'archived').length,
    totalVersions: documents.reduce((acc, doc) => acc + doc.versions.length, 0),
    recentUpdates: documents.filter(doc => {
      const daysDiff = (new Date() - new Date(doc.updatedAt)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
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
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Panel de Control Académico
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gestiona las versiones de tus documentos académicos de manera profesional y organizada
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documentos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiFileText} className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documentos Activos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeDocuments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiEdit} className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Versiones</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalVersions}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actualizaciones (7d)</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentUpdates}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <SafeIcon icon={FiClock} className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/documents"
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Nuevo Documento</span>
          </Link>
          <Link
            to="/documents"
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={FiEye} />
            <span>Ver Todos los Documentos</span>
          </Link>
        </div>
      </motion.div>

      {/* Recent Documents */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Documentos Recientes</h2>
          <Link
            to="/documents"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todos
          </Link>
        </div>

        {recentDocuments.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiFileText} className="text-gray-400 text-4xl mb-4 mx-auto" />
            <p className="text-gray-600">No hay documentos aún</p>
            <Link
              to="/documents"
              className="inline-flex items-center space-x-2 mt-4 text-primary-600 hover:text-primary-700"
            >
              <SafeIcon icon={FiPlus} />
              <span>Crear tu primer documento</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                to={`/document/${doc.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} />
                        <span>
                          {format(new Date(doc.updatedAt), "d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </span>
                      <span>Versión {doc.currentVersion}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        doc.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status === 'draft' ? 'Borrador' :
                         doc.status === 'review' ? 'En Revisión' :
                         doc.status === 'approved' ? 'Aprobado' : 'Archivado'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <SafeIcon icon={FiFileText} className="text-primary-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;