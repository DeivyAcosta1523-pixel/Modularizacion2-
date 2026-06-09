# PROYECTO BASE: MODULARIZACION - Software Factory SENA
PARTE 1 APROPIACION. 

• ¿Qué responsabilidades existen actualmente dentro del archivo principal?
Respuesta: Las responsabilidades que presenta actualmente el archivo es que acude y cumple las peticiones que pide o requiere el usuario. Este archivo este super centralizado den la modularizacion.


• ¿Qué funciones pertenecen a la interfaz?
Respuesta: "Son todas las funciones que interactúan directamente con el HTML. Cosas como pintar tablas, limpiar inputs, mostrar alertas o los mismos addEventListener. Desde la perspectiva de modularización, todo esto debería sacarse por completo del archivo principal y moverse a un módulo independiente (por ejemplo, un view.js o ui.js), dejando el archivo principal libre.


• ¿Qué funciones realizan comunicación con la API?
Respuesta: "Aquí entran las funciones que hacen los fetch o peticiones asíncronas que pueden  traer o enviar datos al servidor. Para aplicar una buena modularización, estas funciones no deberían estar mezcladas con la lógica de la pantalla. Lo ideal es aislarlas en su propio módulo de servicios (como un api.js o services.js), de modo que si la URL o la base de datos cambian, solo tengamos que tocar ese  archivo."


• ¿Qué funciones coordinan el flujo general?
Respuesta: "La coordinación se queda en las funciones de inicialización, como el init() o el cargador del DOM. En un esquema modular, el archivo principal se convierte en un 'orquestador'. No programa la lógica, sino que importa los otros módulos (el de la API y el de la Interfaz) y los conecta: toma los datos que devuelve el módulo de la API y se los pasa al módulo de la interfaz para que los muestre."


• ¿Existen funciones reutilizables que podrían aislarse?
Respuesta: "Sí, un montón. Todo lo que sea formatear texto, validar campos de formularios o helpers de fechas se está repitiendo o sobrecargando el flujo principal. Al modularizar, la regla de oro es sacar este código repetitivo a un archivo de utilidades (un utils.js). Así, cualquier otro módulo que necesite formatear un dato simplemente lo importa, evitando duplicar código..."


PARTE 4 APROPIACION 

¿Qué archivo actúa como punto de entrada del sistema?
El archivo que actúa como punto de entrada es index.js, ya que desde allí se inicia la aplicación y se conectan los demás módulos necesarios para su funcionamiento.

¿Puede el módulo UI comunicarse directamente con la API? ¿Por qué?
No es lo más recomendable. Lo ideal es que la UI se comunique con un módulo intermedio (como servicios o controladores) para mantener una mejor organización del código y evitar dependencias directas.

¿Qué ocurriría si cambia la URL de la API?
Si la URL está centralizada en un solo módulo de configuración o servicio, solo habría que modificarla en ese lugar. Esto evita tener que buscar y cambiar la dirección en varios archivos.

¿La estructura actual facilita agregar nuevas funcionalidades?
Sí, porque al estar dividida en módulos cada parte tiene una responsabilidad específica. Esto permite agregar nuevas funciones sin afectar demasiado el resto del sistema.

¿Se redujo la complejidad del archivo principal?
Sí. Al distribuir las tareas en diferentes módulos, el archivo principal queda más limpio, corto y fácil de entender y mantener.

