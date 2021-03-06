angular.module('acmplugin').controller('InstanceCtrl', ['$scope', '$routeParams', '$location', 'camundaService', function($scope, $routeParams, $location, camundaService) {
'use strict';
	
	// retrieve all case instances.
	camundaService.caseInstances().then(function(data) {
		$scope.caseInstances = data;
	});

	 // retrieve all case instances.
  camundaService.processInstances().then(function(data) {
    $scope.processInstances = data;
  });

	
	// flag for active instances only
	$scope.activeVersionsOnly = true;
  // flag for active instances only
  $scope.activeVersionsOnly2 = true;

	
	// retrieve a instance by instanceId
	var loadCaseInstance = function(instanceId) {
		camundaService.caseInstance(instanceId).then(function(instance) {
			// load all versions of the same key
			$scope.selectedInstance = instance;

			// variables
			camundaService.caseIntanceVariables($scope.selectedInstance.id).then(function(variables) {
				
				var data = [];
				
				for (var key in variables) {
					  if (variables.hasOwnProperty(key)) {
					    data.push({
					    	name : key, 
					    	type: variables[key].type, 
					    	value: variables[key].value });
					  }
				}
				$scope.caseInstanceVariables = data; 
			});
			
			// executions
			camundaService.caseExecutions($scope.selectedInstance.id).then(function(executions) {
				$scope.caseInstanceExecutions = executions;
			});

			// tasks
			camundaService.tasks($scope.selectedInstance.id).then(function(tasks) {
				$scope.tasks = tasks;
			});
		});
	}


	// only load if case definition id is selected.
	if ($routeParams.instanceId) {	
		
	  // starts execution of a task
		$scope.startExecution = function(caseExecutionId) {
			camundaService.startExecution(caseExecutionId).then(function(result) {
				$scope.ExecutionStartResult = result;
				loadCaseInstance($routeParams.instanceId);
			});
		};
		
		// completes execution of a task
		$scope.completeExecution = function(caseExecutionId) {
			camundaService.completeExecution(caseExecutionId).then(function(result) {
				loadCaseInstance($routeParams.instanceId);
			});
		};
		
		// opens human task form
		$scope.openTaskForm = function(task) {
//		  console.log(task);
		  $location.path('/task/' + task.id);
		};
		
		loadCaseInstance($routeParams.instanceId);
	} else {
		$scope.selectedInstance = null;
	}
}]);
