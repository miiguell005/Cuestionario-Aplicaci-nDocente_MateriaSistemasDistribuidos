angular.module('VeterinariaSoftware')
  .controller('resultadosController', function ($window) {

    var vm = this;

    vm.resultados = [];

    vm.init = function () {

      vm.resultados = amplify.store.sessionStorage("Estadistica");

    }

    vm.init();

  });
