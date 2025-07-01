import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const DocumentContext = createContext();

const initialState = {
  documents: [],
  currentDocument: null,
  loading: false,
  error: null
};

const documentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOAD_DOCUMENTS':
      return { ...state, documents: action.payload, loading: false };
    
    case 'ADD_DOCUMENT':
      const newDocument = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        category: action.payload.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [{
          id: uuidv4(),
          version: '1.0.0',
          description: 'Versión inicial',
          createdAt: new Date().toISOString(),
          status: 'current',
          changes: 'Documento creado',
          author: action.payload.author || 'Usuario',
          fileLocation: '',
          fileName: '',
          prompts: [],
          relatedDocuments: [],
          attachedFiles: []
        }],
        currentVersion: '1.0.0',
        tags: action.payload.tags || [],
        status: 'draft'
      };
      
      const updatedDocuments = [...state.documents, newDocument];
      localStorage.setItem('academicDocuments', JSON.stringify(updatedDocuments));
      
      return {
        ...state,
        documents: updatedDocuments,
        loading: false
      };
    
    case 'UPDATE_DOCUMENT':
      const updated = state.documents.map(doc =>
        doc.id === action.payload.id
          ? { ...doc, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : doc
      );
      localStorage.setItem('academicDocuments', JSON.stringify(updated));
      return { ...state, documents: updated };
    
    case 'DELETE_DOCUMENT':
      const filtered = state.documents.filter(doc => doc.id !== action.payload);
      localStorage.setItem('academicDocuments', JSON.stringify(filtered));
      return { ...state, documents: filtered };
    
    case 'ADD_VERSION':
      const docsWithNewVersion = state.documents.map(doc => {
        if (doc.id === action.payload.documentId) {
          const newVersion = {
            id: uuidv4(),
            version: action.payload.version,
            description: action.payload.description,
            createdAt: new Date().toISOString(),
            status: 'current',
            changes: action.payload.changes,
            author: action.payload.author || 'Usuario',
            fileLocation: action.payload.fileLocation || '',
            fileName: action.payload.fileName || '',
            prompts: action.payload.prompts || [],
            relatedDocuments: action.payload.relatedDocuments || [],
            attachedFiles: action.payload.attachedFiles || []
          };
          
          const updatedVersions = doc.versions.map(v => ({ ...v, status: 'archived' }));
          updatedVersions.push(newVersion);
          
          return {
            ...doc,
            versions: updatedVersions,
            currentVersion: newVersion.version,
            updatedAt: new Date().toISOString()
          };
        }
        return doc;
      });
      
      localStorage.setItem('academicDocuments', JSON.stringify(docsWithNewVersion));
      return { ...state, documents: docsWithNewVersion };
    
    case 'SET_CURRENT_DOCUMENT':
      return { ...state, currentDocument: action.payload };
    
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  useEffect(() => {
    const savedDocuments = localStorage.getItem('academicDocuments');
    if (savedDocuments) {
      dispatch({ type: 'LOAD_DOCUMENTS', payload: JSON.parse(savedDocuments) });
    } else {
      // Datos de ejemplo con los nuevos campos
      const sampleDocuments = [
        {
          id: uuidv4(),
          title: 'Propuesta de Tesis Doctoral',
          description: 'Documento principal de la propuesta de investigación para el doctorado en Ciencias de la Computación',
          category: 'thesis',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          versions: [
            {
              id: uuidv4(),
              version: '1.0.0',
              description: 'Versión inicial de la propuesta',
              createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'archived',
              changes: 'Documento creado con estructura básica',
              author: 'Estudiante Doctoral',
              fileLocation: '/Documents/Tesis/Propuesta_v1.0.0.docx',
              fileName: 'Propuesta_v1.0.0.docx',
              prompts: [
                {
                  id: uuidv4(),
                  name: 'Estructura inicial',
                  content: 'Crear una propuesta de tesis doctoral sobre inteligencia artificial aplicada a la educación',
                  aiUsed: 'ChatGPT',
                  date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                  notes: 'Prompt inicial para crear la estructura base'
                }
              ],
              relatedDocuments: [
                { name: 'Referencias_Bibliográficas.pdf', url: '/Documents/Referencias/Referencias_Bibliográficas.pdf' }
              ],
              attachedFiles: [
                {
                  id: uuidv4(),
                  name: 'Propuesta_v1.0.0.docx',
                  type: 'document',
                  size: '2.3 MB',
                  uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                  description: 'Documento principal de la propuesta'
                }
              ]
            },
            {
              id: uuidv4(),
              version: '1.1.0',
              description: 'Revisión con comentarios del director',
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'archived',
              changes: 'Incorporados comentarios del director de tesis',
              author: 'Estudiante Doctoral',
              fileLocation: '/Documents/Tesis/Propuesta_v1.1.0.docx',
              fileName: 'Propuesta_v1.1.0.docx',
              prompts: [
                {
                  id: uuidv4(),
                  name: 'Revisión metodología',
                  content: 'Revisar la propuesta incorporando los comentarios del director sobre metodología y objetivos específicos',
                  aiUsed: 'Claude',
                  date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
                  notes: 'Incorporar feedback del director'
                },
                {
                  id: uuidv4(),
                  name: 'Mejorar objetivos',
                  content: 'Reformular los objetivos específicos para que sean más claros y medibles',
                  aiUsed: 'ChatGPT',
                  date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                  notes: 'Clarificar objetivos según sugerencias'
                }
              ],
              relatedDocuments: [
                { name: 'Comentarios_Director.pdf', url: '/Documents/Feedback/Comentarios_Director.pdf' },
                { name: 'Metodología_Actualizada.docx', url: '/Documents/Metodología/Metodología_Actualizada.docx' }
              ],
              attachedFiles: [
                {
                  id: uuidv4(),
                  name: 'Propuesta_v1.1.0.docx',
                  type: 'document',
                  size: '2.8 MB',
                  uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                  description: 'Versión revisada con comentarios'
                },
                {
                  id: uuidv4(),
                  name: 'Comentarios_Director.pdf',
                  type: 'pdf',
                  size: '1.2 MB',
                  uploadDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
                  description: 'Feedback del director de tesis'
                }
              ]
            },
            {
              id: uuidv4(),
              version: '2.0.0',
              description: 'Versión final para comité',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'current',
              changes: 'Versión final revisada y aprobada para presentar al comité',
              author: 'Estudiante Doctoral',
              fileLocation: '/Documents/Tesis/Propuesta_Final_v2.0.0.docx',
              fileName: 'Propuesta_Final_v2.0.0.docx',
              prompts: [
                {
                  id: uuidv4(),
                  name: 'Versión final',
                  content: 'Finalizar la propuesta de tesis con todas las correcciones y preparar presentación para el comité evaluador',
                  aiUsed: 'GPT-4',
                  date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                  notes: 'Preparación para presentación final'
                },
                {
                  id: uuidv4(),
                  name: 'Crear presentación',
                  content: 'Crear una presentación PowerPoint de 15 diapositivas basada en la propuesta final para el comité evaluador',
                  aiUsed: 'Claude',
                  date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  notes: 'Presentación para defensa'
                }
              ],
              relatedDocuments: [
                { name: 'Presentación_Comité.pptx', url: '/Documents/Presentaciones/Presentación_Comité.pptx' },
                { name: 'Cronograma_Investigación.xlsx', url: '/Documents/Cronogramas/Cronograma_Investigación.xlsx' },
                { name: 'Presupuesto_Investigación.pdf', url: '/Documents/Presupuestos/Presupuesto_Investigación.pdf' }
              ],
              attachedFiles: [
                {
                  id: uuidv4(),
                  name: 'Propuesta_Final_v2.0.0.docx',
                  type: 'document',
                  size: '3.1 MB',
                  uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  description: 'Versión final para comité'
                },
                {
                  id: uuidv4(),
                  name: 'Presentación_Comité.pptx',
                  type: 'presentation',
                  size: '4.2 MB',
                  uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  description: 'Presentación para defensa ante comité'
                },
                {
                  id: uuidv4(),
                  name: 'Cronograma_Investigación.xlsx',
                  type: 'spreadsheet',
                  size: '156 KB',
                  uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  description: 'Cronograma detallado de la investigación'
                }
              ]
            }
          ],
          currentVersion: '2.0.0',
          tags: ['tesis', 'propuesta', 'investigación'],
          status: 'review'
        }
      ];
      
      dispatch({ type: 'LOAD_DOCUMENTS', payload: sampleDocuments });
      localStorage.setItem('academicDocuments', JSON.stringify(sampleDocuments));
    }
  }, []);

  const addDocument = (documentData) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: documentData });
  };

  const updateDocument = (id, updates) => {
    dispatch({ type: 'UPDATE_DOCUMENT', payload: { id, updates } });
  };

  const deleteDocument = (id) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id });
  };

  const addVersion = (documentId, versionData) => {
    dispatch({ type: 'ADD_VERSION', payload: { documentId, ...versionData } });
  };

  const setCurrentDocument = (document) => {
    dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document });
  };

  const getDocumentById = (id) => {
    return state.documents.find(doc => doc.id === id);
  };

  const value = {
    ...state,
    addDocument,
    updateDocument,
    deleteDocument,
    addVersion,
    setCurrentDocument,
    getDocumentById
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};