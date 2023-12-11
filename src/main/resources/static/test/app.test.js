import {
    validarFormulario,
    agregarEmpleado,
    limpiarObjeto,
    mostrarEmpleados,
    cargarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    limpiarHTML,
} from '../app.js';

// Crear un mock global para la función 'alert' para evitar llamadas reales a 'alert' durante las pruebas
global.alert = jest.fn();

// Mock de document.querySelector para no afectar el DOM real
beforeEach(() => {
    global.document = {
        body: {
            appendChild: jest.fn(),
            removeChild: jest.fn(),
            firstChild: null,
        },
        createElement: jest.fn().mockReturnValue({}),
        getElementById: jest.fn().mockImplementation((selector) => {
            if (selector === 'nombre') {
                return { value: 'Juan' };
            }
            if (selector === 'puesto') {
                return { value: 'Desarrollador' };
            }
            return { addEventListener: jest.fn(), reset: jest.fn() };
        }),
        querySelector: jest.fn().mockImplementation((selector) => {
            if (selector === '#nombre') {
                return { value: 'Juan' };
            }
            if (selector === '#puesto') {
                return { value: 'Desarrollador' };
            }
            return { addEventListener: jest.fn(), reset: jest.fn() };
        }),
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

// Inicio de Pruebas unitarias 
// Prueba para la función validarFormulario
describe('Validar Formulario', () => {
    // Limpiar todos los mocks después de cada prueba
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Prueba que verifica si se muestra una alerta cuando los campos están vacíos
    it('debería mostrar una alerta cuando los campos están vacíos', () => {
        validarFormulario({ preventDefault: jest.fn() });
        expect(global.alert).toHaveBeenCalledWith('¡Todos los campos son obligatorios!');
    });
});

// Pruebas unitarias para la función agregarEmpleado
describe('Agregar Empleado', () => {
    // Crear mock de la función document.querySelector antes de cada prueba
    beforeEach(() => {
        global.document.querySelector = jest.fn().mockImplementation((selector) => {
            if (selector === '#nombre') {
                return { value: 'Juan' };
            }
            if (selector === '#puesto') {
                return { value: 'Desarrollador' };
            }
            return {};
        });
    });

    // Prueba que verifica si se agrega un empleado a la lista
    it('debería agregar un empleado a la lista', () => {
        validarFormulario({ preventDefault: jest.fn() });
        agregarEmpleado();
        expect(global.listaEmpleados.length).toBe(1);
    });
});

// Pruebas unitarias para la función limpiarObjeto
describe('Limpiar Objeto', () => {
    // Prueba que verifica si el objeto empleado se limpia correctamente
    it('debería limpiar el objeto empleado', () => {
        limpiarObjeto();
        expect(global.objEmpleado).toEqual({
            id: '',
            nombre: '',
            puesto: '',
        });
    });
});

// Pruebas para mostrarEmpleados
describe('mostrarEmpleados', () => {
    it('debería agregar empleados al DOM', () => {
        // Agregar empleados a listaEmpleados antes de llamar a mostrarEmpleados
        listaEmpleados = [
            { id: 1, nombre: 'Juan', puesto: 'Desarrollador' },
            { id: 2, nombre: 'Maria', puesto: 'Diseñadora' },
            { id: 3, nombre: 'Pedro', puesto: 'Analista' },
        ];

        // Llamar a la función mostrarEmpleados
        mostrarEmpleados();

        // Verificar que se haya llamado a appendChild una vez por cada empleado en la lista
        expect(document.querySelector().appendChild).toHaveBeenCalledTimes(listaEmpleados.length);
    });
});

// Pruebas para cargarEmpleado
describe('cargarEmpleado', () => {
    it('debería cargar la información del empleado en los campos del formulario', () => {
        // Crear un objeto empleado de ejemplo
        const empleado = {
            id: 1,
            nombre: 'John Doe',
            puesto: 'Developer',
        };

        // Llamar a la función cargarEmpleado
        cargarEmpleado(empleado);

        // Verificar que el objeto empleado y objEmpleado sean iguales
        expect(objEmpleado).toEqual(empleado);
    });
});

// Pruebas para editarEmpleado
describe('editarEmpleado', () => {
    it('debería actualizar la información del empleado en la lista', () => {
        // Crear un objeto empleado de ejemplo
        const empleado = {
            id: 1,
            nombre: 'John Doe',
            puesto: 'Developer',
        };

        // Agregar el empleado a la lista
        listaEmpleados.push(empleado);

        // Actualizar la información del empleado
        const empleadoActualizado = {
            ...empleado,
            nombre: 'Jane Doe',
            puesto: 'Manager',
        };

        // Llamar a la función editarEmpleado
        editarEmpleado(empleadoActualizado);

        // Verificar que el empleado en la lista haya sido actualizado
        const empleadoEnLista = listaEmpleados.find((emp) => emp.id === empleadoActualizado.id);
        expect(empleadoEnLista).toEqual(empleadoActualizado);
    });
});

// Pruebas para eliminarEmpleado
describe('eliminarEmpleado', () => {
    it('debería eliminar un empleado de la lista', () => {
        // Crear un objeto empleado de ejemplo
        const empleado = {
            id: 1,
            nombre: 'John Doe',
            puesto: 'Developer',
        };

        // Agregar el empleado a la lista
        listaEmpleados.push(empleado);

        // Llamar a la función eliminarEmpleado
        eliminarEmpleado(empleado.id);

        const empleadoEnLista = listaEmpleados.find((emp) => emp.id === empleado.id);
        expect(empleadoEnLista).toBeUndefined();
    });
});

// Pruebas para limpiarHTML
describe('limpiarHTML', () => {
    it('debería eliminar todos los elementos hijos del div-empleados', () => {
        // Crear elementos hijos en el div-empleados
        document.querySelector().firstChild = {};

        // Llamar a la función limpiarHTML
        limpiarHTML();

        // Verificar que se haya llamado a removeChild la cantidad de veces necesaria para eliminar todos los elementos hijos
        expect(document.querySelector().removeChild).toHaveBeenCalledTimes(1);
    });
});

// Prueba para validar que no se agregue empleado con campos vacíos
describe('Validación de campos', () => {
    it('no debe agregar un empleado si algún campo está vacío', () => {
        const preventDefault = jest.fn();
        document.querySelector = jest.fn().mockReturnValue({
            value: ''
        });

        validarFormulario({ preventDefault });

        expect(global.alert).toHaveBeenCalledWith('¡Todos los campos son obligatorios!');
        expect(agregarEmpleado).not.toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
    });
});

// Prueba para validar que se pueda agregar un empleado correctamente
describe('Agregar empleado', () => {
    it('debe agregar un nuevo empleado a la lista', () => {
        const preventDefault = jest.fn();
        document.querySelector = jest.fn().mockReturnValueOnce({
            value: 'John Doe'
        }).mockReturnValueOnce({
            value: 'Developer'
        });

        objEmpleado.id = '';
        objEmpleado.nombre = '';
        objEmpleado.puesto = '';
        editando = false;

        const expectedEmpleado = {
            id: expect.any(Number),
            nombre: 'John Doe',
            puesto: 'Developer'
        };

        validarFormulario({ preventDefault });

        expect(agregarEmpleado).toHaveBeenCalled();
        expect(listaEmpleados).toContainEqual(expectedEmpleado);
        expect(limpiarObjeto).toHaveBeenCalled();
        expect(mostrarEmpleados).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
    });
});

// Prueba para validar que se pueda editar un empleado correctamente
describe('Editar empleado', () => {
    it('debe actualizar los datos de un empleado existente en la lista', () => {
        const empleado = {
            id: 1,
            nombre: 'John Doe',
            puesto: 'Developer',
        };

        const empleadoActualizado = {
            ...empleado,
            nombre: 'Jane Doe',
            puesto: 'Manager',
        };

        listaEmpleados.push(empleado);

        document.querySelector = jest.fn().mockReturnValueOnce({
            value: 'Jane Doe'
        }).mockReturnValueOnce({
            value: 'Manager'
        });

        objEmpleado.id = empleado.id;
        objEmpleado.nombre = empleado.nombre;
        objEmpleado.puesto = empleado.puesto;
        editando = true;

        editarEmpleado();

        expect(limpiarHTML).toHaveBeenCalled();
        expect(listaEmpleados).toContainEqual(empleadoActualizado);
        expect(mostrarEmpleados).toHaveBeenCalled();
        expect(limpiarObjeto).toHaveBeenCalled();
        expect(editando).toBe(false);
    });
});

// Prueba para validar que se pueda eliminar un empleado correctamente
describe('Eliminar empleado', () => {
    it('debe eliminar un empleado de la lista', () => {
        const empleado = {
            id: 1,
            nombre: 'John Doe',
            puesto: 'Developer',
        };

        listaEmpleados.push(empleado);

        eliminarEmpleado(empleado.id);

        expect(listaEmpleados).not.toContainEqual(empleado);
        expect(limpiarHTML).toHaveBeenCalled();
        expect(mostrarEmpleados).toHaveBeenCalled();
    });
});

// Prueba para validar que se limpie el formulario al agregar un empleado
describe('Limpiar formulario al agregar', () => {
    it('debe limpiar el formulario al agregar un empleado', () => {
        const formulario = document.createElement('form');
        formulario.id = 'formulario';
        const nombreInput = document.createElement('input');
        nombreInput.id = 'nombre';
        nombreInput.value = 'John Doe';
        const puestoInput = document.createElement('input');
        puestoInput.id = 'puesto';
        puestoInput.value = 'Developer';
        formulario.appendChild(nombreInput);
        formulario.appendChild(puestoInput);

        document.body.appendChild(formulario);

        agregarEmpleado();

        expect(nombreInput.value).toBe('');
        expect(puestoInput.value).toBe('');

        document.body.removeChild(formulario);
    });
});

// Prueba para validar que se limpie el formulario al editar un empleado
describe('Limpiar formulario al editar', () => {
    it('debe limpiar el formulario al editar un empleado', () => {
        const formulario = document.createElement('form');
        formulario.id = 'formulario';
        const nombreInput = document.createElement('input');
        nombreInput.id = 'nombre';
        nombreInput.value = 'John Doe';
        const puestoInput = document.createElement('input');
        puestoInput.id = 'puesto';
        puestoInput.value = 'Developer';
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Actualizar';
        formulario.appendChild(nombreInput);
        formulario.appendChild(puestoInput);
        formulario.appendChild(submitButton);

        document.body.appendChild(formulario);

        editarEmpleado();

        expect(nombreInput.value).toBe('');
        expect(puestoInput.value).toBe('');
        expect(submitButton.textContent).toBe('Agregar');

        document.body.removeChild(formulario);
    });
});

// Prueba para validar que se muestre la alerta al intentar agregar un empleado sin llenar los campos
describe('Validar campos vacíos', () => {
    it('debe mostrar una alerta si se intenta agregar un empleado con campos vacíos', () => {
        document.querySelector = jest.fn().mockReturnValue({
            value: ''
        });

        agregarEmpleado();

        expect(global.alert).toHaveBeenCalledWith('¡Todos los campos son obligatorios!');
    });
});

// Prueba para validar que se muestre la alerta al intentar editar un empleado sin llenar los campos
describe('Validar campos vacíos al editar', () => {
    it('debe mostrar una alerta si se intenta editar un empleado con campos vacíos', () => {
        document.querySelector = jest.fn().mockReturnValue({
            value: ''
        });

        editarEmpleado();

        expect(global.alert).toHaveBeenCalledWith('¡Todos los campos son obligatorios!');
    });
});

// Prueba para validar que se llama a la función 'reset' al agregar un empleado
describe('Limpiar formulario al agregar', () => {
    it('debe llamar a la función reset al agregar un empleado', () => {
        agregarEmpleado();
        expect(document.querySelector().reset).toHaveBeenCalled();
    });
});

// Prueba para validar que se llama a la función 'reset' al editar un empleado
describe('Limpiar formulario al editar', () => {
    it('debe llamar a la función reset al editar un empleado', () => {
        editarEmpleado();
        expect(document.querySelector().reset).toHaveBeenCalled();
    });
});

// Prueba para validar que se cambie el valor de 'editando' al agregar un empleado
describe('Agregar empleado', () => {
    it('debe cambiar el valor de editando a false al agregar un empleado', () => {
        agregarEmpleado();
        expect(editando).toBe(false);
    });
});

// Prueba para validar que se cambie el valor de 'editando' al editar un empleado
describe('Editar empleado', () => {
    it('debe cambiar el valor de editando a false al editar un empleado', () => {
        editarEmpleado();
        expect(editando).toBe(false);
    });
});

// Prueba para validar que se actualice el texto del botón al agregar un empleado
describe('Actualizar botón al agregar', () => {
    it('debe actualizar el texto del botón al agregar un empleado', () => {
        document.querySelector = jest.fn().mockReturnValue({ textContent: 'Actualizar' });

        agregarEmpleado();

        expect(document.querySelector().textContent).toBe('Agregar');
    });
});

// Prueba para validar que se actualice el texto del botón al editar un empleado
describe('Actualizar botón al editar', () => {
    it('debe actualizar el texto del botón al editar un empleado', () => {
        document.querySelector = jest.fn().mockReturnValue({ textContent: 'Agregar' });

        editarEmpleado();

        expect(document.querySelector().textContent).toBe('Actualizar');
    });
});