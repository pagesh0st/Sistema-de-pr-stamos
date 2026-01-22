
let libros = [
    { id: 'LIB-045', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', categoria: 'Ficción', estado: 'Disponible' },
    { id: 'LIB-044', titulo: 'Física para la ciencia', autor: 'Paul A. Tipler', categoria: 'Ciencias', estado: 'Prestado' },
    { id: 'LIB-043', titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', categoria: 'Ficción', estado: 'Disponible' },
    { id: 'LIB-042', titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', categoria: 'Ficción', estado: 'Disponible' },
    { id: 'LIB-041', titulo: 'Cálculo de una variable', autor: 'James Stewart', categoria: 'Matemáticas', estado: 'Prestado' },
    { id: 'LIB-040', titulo: '1984', autor: 'George Orwell', categoria: 'Ficción', estado: 'Disponible' },
    { id: 'LIB-039', titulo: 'Rayuela', autor: 'Julio Cortázar', categoria: 'Ficción', estado: 'Disponible' },
    { id: 'LIB-038', titulo: 'La casa de los espíritus', autor: 'Isabel Allende', categoria: 'Ficción', estado: 'Prestado' },
    { id: 'LIB-037', titulo: 'Química General', autor: 'Raymond Chang', categoria: 'Ciencias', estado: 'Disponible' },
    { id: 'LIB-036', titulo: 'El amor en los tiempos del cólera', autor: 'Gabriel García Márquez', categoria: 'Ficción', estado: 'Disponible' }
];

let usuarios = [
    { id: 'USR-001', nombre: 'María González', cedula: '1750123456', email: 'maria@mail.com', telefono: '0987654321', prestamosActivos: 1 },
    { id: 'USR-002', nombre: 'Carlos Pérez', cedula: '1750234567', email: 'carlos@mail.com', telefono: '0987654322', prestamosActivos: 0 },
    { id: 'USR-003', nombre: 'Ana Rodríguez', cedula: '1750345678', email: 'ana@mail.com', telefono: '0987654323', prestamosActivos: 2 }
];

let prestamos = [
    { 
        id: 'PRES-001', 
        libroId: 'LIB-044', 
        libroTitulo: 'Física para la ciencia',
        usuarioId: 'USR-001', 
        usuarioNombre: 'María González',
        fechaPrestamo: '2026-01-15', 
        fechaDevolucion: '2026-01-29' 
    },
    { 
        id: 'PRES-002', 
        libroId: 'LIB-041', 
        libroTitulo: 'Cálculo de una variable',
        usuarioId: 'USR-003', 
        usuarioNombre: 'Ana Rodríguez',
        fechaPrestamo: '2026-01-18', 
        fechaDevolucion: '2026-02-01' 
    },
    { 
        id: 'PRES-003', 
        libroId: 'LIB-038', 
        libroTitulo: 'La casa de los espíritus',
        usuarioId: 'USR-003', 
        usuarioNombre: 'Ana Rodríguez',
        fechaPrestamo: '2026-01-20', 
        fechaDevolucion: '2026-02-03' 
    }
];

function actualizarEstadisticas() {
    document.getElementById('totalLibros').textContent = libros.length;
    document.getElementById('totalUsuarios').textContent = usuarios.length;
    document.getElementById('totalPrestamos').textContent = prestamos.length;
}

function mostrarFecha() {
    const fecha = new Date();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const fechaTexto = fecha.toLocaleDateString('es-ES', opciones);
    document.getElementById('lastUpdate').textContent = `Última actualización: ${fechaTexto}`;
}

function inicializarNavegacion() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const secciones = document.querySelectorAll('.section');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            secciones.forEach(s => s.classList.remove('active'));
            
            const seccionId = this.getAttribute('data-section');
            document.getElementById(seccionId).classList.add('active');
            
            // Cargar datos cuando se cambia de sección
            if (seccionId === 'catalogo') {
                cargarCatalogo();
            } else if (seccionId === 'prestamos') {
                cargarPrestamos();
            } else if (seccionId === 'usuarios') {
                cargarUsuarios();
            }
        });
    });
}

function buscarLibro() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const tipoRadio = document.querySelector('input[name="tipo"]:checked');
    
    const termino = searchInput.value.trim().toLowerCase();
    const tipoBusqueda = tipoRadio.value;
    
    if (termino === '') {
        searchResults.innerHTML = '<strong>Error:</strong> Por favor ingrese un término de búsqueda.';
        searchResults.className = 'search-results show error';
        return;
    }
    
    let resultados = [];
    
    if (tipoBusqueda === 'titulo') {
        resultados = libros.filter(libro => 
            libro.titulo.toLowerCase().includes(termino)
        );
    } else {
        resultados = libros.filter(libro => 
            libro.autor.toLowerCase().includes(termino)
        );
    }
    
    if (resultados.length > 0) {
        let html = `<strong>✓ Se encontraron ${resultados.length} resultado(s):</strong><br><br>`;
        html += '<table class="data-table" style="margin-top: 10px;">';
        html += '<tr><th>ID</th><th>TÍTULO</th><th>AUTOR</th><th>ESTADO</th></tr>';
        
        resultados.forEach(libro => {
            const badgeClass = libro.estado === 'Disponible' ? 'disponible' : 'prestado';
            html += `<tr>
                <td>${libro.id}</td>
                <td>${libro.titulo}</td>
                <td>${libro.autor}</td>
                <td><span class="badge ${badgeClass}">${libro.estado}</span></td>
            </tr>`;
        });
        
        html += '</table>';
        searchResults.innerHTML = html;
        searchResults.className = 'search-results show success';
    } else {
        searchResults.innerHTML = `<strong>No se encontraron resultados</strong><br>
            No hay libros que coincidan con "${termino}" en ${tipoBusqueda === 'titulo' ? 'título' : 'autor'}.`;
        searchResults.className = 'search-results show error';
    }
}

function limpiarBusqueda() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchResults').className = 'search-results';
    document.getElementById('titulo').checked = true;
}

function cargarCatalogo() {
    const tabla = document.getElementById('tablaCatalogo');
    const filtroEstado = document.getElementById('filtroEstado').value;
    const ordenarPor = document.getElementById('ordenarPor').value;
    
    let librosFiltrados = [...libros];
    if (filtroEstado !== 'todos') {
        const estadoBuscado = filtroEstado === 'disponible' ? 'Disponible' : 'Prestado';
        librosFiltrados = librosFiltrados.filter(libro => libro.estado === estadoBuscado);
    }
    
    librosFiltrados.sort((a, b) => {
        if (ordenarPor === 'id') {
            return a.id.localeCompare(b.id);
        } else if (ordenarPor === 'titulo') {
            return a.titulo.localeCompare(b.titulo);
        } else {
            return a.autor.localeCompare(b.autor);
        }
    });
    
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
    
    librosFiltrados.forEach(libro => {
        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>${libro.id}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.categoria}</td>
            <td><span class="badge ${libro.estado === 'Disponible' ? 'disponible' : 'prestado'}">${libro.estado}</span></td>
        `;
        
        fila.style.cursor = 'pointer';
        fila.addEventListener('click', function() {
            alert(`Información del libro:\n\nID: ${libro.id}\nTítulo: ${libro.titulo}\nAutor: ${libro.autor}\nCategoría: ${libro.categoria}\nEstado: ${libro.estado}`);
        });
    });
}

function cargarPrestamos() {
    const tabla = document.getElementById('tablaPrestamos');
    
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
    
    prestamos.forEach(prestamo => {
        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>${prestamo.id}</td>
            <td>${prestamo.libroTitulo}</td>
            <td>${prestamo.usuarioNombre}</td>
            <td>${prestamo.fechaPrestamo}</td>
            <td>${prestamo.fechaDevolucion}</td>
            <td><button class="btn-danger" onclick="devolverLibro('${prestamo.id}')">DEVOLVER</button></td>
        `;
    });
}

function registrarPrestamo() {
    const libroId = document.getElementById('prestamoLibroId').value.trim().toUpperCase();
    const usuarioId = document.getElementById('prestamoUsuarioId').value.trim().toUpperCase();
    const fechaDevolucion = document.getElementById('prestamoFechaDevolucion').value;
    const mensaje = document.getElementById('prestamoMensaje');
    
    if (!libroId || !usuarioId || !fechaDevolucion) {
        mensaje.innerHTML = '<strong>Error:</strong> Todos los campos son obligatorios.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    const libro = libros.find(l => l.id === libroId);
    if (!libro) {
        mensaje.innerHTML = '<strong>Error:</strong> El ID del libro no existe.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    if (libro.estado === 'Prestado') {
        mensaje.innerHTML = '<strong>Error:</strong> El libro ya está prestado.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) {
        mensaje.innerHTML = '<strong>Error:</strong> El ID del usuario no existe.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    const hoy = new Date();
    const fechaDev = new Date(fechaDevolucion);
    if (fechaDev <= hoy) {
        mensaje.innerHTML = '<strong>Error:</strong> La fecha de devolución debe ser futura.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    const nuevoPrestamo = {
        id: `PRES-${String(prestamos.length + 1).padStart(3, '0')}`,
        libroId: libro.id,
        libroTitulo: libro.titulo,
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
        fechaPrestamo: hoy.toISOString().split('T')[0],
        fechaDevolucion: fechaDevolucion
    };
    
    prestamos.push(nuevoPrestamo);
    libro.estado = 'Prestado';
    usuario.prestamosActivos++;
    
    document.getElementById('prestamoLibroId').value = '';
    document.getElementById('prestamoUsuarioId').value = '';
    document.getElementById('prestamoFechaDevolucion').value = '';
    
    mensaje.innerHTML = `<strong>✓ Éxito:</strong> Préstamo ${nuevoPrestamo.id} registrado correctamente.`;
    mensaje.className = 'mensaje-resultado show success';
    
    cargarPrestamos();
    actualizarEstadisticas();
    
    setTimeout(() => {
        mensaje.className = 'mensaje-resultado';
    }, 3000);
}

function devolverLibro(prestamoId) {
    if (!confirm('¿Está seguro de registrar la devolución de este libro?')) {
        return;
    }
    
    const indice = prestamos.findIndex(p => p.id === prestamoId);
    if (indice === -1) return;
    
    const prestamo = prestamos[indice];
    
    const libro = libros.find(l => l.id === prestamo.libroId);
    if (libro) {
        libro.estado = 'Disponible';
    }
    
    const usuario = usuarios.find(u => u.id === prestamo.usuarioId);
    if (usuario && usuario.prestamosActivos > 0) {
        usuario.prestamosActivos--;
    }
    
    prestamos.splice(indice, 1);
    
    cargarPrestamos();
    actualizarEstadisticas();
    
    alert('Libro devuelto correctamente.');
}

function cargarUsuarios() {
    const tabla = document.getElementById('tablaUsuarios');
    
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }
    
    usuarios.forEach(usuario => {
        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.cedula}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.prestamosActivos}</td>
        `;
        
        fila.style.cursor = 'pointer';
        fila.addEventListener('click', function() {
            alert(`Información del usuario:\n\nID: ${usuario.id}\nNombre: ${usuario.nombre}\nCédula: ${usuario.cedula}\nEmail: ${usuario.email}\nTeléfono: ${usuario.telefono}\nPréstamos activos: ${usuario.prestamosActivos}`);
        });
    });
}

function registrarUsuario() {
    const nombre = document.getElementById('usuarioNombre').value.trim();
    const cedula = document.getElementById('usuarioCedula').value.trim();
    const email = document.getElementById('usuarioEmail').value.trim();
    const telefono = document.getElementById('usuarioTelefono').value.trim();
    const mensaje = document.getElementById('usuarioMensaje');
    
    if (!nombre || !cedula || !email || !telefono) {
        mensaje.innerHTML = '<strong>Error:</strong> Todos los campos son obligatorios.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    if (usuarios.find(u => u.cedula === cedula)) {
        mensaje.innerHTML = '<strong>Error:</strong> Ya existe un usuario con esa cédula.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensaje.innerHTML = '<strong>Error:</strong> El email no es válido.';
        mensaje.className = 'mensaje-resultado show error';
        return;
    }
    
    const nuevoUsuario = {
        id: `USR-${String(usuarios.length + 1).padStart(3, '0')}`,
        nombre: nombre,
        cedula: cedula,
        email: email,
        telefono: telefono,
        prestamosActivos: 0
    };
    
    usuarios.push(nuevoUsuario);
    
    document.getElementById('usuarioNombre').value = '';
    document.getElementById('usuarioCedula').value = '';
    document.getElementById('usuarioEmail').value = '';
    document.getElementById('usuarioTelefono').value = '';
    
    mensaje.innerHTML = `<strong>✓ Éxito:</strong> Usuario ${nuevoUsuario.id} registrado correctamente.`;
    mensaje.className = 'mensaje-resultado show success';
    
    cargarUsuarios();
    actualizarEstadisticas();
    
    setTimeout(() => {
        mensaje.className = 'mensaje-resultado';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarFecha();
    actualizarEstadisticas();
    inicializarNavegacion();
    
    document.getElementById('searchBtn').addEventListener('click', buscarLibro);
    document.getElementById('clearBtn').addEventListener('click', limpiarBusqueda);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarLibro();
    });
    
    document.getElementById('filtroEstado').addEventListener('change', cargarCatalogo);
    document.getElementById('ordenarPor').addEventListener('change', cargarCatalogo);
    
    document.getElementById('btnRegistrarPrestamo').addEventListener('click', registrarPrestamo);
    
    document.getElementById('btnRegistrarUsuario').addEventListener('click', registrarUsuario);
    
    console.log('Sistema de Biblioteca Medardo Angel Silva - Iniciado');
    console.log(`Libros: ${libros.length} | Usuarios: ${usuarios.length} | Préstamos: ${prestamos.length}`);
});

setInterval(mostrarFecha, 60000);