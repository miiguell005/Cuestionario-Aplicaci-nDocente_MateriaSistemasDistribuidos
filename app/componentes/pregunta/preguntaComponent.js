angular.module('VeterinariaSoftware')
  .component('preguntaComponent', {
    templateUrl: 'componentes/pregunta/preguntaComponent.html',
    bindings: {
      pregunta: "=",
      cargando: "=",
      juegoFinalizado: '<',
      event: "&"
    },
    controller: 'preguntaController'
  })


  .controller('preguntaController', function ($scope) {

    var vm = this;

    vm.respuestas = [];
    vm.respuestaSeleccionada = null;


    //Se actualizan las respuestas acorde a la pregunta cambie
    $scope.$watch("$ctrl.pregunta", function (newVal, oldVal) {

      //Si el juego no ha finalizado
      if (!vm.juegoFinalizado) {

        vm.respuestaSeleccionada = null;
        vm.respuestas = [];
        
      }
    });
    
    vm.actualizarRespuestas = function (respuesta) {

      _.each(vm.pregunta.OpcionRespuesta, function (r) {
        r.Seleccionada = false;
        r.Seleccionado = "false";
      });

      respuesta.Seleccionado = "true";
      vm.pregunta.constestado = true;
      respuesta.Seleccionada = true;
    }

    /**
     * Cuando inicializa el componente 
     */
    vm.init = function () {

    }

    vm.init();
  });

