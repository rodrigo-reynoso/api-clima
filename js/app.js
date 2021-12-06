const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit',buscarClima);
});

function buscarClima(e){
    e.preventDefault();
    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    if(ciudad ===''||pais === ''){
        mostrarMensajeError('Todos los campos son obligatorios')
        return;
    }

    // Consultariamos la API
    consultarAPI(ciudad,pais);
}

function mostrarMensajeError(mensaje){
    // Se puede poner alerta tambien por mas que este en la misma function por el scope(alcance), donde va a vivir
    const exite = document.querySelector('.bg-red-100');
    if(!exite){
        const alerta = document.createElement('div');
        alerta.classList.add('text-red-700','bg-red-100','border-red-400','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center');
        alerta.innerHTML =`
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);
        setTimeout(()=>{
            alerta.remove();
        },3000)
    }
}

function consultarAPI(ciudad,pais){
    console.log(pais,ciudad)
    const appId = '3f0d67d7404123469205328b25abf8b4'
    // IMPORTANTE siempre tengo que poner https, sino va creer que es de nuestro sitio web

   const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
   spinner(); // muestra spinner antes de que se ejecute el promise
    fetch(url)
    // no coloco el return porque como es una linea ya lo pone por explicito, sino lo tendria que poner si o si
        .then(respuesta=>respuesta.json())
        .then(datos=>{
            limpiarHTML();

            if(datos.cod ==='404'){
                mostrarMensajeError('Ciudad no encontrada');
                return;
            }
            mostrarClima(datos);
        });
}

function mostrarClima(datos){
    const {main:{temp,temp_max,temp_min},name} = datos;

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold','text-2xl')

    const centigrados = kelvinaCentigrados(temp);
    const actual = document.createElement('p');
    actual.innerHTML =`${centigrados}&#8451;`; // es una identidad y solo me deja ponerla con innerHTML
    actual.classList.add('font-bold','text-6xl');

    const tempMaxima = kelvinaCentigrados(temp_max);
    const max = document.createElement('p');
    max.classList.add('text-xl');
    max.innerHTML = `Max: ${tempMaxima}&#8451;`;

    const tempMinima = kelvinaCentigrados(temp_min);
    const min = document.createElement('p');
    min.classList.add('text-xl');
    min.innerHTML = `Min: ${tempMinima}&#8451;`;

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-white','text-center');

    resultadoDiv.appendChild(nombreCiudad)
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(max);
    resultadoDiv.appendChild(min);
    resultado.appendChild(resultadoDiv);
}
// helper funciones pequeñas que retornan datos especificos
const kelvinaCentigrados = grados => parseInt(grados -273.15);
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner(){
    limpiarHTML();
    // spinner sacado de la pagina spinkit
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML =`
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
       `
    resultado.appendChild(divSpinner)
}