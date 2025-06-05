import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';

// Main App component
const App = () => {
  // Define the core study plan data structure
  const initialStudyPlanStructure = [
    {
      week: 1,
      objective: 'Dominar la sintaxis básica de JavaScript y la interacción con el navegador (DOM).',
      dailyHours: '2-3 horas',
      days: [
        { day: 1, topic: 'Introducción a JavaScript', chapters: 'Capítulo 6: JavaScript: Client-Side Scripting (p. 274)', practice: 'Ejercicios sencillos de variables y operaciones.' },
        { day: 2, topic: 'Control de Flujo y Funciones', chapters: 'Capítulo 6: JavaScript: Client-Side Scripting (p. 274)', practice: 'Escribir funciones que resuelvan pequeños problemas lógicos.' },
        { day: 3, topic: 'Arrays y Objetos', chapters: 'Capítulo 6: JavaScript: Client-Side Scripting (p. 274)', practice: 'Manipular listas de datos y estructuras de objetos.' },
        { day: 4, topic: 'Introducción al DOM', chapters: 'Capítulo 6: JavaScript: Client-Side Scripting (p. 274)', practice: 'Cambiar el contenido de un párrafo o el `src` de una imagen.' },
        { day: 5, topic: 'Eventos del DOM', chapters: 'Capítulo 6: JavaScript: Client-Side Scripting (p. 274)', practice: 'Un botón que realice una acción al ser clicado.' },
        { day: 6, topic: 'Formularios y Validación Básica', chapters: 'Capítulo 6: JavaScript: Client-Side Scripting (p. 274)', practice: 'Un formulario de login/registro simple con validación.' },
        { day: 7, topic: 'Repaso y Mini-Proyecto Frontend', chapters: 'Consolidar lo aprendido del Capítulo 6', practice: 'Construye un pequeño proyecto frontend: una lista de tareas o un cambiador de colores aleatorio.' },
      ],
    },
    {
      week: 2,
      objective: 'Comprender la asincronía en JavaScript e introducirse a Node.js como entorno de servidor.',
      dailyHours: '2-3 horas',
      days: [
        { day: 8, topic: 'Callbacks y Asincronía', chapters: 'Capítulo 15: Advanced JavaScript & jQuery (enfocarse en JS avanzado, p. 657)', practice: 'Escribir funciones con callbacks anidados para simular operaciones asíncronas.' },
        { day: 9, topic: 'Promises', chapters: 'Capítulo 15: Advanced JavaScript & jQuery (enfocarse en JS avanzado, p. 657)', practice: 'Refactorizar ejemplos de callbacks a Promises.' },
        { day: 10, topic: 'Async/Await y Fetch API', chapters: 'Capítulo 15: Advanced JavaScript & jQuery (enfocarse en JS avanzado, p. 657)', practice: 'Consumir una API pública sencilla (ej. PokeAPI) usando `fetch` y `async/await`.' },
        { day: 11, topic: 'Introducción a Node.js', chapters: 'Capítulo: Server Side 2: Node.js (ubicación aprox. después de PHP)', practice: 'Instalar Node.js y ejecutar tu primer script simple ("Hola Mundo" en consola).' },
        { day: 12, topic: 'Módulos en Node.js y NPM', chapters: 'Capítulo: Server Side 2: Node.js', practice: 'Crear tus propios módulos y usarlos. Instalar un paquete de NPM (ej. `lodash`).' },
        { day: 13, topic: 'Tu Primer Servidor HTTP con Node.js', chapters: 'Capítulo: Server Side 2: Node.js', practice: 'Construir un servidor Node.js que responda "Hola desde el servidor".' },
        { day: 14, topic: 'Repaso y Preparación para Express.js', chapters: 'Consolidar el entendimiento de Node.js como entorno', practice: 'Asegurarse de entender el flujo básico de una petición-respuesta en Node.js puro.' },
      ],
    },
    {
      week: 3,
      objective: 'Aprender a crear APIs RESTful utilizando Express.js, el framework más popular para Node.js.',
      dailyHours: '2-3 horas',
      days: [
        { day: 15, topic: 'Introducción a Express.js', chapters: 'Capítulo: Server Side 2: Node.js', practice: 'Crear un servidor Express.js que responda a una ruta básica (`/`).' },
        { day: 16, topic: 'Manejo de Rutas y Métodos HTTP', chapters: 'Capítulo: Server Side 2: Node.js', practice: 'Definir varias rutas para diferentes operaciones (ej. `/productos`, `/usuarios`).' },
        { day: 17, topic: 'Middleware en Express.js', chapters: 'Capítulo: Server Side 2: Node.js', practice: 'Añadir middleware para parsear JSON en las peticiones y para registrar las solicitudes.' },
        { day: 18, topic: 'Parámetros de Ruta y Query Parameters', chapters: 'Capítulo: Server Side 2: Node.js', practice: 'Crear una ruta `/productos/:id` y `/buscar?q=algo`.' },
        { day: 19, topic: 'Construyendo una API REST Simple (In-memory)', chapters: 'Integrar conceptos de API REST y Capítulo 17: XML Processing and Web Services (principios de WS, p. 762)', practice: 'API CRUD para un recurso, utilizando un array.' },
        { day: 20, topic: 'Postman/Insomnia para Pruebas de API', chapters: 'Capítulo 17: XML Processing and Web Services (p. 762)', practice: 'Probar todas las rutas de tu API usando Postman/Insomnia.' },
        { day: 21, topic: 'Repaso y Diseño de API', chapters: 'Consolidar el diseño de APIs RESTful', practice: 'Revisar el diseño de tu API y pensar en cómo mejorarla para el futuro.' },
      ],
    },
    {
      week: 4,
      objective: 'Entender las bases de datos relacionales y cómo interactuar con ellas desde Node.js.',
      dailyHours: '2-3 horas',
      days: [
        { day: 22, topic: 'Conceptos de Bases de Datos Relacionales', chapters: 'Capítulo 11: Working with Databases (p. 480)', practice: 'Dibujar el esquema de una base de datos simple.' },
        { day: 23, topic: 'SQL Básico (CREATE, INSERT)', chapters: 'Capítulo 11: Working with Databases (p. 480)', practice: 'Instalar MySQL/PostgreSQL (o SQLite). Crear una DB y tablas, insertar datos.' },
        { day: 24, topic: 'SQL Básico (SELECT, UPDATE, DELETE)', chapters: 'Capítulo 11: Working with Databases (p. 480)', practice: 'Consultar, actualizar y eliminar datos de tus tablas.' },
        { day: 25, topic: 'Conexión Node.js a SQL', chapters: 'Capítulo 11: Working with Databases (p. 480)', practice: 'Escribir un script Node.js para conectarse a tu base de datos y hacer una consulta.' },
        { day: 26, topic: 'Integrando SQL en tu API Express.js (Parte 1)', chapters: 'Capítulo 11: Working with Databases (p. 480)', practice: 'Implementar la lectura (GET) de recursos desde tu base de datos SQL.' },
        { day: 27, topic: 'Integrando SQL en tu API Express.js (Parte 2)', chapters: 'Capítulo 11: Working with Databases (p. 480)', practice: 'Implementar la creación, actualización y eliminación de recursos en tu DB SQL.' },
        { day: 28, topic: 'Repaso de SQL y Proyectos', chapters: 'Consolidar el entendimiento de SQL', practice: 'Asegúrate de que tu API funcione correctamente con la base de datos.' },
      ],
    },
    {
      week: 5,
      objective: 'Introducirse a las bases de datos NoSQL y entender sus diferencias con las relacionales.',
      dailyHours: '2-3 horas',
      days: [
        { day: 29, topic: 'Introducción a NoSQL (MongoDB)', chapters: 'Capítulo 11: Working with Databases (ver sección de NoSQL, p. 480) o recursos externos', practice: 'Instalar MongoDB. Usar la shell para crear DBs, colecciones, documentos.' },
        { day: 30, topic: 'Operaciones CRUD en MongoDB', chapters: 'Recursos externos sobre MongoDB CRUD', practice: 'Realizar todas las operaciones CRUD en MongoDB a través de la shell.' },
        { day: 31, topic: 'Conexión Node.js a MongoDB (Mongoose)', chapters: 'Uso de Mongoose (recursos externos)', practice: 'Escribir un script Node.js para conectarse a MongoDB usando Mongoose. Definir un esquema.' },
        { day: 32, topic: 'Integrando MongoDB en tu API Express.js (Parte 1)', chapters: 'Recursos externos', practice: 'Implementar la lectura (GET) de recursos desde tu base de datos MongoDB.' },
        { day: 33, topic: 'Integrando MongoDB en tu API Express.js (Parte 2)', chapters: 'Recursos externos', practice: 'Implementar la creación, actualización y eliminación de recursos en tu DB MongoDB.' },
        { day: 34, topic: 'Comparación SQL vs NoSQL', chapters: 'Capítulo 11: Working with Databases (Comparación) o recursos externos', practice: 'Reflexiona sobre los escenarios donde cada una brilla.' },
        { day: 35, topic: 'Repaso de Bases de Datos y Proyectos', chapters: 'Consolidar el conocimiento sobre ambas bases de datos', practice: 'Reforzar el manejo de datos en tus APIs.' },
      ],
    },
    {
      week: 6,
      objective: 'Entender los principios de autenticación, autorización y seguridad esenciales para las APIs.',
      dailyHours: '2-3 horas',
      days: [
        { day: 36, topic: 'Conceptos de Autenticación', chapters: 'Capítulo 16: Security (p. 709)', practice: 'Entender el flujo de una autenticación basada en tokens.' },
        { day: 37, topic: 'JWT (JSON Web Tokens)', chapters: 'Capítulo 16: Security (p. 709) o recursos externos', practice: 'Instalar `jsonwebtoken`. Generar un JWT para un usuario simulado.' },
        { day: 38, topic: 'Implementando Registro de Usuarios', chapters: 'Capítulo 16: Security (p. 709) y recursos externos (`bcrypt`)', practice: 'Añadir una ruta `/register` que guarde usuarios con contraseñas hasheadas (`bcrypt`).' },
        { day: 39, topic: 'Implementando Login de Usuarios', chapters: 'Capítulo 16: Security (p. 709)', practice: 'Añadir una ruta `/login` que autentique al usuario y le devuelva un JWT.' },
        { day: 40, topic: 'Protección de Rutas (Middleware de Autenticación)', chapters: 'Capítulo 16: Security (p. 709)', practice: 'Proteger una o dos rutas de tu API para que solo sean accesibles con un JWT válido.' },
        { day: 41, topic: 'Autorización y Roles Básicos', chapters: 'Capítulo 16: Security (p. 709)', practice: 'Implementar una autorización básica (ej. solo usuarios "admin").' },
        { day: 42, topic: 'Seguridad Web Esencial (Prevención de Inyecciones)', chapters: 'Capítulo 12: Error Handling and Validation & Capítulo 16: Security (p. 709)', practice: 'Asegurarte de que tus entradas de usuario estén sanitizadas y que las interacciones con la DB sean seguras.' },
      ],
    },
    {
      week: 7,
      objective: 'Preparar y desplegar tu aplicación, y manejar el control de versiones.',
      dailyHours: '2-3 horas',
      days: [
        { day: 43, topic: 'Introducción a Git y GitHub', chapters: 'Recursos online de Git (no en el libro)', practice: 'Inicializar Git en tu proyecto, hacer tus primeros commits.' },
        { day: 44, topic: 'Flujo de Trabajo Básico de Git', chapters: 'Recursos online de Git', practice: 'Crear y cambiar de ramas, hacer commits en diferentes ramas.' },
        { day: 45, topic: 'Colaboración con GitHub', chapters: 'Recursos online de GitHub', practice: 'Crear un repositorio en GitHub, subir tu código, clonar.' },
        { day: 46, topic: 'Conceptos de Despliegue (Deployment)', chapters: 'Capítulo 19: Web Server Administration & Capítulo 20: Search Engines (enfocarse en DevOps y Hosting, p. 882/925) o recursos externos', practice: 'Investigar opciones de hosting para Node.js.' },
        { day: 47, topic: 'Preparación para Despliegue', chapters: 'Capítulo 19 o recursos externos', practice: 'Configurar tu proyecto para usar variables de entorno y un script de inicio.' },
        { day: 48, topic: 'Despliegue Básico de tu API Node.js', chapters: 'Capítulo 19 o recursos externos', practice: 'Sigue una guía paso a paso para desplegar tu API (ej. en Render.com).' },
        { day: 49, topic: 'Repaso de Despliegue y Git', chapters: 'Consolidar conocimientos', practice: 'Verifica que tu aplicación desplegada funcione correctamente.' },
      ],
    },
    {
      week: 8,
      objective: 'Integrar todo lo aprendido en un proyecto significativo y repasar los conceptos clave.',
      dailyHours: '2-4 horas (mayor enfoque en la práctica).',
      days: [
        { day: 50, topic: 'Proyecto Final: Diseño y Frontend (Día 1)', chapters: 'Integrar conocimientos de Cap. 6, 15', practice: 'Diseña la interfaz de usuario (HTML/CSS) y la lógica del cliente con JavaScript puro.' },
        { day: 51, topic: 'Proyecto Final: Diseño y Frontend (Día 2)', chapters: 'Integrar conocimientos', practice: 'Continúa con el diseño y la lógica frontend.' },
        { day: 52, topic: 'Proyecto Final: Diseño y Frontend (Día 3)', chapters: 'Integrar conocimientos', practice: 'Finaliza el frontend, asegurando interactividad.' },
        { day: 53, topic: 'Proyecto Final: Backend y Bases de Datos (Día 1)', chapters: 'Integrar conocimientos de Cap. Server Side 2: Node.js, Cap. 11: Working with Databases', practice: 'Implementa la API con Node.js/Express.js y conéctala a la base de datos.' },
        { day: 54, topic: 'Proyecto Final: Backend y Bases de Datos (Día 2)', chapters: 'Integrar conocimientos', practice: 'Continúa con la API y la interacción con la base de datos.' },
        { day: 55, topic: 'Proyecto Final: Autenticación, Seguridad y Pruebas', chapters: 'Integrar conocimientos de Cap. 16: Security', practice: 'Añade la autenticación/autorización. Realiza pruebas completas de la aplicación.' },
        { day: 56, topic: 'Proyecto Final: GitHub y Despliegue Final', chapters: 'Integrar conocimientos de Git y despliegue (Cap. 19/20)', practice: 'Sube tu proyecto a GitHub y despliégalo por completo si no lo has hecho ya.' },
      ],
    },
  ];

  const [studyPlanData, setStudyPlanData] = useState(null); // State to hold data from Firestore
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Firebase and authenticate user
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        if (!Object.keys(firebaseConfig).length) {
          throw new Error("Firebase config is missing. Please provide __firebase_config.");
        }

        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        // Sign in user
        if (typeof __initial_auth_token !== 'undefined') {
          await signInWithCustomToken(firebaseAuth, __initial_auth_token);
        } else {
          await signInAnonymously(firebaseAuth);
        }

        onAuthStateChanged(firebaseAuth, (user) => {
          if (user) {
            setUserId(user.uid);
            console.log("Firebase user ID:", user.uid);
          } else {
            console.log("No Firebase user logged in.");
            setUserId(crypto.randomUUID()); // Fallback for anonymous or unauthenticated
          }
          setLoading(false); // Authentication is ready
        });

      } catch (e) {
        console.error("Error initializing Firebase:", e);
        setError("Error initializing Firebase: " + e.message);
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []); // Run only once on component mount

  // Fetch or initialize study plan data from Firestore
  useEffect(() => {
    if (!db || !userId) {
      return; // Wait for Firebase to be initialized and user ID available
    }

    const docRef = doc(db, `artifacts/${__app_id}/users/${userId}/studyPlan/current`);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        // If document exists, load the saved data
        const fetchedData = docSnap.data().plan;
        setStudyPlanData(fetchedData);
        console.log("Study plan loaded from Firestore.");
      } else {
        // If document doesn't exist, save the initial structure
        try {
          await setDoc(docRef, { plan: initialStudyPlanStructure });
          setStudyPlanData(initialStudyPlanStructure);
          console.log("Initial study plan saved to Firestore.");
        } catch (e) {
          console.error("Error saving initial study plan:", e);
          setError("Error saving initial study plan: " + e.message);
        }
      }
      setLoading(false);
    }, (e) => {
      console.error("Error fetching study plan from Firestore:", e);
      setError("Error fetching study plan: " + e.message);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [db, userId]); // Re-run when db or userId changes

  const handleToggleCompletion = async (weekIndex, dayIndex, isCompleted) => {
    if (!db || !userId || !studyPlanData) {
      console.warn("Firestore not ready or data not loaded.");
      return;
    }

    // Create a deep copy to avoid direct state mutation
    const updatedPlan = JSON.parse(JSON.stringify(studyPlanData));
    if (updatedPlan[weekIndex] && updatedPlan[weekIndex].days[dayIndex]) {
      updatedPlan[weekIndex].days[dayIndex].isCompleted = isCompleted;
      setStudyPlanData(updatedPlan); // Optimistic UI update

      try {
        const docRef = doc(db, `artifacts/${__app_id}/users/${userId}/studyPlan/current`);
        await setDoc(docRef, { plan: updatedPlan });
        console.log(`Day ${updatedPlan[weekIndex].days[dayIndex].day} completion status updated.`);
      } catch (e) {
        console.error("Error updating completion status in Firestore:", e);
        setError("Error updating completion status: " + e.message);
        // Revert UI if update fails
        setStudyPlanData(studyPlanData);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center font-sans text-gray-800">
        <p className="text-2xl font-semibold text-indigo-700">Cargando plan de estudio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center font-sans text-gray-800">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <p className="mt-2 text-sm">Asegúrate de que tus variables globales de Firebase estén configuradas correctamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 font-sans text-gray-800">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      <style>
        {`
        body {
          font-family: 'Inter', sans-serif;
        }
        `}
      </style>

      <div className="max-w-7xl mx-auto py-8">
        <p className="text-xl md:text-2xl font-semibold text-center text-gray-700 mb-2">
          Libro: Randy Connolly y Ricardo Hoar - Fundamentals of Web Development (2022)
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-800 mb-8 rounded-lg p-4 shadow-lg bg-white">
          Plan de Estudio: Desarrollo Web (2 Meses)
        </h1>
        <p className="text-center text-sm text-gray-600 mb-4">
          ID de Usuario: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userId}</span>
        </p>

        <p className="text-center text-lg text-gray-700 mb-10">
          Visualización diaria para tu plan de estudio de JavaScript, Node.js, APIs y Bases de Datos.
          <br/>
          *Dedicación diaria estimada: 2-3 horas. ¡La constancia es clave!*
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {studyPlanData && studyPlanData.map((weekData, weekIndex) => (
            <WeekCard
              key={weekData.week}
              weekData={weekData}
              weekIndex={weekIndex}
              onToggleCompletion={handleToggleCompletion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Component for a single week card
const WeekCard = ({ weekData, weekIndex, onToggleCompletion }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 flex-shrink-0">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-200 pb-2">
        Semana {weekData.week}
      </h2>
      <p className="text-sm font-semibold text-gray-600 mb-3">
        <span className="text-indigo-500">Objetivo:</span> {weekData.objective}
      </p>
      <p className="text-sm text-gray-600 mb-5">
        <span className="text-indigo-500">Horas/día:</span> {weekData.dailyHours}
      </p>
      <div className="space-y-4">
        {weekData.days.map((dayData, dayIndex) => (
          <DayCard
            key={dayData.day}
            dayData={dayData}
            weekIndex={weekIndex}
            dayIndex={dayIndex}
            onToggleCompletion={onToggleCompletion}
          />
        ))}
      </div>
    </div>
  );
};

// Component for a single day card
const DayCard = ({ dayData, weekIndex, dayIndex, onToggleCompletion }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleCheckboxChange = (event) => {
    onToggleCompletion(weekIndex, dayIndex, event.target.checked);
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 shadow-md border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={dayData.isCompleted || false} // Ensure it's never undefined
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`w-full text-left font-semibold text-blue-800 focus:outline-none ${dayData.isCompleted ? 'line-through text-gray-500' : ''}`}
          >
            Día {dayData.day}: {dayData.topic}
          </button>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 rounded-full hover:bg-blue-100 focus:outline-none"
          aria-label={showDetails ? "Contraer detalles" : "Expandir detalles"}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 text-blue-600 ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      {showDetails && (
        <div className="mt-3 text-sm text-gray-700 space-y-2 pl-8">
          <p>
            <span className="font-medium text-blue-600">Capítulos/Temas:</span> {dayData.chapters}
          </p>
          <p>
            <span className="font-medium text-blue-600">Práctica:</span> {dayData.practice}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
