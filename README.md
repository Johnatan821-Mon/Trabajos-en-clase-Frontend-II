# Proyecto Frontend II – Gestión de Productos 

## Descripción del proyecto

Aplicación web desarrollada con React que permite gestionar una lista de productos mediante operaciones CRUD (crear, leer, editar y eliminar).

El proyecto fue desarrollado como parte de las actividades académicas de la asignatura Frontend II, con el objetivo de aplicar conceptos fundamentales del desarrollo de interfaces modernas, arquitectura basada en componentes y manejo de estado en aplicaciones web.

La aplicación permite visualizar productos en una interfaz organizada, modificar su información, agregar nuevos elementos y eliminar registros existentes, utilizando un enfoque basado en componentes reutilizables.

---

## Tecnologías utilizadas

El proyecto fue desarrollado utilizando las siguientes tecnologías y herramientas:

* React
* JavaScript
* HTML
* CSS
* Git
* GitHub

React se utilizó como biblioteca principal para la construcción de la interfaz de usuario mediante componentes reutilizables y manejo del estado de la aplicación.

---

## Arquitectura del proyecto

La aplicación sigue una estructura modular basada en componentes, lo que facilita la organización del código y la reutilización de elementos de interfaz.

```
src
 ├── components
 │   ├── Navbar
 │   ├── Header
 │   ├── Footer
 │   ├── ProductCard
 │   └── ProductList
 │
 ├── pages
 │   ├── Home
 │   └── Cart
 │
 ├── styles
 │   └── ProductList.module.css
 │
 └── App.jsx
```

### Componentes principales

**App.jsx**
Componente principal de la aplicación. Encapsula la estructura general, la navegación entre páginas y la integración de los componentes principales.

**Navbar**
Componente encargado de la navegación entre las diferentes secciones de la aplicación.

**Header**
Encabezado de la aplicación que agrupa elementos de navegación y presentación.

**Footer**
Componente que contiene información adicional y estructura el cierre visual de la interfaz.

**ProductList**
Componente encargado de renderizar la lista de productos disponibles en la aplicación.

**ProductCard**
Representa cada producto individual en forma de tarjeta, mostrando información relevante como nombre, imagen y stock.

---

## Funcionalidades implementadas

### Visualización de productos

La aplicación permite visualizar una lista de productos presentados mediante tarjetas individuales. Cada tarjeta muestra la información principal del producto y su disponibilidad en stock.

### Gestión de productos

Se implementó un sistema de gestión de productos utilizando el estado local de React, lo que permite manipular dinámicamente la información sin necesidad de un backend externo.

Las operaciones disponibles incluyen:

* Agregar nuevos productos
* Editar información de productos existentes
* Eliminar productos de la lista
* Mostrar el stock disponible de cada producto

### Interfaz dinámica

El formulario de creación y edición de productos se abre bajo demanda, permitiendo mantener una interfaz limpia y enfocada en la visualización de la información.

También se incorporó la opción de cancelar la operación cuando el usuario decide no continuar con el proceso de creación o edición.

### Navegación entre páginas

La aplicación incluye navegación entre diferentes vistas de la interfaz, como la página principal y la sección de carrito, mediante componentes de navegación integrados en la interfaz.

---

## Flujo de desarrollo de

El desarrollo del proyecto siguió una serie de etapas organizadas que se pueden observar a través de los commits del repositorio.

1.Creación de la estructura inicial del proyecto en React

2.Configuración del componente principal de la aplicación (App.jsx)

3.Implementación de la navegación mediante componentes de interfaz

4.Desarrollo de componentes estructurales como Header y Footer

5.Creación de la lista de productos y su representación mediante tarjetas

6.Integración de estilos CSS para mejorar la presentación visual

7.Implementación de manejo de estado para la gestión de productos

8.Desarrollo de operaciones CRUD (crear, editar y eliminar productos)

9.Integración del formulario dinámico para la administración de productos

10.Pruebas y ajustes finales de la interfaz

##Gestión del proyecto

El desarrollo del proyecto fue gestionado mediante un tablero Kanban en GitHub, donde se organizaron las tareas en diferentes etapas del flujo de trabajo:

*Backlog

*To Do

*In Progress

*Review

*Done

Este sistema permitió realizar un seguimiento del avance del desarrollo, así como organizar las tareas correspondientes a cada fase del proyecto.
