# Principal Widget Perfilador - React

Widget de perfilador de inversión convertido de jQuery/HTML a React.

## Estructura del Proyecto

```
src/
  components/
    Perfilador.js          # Componente principal
    StepsIndicator.js      # Indicador de pasos
    SimulationForm.js      # Formulario de simulación inicial
    QuestionForm.js        # Formulario dinámico de preguntas
    FinalProfile.js        # Resultado final del perfil
    Loader.js              # Componente de carga
    ScreenBlocker.js       # Bloqueador de pantalla
  api.js                   # Funciones para llamadas API
  utils.js                 # Utilidades y helpers
  styles.css               # Estilos globales
  App.js                   # Componente raíz
  index.js                 # Punto de entrada
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

## Build para Producción

```bash
npm run build
```

## Características

- ✅ Convertido de jQuery a React Hooks
- ✅ Componentes funcionales modernos
- ✅ Estado manejado con useState y useEffect
- ✅ Llamadas API con fetch (reemplaza jQuery.ajax)
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Estilos CSS preservados
- ✅ Responsive design

## Dependencias

- React 18.2.0
- React DOM 18.2.0
- Bootstrap 4.3.1 (via CDN)

## Notas

- El widget mantiene la misma funcionalidad que la versión original
- Las llamadas API se realizan a los mismos endpoints
- El estado se mantiene en sessionStorage para el UUID del usuario
- Los estilos CSS se han preservado y organizado en archivos separados


