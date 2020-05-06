angular.module('VeterinariaSoftware')
  .controller('instruccionesController', function ($window, $scope, $firebaseObject) {

    var vm = this;

    vm.instrucciones = "";

    vm.init = function () {

      var ref = firebase.database().ref();
      
      var obj = $firebaseObject(ref);

      //El servidor responde con las preguntas
      obj.$loaded().then(function () {
        
        var c = _.filter(obj.Instrucciones, function (i) { return i.TipoCuestionario == "Docentes"; });
        
        vm.instrucciones = c;
      });
    }
    
    vm.init();

  });
