var myApp = angular.module('myApp',['ngRoute', 'ui.router'], function($interpolateProvider){
	$interpolateProvider.startSymbol('<%');
	$interpolateProvider.endSymbol('%>');
});

myApp.controller('MainController', function($scope, $http) {
	var request ={
		method: 'GET', 
		url: '/template',
		data: {}, 
		headers: {
			'Content-Type':'application/json'
		}
	}

	$http.get('/template').then(function(response){
    	$scope.templates = response.data;
  	});

  	$http(request).then(function(response){
			console.log(response);
		}, function(error){
			console.log(error);
		})
  
  	$scope.ordered = function(order) 
  	{ 
  		$scope.orderSelected = order; 
  	};
});

myApp.controller('CreateController', function($scope,$http){
	$scope.data = {};
	$scope.save = function()
	{
		var request ={
			method: 'POST', 
			url: '/template',
			data: {
				'name': $scope.data.templateName,
				'content': $scope.data.templateContent
			}, 
			headers: {
				'Content-Type':'application/json'
			}
		}

		$http(request).then(function(response){
			searchParameters(response.data, $scope.data.templateContent)
			$scope.templateIdShow = response.data;
		}, function(error){
			console.log(error);
			$scope.response = 'error';
		})
	};

	var searchParameters = function(id, content)
	{
		var pattern = /(__%%)[A-Za-z^\S]+(%%__)/ig;
		var params = content.match(pattern);
		$scope.parameters = params;
		console.log($scope.parameters);
		var urlParameters = '/template/' + id;
		var request2 ={
			method: 'POST', 
			url: urlParameters,
			data: {
				'parameters': $scope.parameters
			}, 
			headers: {
				'Content-Type':'application/json'
			}
		}

		$http(request2).then(function(response){
			$scope.response = 'success';
			$scope.data.templateName = '';
			$scope.data.templateContent = '';
		}, function(error){
			console.log(error);
		})	
	}
});

myApp.controller('ShowController', function($scope,$http,$stateParams){
	var templateId = $stateParams.id;
	$scope.templateIdToData = templateId;
	var fullUrl = '/template/' + templateId;
	var request ={
		method: 'GET', 
		url: fullUrl,
		data: {}, 
		headers: {
			'Content-Type':'application/json'
		}
	}
	$http(request).then(function(response){
		$scope.templateContentToShow = response.data[0].content;
		$scope.templateNameToShow = response.data[0].name;
		console.log(response.data);
	}, function(error){
		
	});
});

myApp.controller('DataController', function($scope,$http,$stateParams){
	var templateIdData = $stateParams.id;
	$scope.templateIdData = templateIdData;
	var data = {};
	$scope.values = {'idparam':'', 'valueparam':''};
	var urlData = '/templateData/'+templateIdData;
	var request = {
		method: 'GET',
		url: urlData,
		data: {},
		headers: {
			'Content-Type':'application/json'
		}
	}

	$http(request).then(function(response){
		console.log(response.data);
		$scope.parametersList = response.data;
		$scope.position = 0;
	}, function(error){
		console.log(error);
	});

	$scope.addValue = function()
	{
		$scope.modeEdit = 'true';
	}

	$scope.clearParameter = function(parameter)
	{
		var parameterClean = parameter.split("%%");
		return parameterClean[1];
	}

	$scope.assignValuesToParameter = function(value, id)
	{
		$scope.values[id] = value;
	}

	$scope.toPDF = function()
	{
		var urlValues = '/template/' + $scope.templateIdData;
		var requestP ={
			method: 'GET', 
			url: urlValues,
			data: {}, 
			headers: {
				'Content-Type':'application/json'
			}
		}
		$http(requestP).then(function(response){
			console.log(response);
			var content = replaceContent(response.data[0].content, $scope.parametersList, $scope.values);
			//cleanContent(content);
			//generatePDF();
		}, function(error){
			console.log(error);
		});
	}

	var replaceContent = function(content, parameters, values)
	{
		var newContent = content;
		for(value in values)
		{
			for (var i = 0; i < parameters.length; i++) {
				if (value == parameters[i].idparam)
				{
					newContent = newContent.replace(parameters[i].parameter, values[value]);
				}
			}
		}	//
		return newContent;		
	}

	/*var generatePDF = function (content)
	{
		html2canvas(document.getElementById('exportthis'), {
			onrendered: function(canvas){
				var data = canvas.toDataURL();
				var docDefinition = {
					content: [{
						image: data,
						widht: 500,
					}]
				};
				//pdfMake.createPdf(docDefinition).download("Nuevo.pdf");	
			}
		});
	}*/


});

myApp.controller('EditController', function($scope,$http){
	
});




var configFunction = function($routeProvider, $stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('main', {
		url: '/',
		templateUrl: 'public/htmlcontent/main.html',
		controller: 'MainController'
	})

	.state('create', {
		url: '/create',
		templateUrl: 'public/htmlcontent/create.html',
		controller: 'CreateController'
	})

	.state('show', {
		url: '/show/:id', 
		templateUrl: 'htmlcontent/show.html',
		controller: 'ShowController'
	})	

	.state('edit', {
		url: '/edit', 
		templateUrl: 'htmlcontent/edit.html',
		controller: 'EditController'
	})

	.state('data', {
		url: '/data/:id', 
		templateUrl: 'htmlcontent/data.html',
		controller: 'DataController'
	});
};
configFunction.$inject = ['$routeProvider', '$stateProvider', '$urlRouterProvider'];
myApp.config(configFunction);
