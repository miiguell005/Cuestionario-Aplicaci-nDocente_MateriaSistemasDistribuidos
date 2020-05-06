angular.module('VeterinariaSoftware')
  .component('cargandoComponent', {
    templateUrl: 'componentes/cargando/cargandoComponent.html',
    bindings: {
      cargando: "<",
      titulo: "<"
    },
    controller: 'cargandoController'
  })


  .controller('cargandoController', function ($scope) {

    var vm = this;

    //Actualiza el titulo de la página
    $scope.$watch("$ctrl.titulo", function (newVal, oldVal) {

      if (!vm.titulo)
        vm.titulo = "Cargando";

    }, $scope);

    /**
     * Cuando inicializa el componente 
     */
    vm.init = function () {

    }

    vm.init();
  });

