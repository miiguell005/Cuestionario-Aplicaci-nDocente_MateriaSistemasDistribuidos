angular.module('VeterinariaSoftware')
  .controller('cuestionarioController', function ($routeParams, imagenesHelper, $interval, $timeout, $window, $scope, $firebaseObject) {

    var vm = this;

    //Contiene el nombre del usuario que va a realiar la prueba
    vm.nombreUsuario = "";
    vm.puntuacion = 0;
    vm.preguntasCorrectas = {
      nombreUsuario: "",
      total: 0
    }

    //Si tiene un nombre registrado puede comenzar a realizar la prueba
    vm.mostrarCuestionario = false;

    //estructura de los objetos en firebase
    /*
    vm.cuestionarioTest = [
      {
        Texto: "En un negocio sería interesante encargarse de:",
        TipoCuestionario: "Docentes",
        Imagen: "",
        Materia: "Matematicas",
        Dificultad: "",
        OpcionRespuesta: [
          {
            Texto: "Las máquinas o llevar registros",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          },
          {
            Texto: "Entrevistar  y hablar con personas",
            Imagen: "",
            Seleccionada: false,
            Correcta: true
          },
          {
            Texto: "V erdadero",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          }
        ]
      },
      {
        Texto: "Si observo que la línea  de razonamiento de otra perdona   es incorrecta, normalmente",
        TipoCuestionario: "Docentes",
        Imagen: "",
        Materia: "Sociales",
        Dificultad: "",
        OpcionRespuesta: [
          {
            Texto: "Se lo señalo",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          },
          {
            Texto: "Lo paso por alto",
            Imagen: "",
            Seleccionada: false,
            Correcta: true
          },
          {
            Texto: "V erdadero",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          }
        ]
      },
      {
        Texto: "En la televisión prefiero",
        TipoCuestionario: "Docentes",
        Imagen: "",
        Materia: "Ingles",
        Dificultad: "",
        OpcionRespuesta: [
          {
            Texto: "Un programa sobre nuevos inventos prácticos",
            Imagen: "",
            Seleccionada: false,
            Correcta: true
          },
          {
            Texto: "Un concierto de un artista famoso",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          },
          {
            Texto: "V erdadero",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          }
        ]
      },
      {
        Texto: "Me cuesta bastante hablar delante de un grupo numeroso de personas",
        TipoCuestionario: "Docentes",
        Imagen: "",
        Dificultad: "",
        Materia: "Español",
        OpcionRespuesta: [
          {
            Texto: "V",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          },
          {
            Texto: "F",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          },
          {
            Texto: "Falso",
            Imagen: "",
            Seleccionada: false,
            Correcta: false
          },
          {
            Texto: "V erdadero",
            Imagen: "",
            Seleccionada: false,
            Correcta: true
          }
        ]
      }
    ];*/



    //Contiene las preguntas que se van a contestar en el cuestionario
    vm.cuestionario = [];

    //Lleva la cuenta de la pregunta en el cual se va a contestar
    vm.preguntaActual = 0;

    //Controla si el juego ha finalizado para que al final muestre las respuestas correctar y se guarde la puntuacion obtenida en el cuestionario
    vm.juegoFinalizado = false;

    vm.cargando = false;

    /**
     *Genera el juego con la cantidad de cartas
     */
    vm.init = function () {

      var numerales = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      var index = 1;

      var ref = firebase.database().ref();
      
      var obj = $firebaseObject(ref);

      //El servidor responde con las preguntas
      obj.$loaded().then(function () {


        var c = _.filter(obj.Cuestionarios, function (c) { return c.TipoCuestionario == "Docentes"; });// vm.cuestionarioTest;

        _.each(c, function (_c) {
          
          _c.constestado = false;
          _c.index = index;
          _c.Texto = index + ". " + _c.Texto;

          index++;

          _c.OpcionRespuesta = _.shuffle(_c.OpcionRespuesta);

          for (var i = 0; i < _c.OpcionRespuesta.length; i++)
            _c.OpcionRespuesta[i].Texto = numerales[i] + ". " + _c.OpcionRespuesta[i].Texto;
        });

        vm.cuestionario = c;

        vm.nombreUsuario = "";
        vm.puntuacion = 0;

      });

    }


    /**
     * Comienza el cuestionario para que sea contestado
     */
    vm.comenzarCuestionario = function () {

      if (!vm.nombreUsuario)
        return toastr.warning("Es necesario ingresar su nombre para comenzar la prueba");

      _.each(vm.cuestionario, function (p) {
        vm.preguntasCorrectas[p.Materia] = 0;
      });

      vm.mostrarCuestionario = true;
    }

    vm.actualizarPregunta = function (p) {
      vm.preguntaActual = p - 1;
    }

    /**
     * Obtiene la respuesta seleccionadad
     * @param {any} respuesta
     */
    vm.finalizarPrueba = function (siguientePregunta) {

      toastr.success("´Ha finalizado su prueba");

      vm.juegoFinalizado = true;

      _.each(vm.cuestionario, function (p) {

        _.each(p.OpcionRespuesta, function (r) {

          if (r.Correcta == true && r.Correcta == r.Seleccionada && !p.puntuacion) {
            vm.preguntasCorrectas[p.Materia] += 1;
            vm.preguntasCorrectas.total += 1;
            p.puntuacion = 1;
          }

          if (r.Correcta)
            r.class = "has-success";

          else if (r.Seleccionada && !r.Correcta)
            r.class = "has-error";

        });

        p.puntuacion = p.puntuacion ? p.puntuacion : 0;
        vm.puntuacion += p.puntuacion;
      });

      vm.actualizarPuntuacionSession();

    }

    /**
     *
     */
    vm.actualizarPuntuacionSession = function () {

      var estadistica = amplify.store.sessionStorage("Estadistica");
      
      vm.preguntasCorrectas.nombreUsuario = vm.nombreUsuario;

      vm.preguntasCorrectas.fecha = moment().format("DD/MM/YYYY HH:mm");

      estadistica = estadistica ? estadistica : [];

      estadistica.push(vm.preguntasCorrectas);

      estadistica = _.sortBy(estadistica, 'total').reverse();

      amplify.store.sessionStorage("Estadistica", estadistica);
    }

    vm.init();

  });

