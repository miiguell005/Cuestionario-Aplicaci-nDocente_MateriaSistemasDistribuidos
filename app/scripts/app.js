'use strict';

/**
 * @ngdoc overview
 * @name VeterinariaSoftware
 * @description
 * # VeterinariaSoftware
 *
 * Main module of the application.
 */
angular
  .module('VeterinariaSoftware', [
    'ng',
    //'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'moment-picker',
    'webcam',
    'ngFileUpload',
    'ui.select',
    'firebase'
  ])
  .config(function ($routeProvider) {

    //https://firebase.google.com/docs/web/setup?hl=es-419
    var firebaseConfig = {
      apiKey: "api-key",
      authDomain: "project-id.firebaseapp.com",
      databaseURL: "https://project-id.firebaseio.com",
      projectId: "project-id",
      storageBucket: "project-id.appspot.com",
      messagingSenderId: "sender-id",
      appID: "app-id",
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //firebase.analytics();
    $routeProvider
      .when('/', {
        templateUrl: 'views/home/home.html',
        controller: 'homeController',
        controllerAs: 'home'
      })
      .when('/instrucciones', {
        templateUrl: 'views/juego/instrucciones.html',
        controller: 'instruccionesController',
        controllerAs: 'ins'
      })
      .when('/cuestionario/:tipoCuestionario', {
        templateUrl: 'views/juego/cuestionario.html',
        controller: 'cuestionarioController',
        controllerAs: 'cue'
      })
      .when('/resultados', {
        templateUrl: 'views/juego/resultados.html',
        controller: 'resultadosController',
        controllerAs: 'res'
      })
      
      .otherwise({
        redirectTo: '/'
      });
  })

  /**
   *Permite filtrar en el select de ui-select
   */
  .filter('uiFilterSelect', function () {
    return function (registros, textoEscrito) {
      console.log(registros, textoEscrito);
      //Almacena los registros que coinciden con lo que escribio el usuario
      var registrosAsociados = [];

      //Si es un array todos los registros
      if (angular.isArray(registros)) {

        //Obtiene la llave por la que se esta filtrando el texto
        var keys = Object.keys(textoEscrito);

        //Filtra las coincidencias 
        registrosAsociados = _.filter(registros, function (item) {

          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];

            var text = textoEscrito[prop].toLowerCase();

            if (item[prop].toString().toLowerCase().indexOf(text) !== -1)
              return true;
          }
        });
      } else
        registrosAsociados = registros;

      return registrosAsociados;
    };
  });
