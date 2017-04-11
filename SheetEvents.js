/*global define*/
var comptar = 0;
var _self;
var tasksArray = new Array(10);
define( [
		'jquery',
		'underscore',
		'qlik',
		'angular',
		'core.utils/deferred',
		'./lib/external/sense-extension-utils/extUtils',
		'./properties',
		'./initialproperties'		
	],
	function ( $, _, qlik, angular, Deferred, extUtils, props, initProps ) {
		'use strict';
		
		// Helper function to split numbers.
		function splitToStringNum ( str, sep ) {
			var a = str.split( sep );
			for ( var i = 0; i < a.length; i++ ) {
				if ( !isNaN( a[i] ) ) {
					a[i] = Number( a[i] );
				}
			}
			return a;
		}

		return {
			
			definition: props,
			support: {
				export: false,
				exportData: false,
				snapshot: false				
			},
			initialProperties: initProps,
			snapshot: {canTakeSnapshot: false},
			
			controller: ['$scope', '$element', function ( $scope, $element ) {				
				
				
				if(_self){
					var app = qlik.currApp();
					
					var del = 0;
					var fld = null;
					var val = null;
					var val2 = null;
					var softlock = null;
					var vari = null;
					tasksArray = [];
										
					for ( var i = 1; i <= 10; i++ ) {
						
						del = $scope.layout.props['delay'];
						fld = "'" + $scope.layout.props['field' + i] + "'";
						val = "'" + $scope.layout.props['value' + i] + "'";
						val2 = $scope.layout.props['value' + i].split(';').join("'};{qText: '");
						softlock = "'" + $scope.layout.props['softlock' + i] + "'";
						vari = "'" + _self.backendApi.model.layout.props['variable' + i] + "'";						
												
						switch ( $scope.layout.props['actionBefore' + i] ) {
							case "clearAll":
								tasksArray[i - 1] = 'app.clearAll()';
								break;
							case "lockAll":
								tasksArray[i - 1] = 'app.lockAll()';
								break;
							case "unlockAll":
								tasksArray[i - 1] = 'app.unlockAll()';								
								break;
							case "clearField":
								if ( !_.isEmpty( fld ) ) {
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).clear()';
								}
								break;
							case "selectAlternative":
								if ( !_.isEmpty( fld ) ) {
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectAlternative( ' + softlock + ' )';
								}
								break;
							case "selectExcluded":
								if ( !_.isEmpty( fld ) ) {
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectExcluded( ' + softlock + ')';
								}
								break;
							case "selectPossible":
								if ( !_.isEmpty( fld ) ) {
									//tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectPossible( ' + softlock + ')';
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectPossible()';
								}
								break;
							case "selectField":
								
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectMatch( ' + val + ', true )';
								}
								
								break;
							case "selectValues":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									var vals = '[' + splitToStringNum( "{qText: '" + val2 + "'}", ';' ) + ']';
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectValues( ' + vals + ', false )';									
								}
								break;
							case "selectandLockField":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).selectMatch( ' + val + ', true );app.field( ' + fld + ' ).lock()';
								}
								break;
							case "lockField":
								if ( !_.isEmpty( fld ) ) {
									tasksArray[i - 1] = 'app.field( ' + fld + ' ).lock()';
								}
								break;
							case "applyBookmark":
								if ( !_.isEmpty( _self.backendApi.model.layout.props['bookmark' + i] ) ) {
									var myBookmark = app.bookmark.apply( _self.backendApi.model.layout.props['bookmark' + i] );
									tasksArray[i - 1] = 'app.bookmark.apply( ' + myBookmark + ' )';
								}
								break;
							case "setVariable":								
								if ( !_.isEmpty(vari) ) {									
									tasksArray[i - 1] = 'app.variable.setContent(' + vari + ',' + val + ')';
								}
								break;
							default:
								break;
						}
						
					}
					
					setTimeout(function(){ eval(tasksArray[0])
						.then(setTimeout(function(){ eval(tasksArray[1])
							.then(setTimeout(function(){ eval(tasksArray[2])
								.then(setTimeout(function(){ eval(tasksArray[3])
									.then(setTimeout(function(){ eval(tasksArray[4])
										.then(setTimeout(function(){ eval(tasksArray[5])
											.then(setTimeout(function(){ eval(tasksArray[6])
												.then(setTimeout(function(){ eval(tasksArray[7])
													.then(setTimeout(function(){ eval(tasksArray[8])
														.then(eval(tasksArray[9]))														
													}, del))
												}, del))
											}, del))
										}, del))
									}, del))
								}, del))
							}, del))
						}, del))
					},del)
					
				}

			}],
			paint : function($element, layout) {
				_self = this;
				//this execution must be executed the first time you access to the sheet during a session o after an F5
				// the _self variable will be = null
				//comptar == 0 only the first time you open the sheet during a session or after an F5
				if (comptar == 0) {
					comptar++;
					var app = qlik.currApp();

					var fld = null;
					var val = null;
					var softlock = null;
					var vari = null;

					for ( var i = 1; i <= 10; i++ ) {

						fld = "'" + _self.backendApi.model.layout.props['field' + i] + "'";
						val = _self.backendApi.model.layout.props['value' + i];
						softlock = _self.backendApi.model.layout.props['softlock' + i];
						vari = _self.backendApi.model.layout.props['variable' + i];

						switch ( _self.backendApi.model.layout.props['actionBefore' + i] ) {
							case "clearAll":
								app.clearAll();
								break;
							case "lockAll":
								app.lockAll();
								break;
							case "unlockAll":
								app.unlockAll();
								break;
							case "clearField":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).clear();
								}
								break;
							case "selectAlternative":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).selectAlternative( softlock );
								}
								break;
							case "selectExcluded":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).selectExcluded( softlock );
								}
								break;
							case "selectPossible":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).selectPossible( softlock );
								}
								break;
							case "selectField":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									app.field( fld ).selectMatch( val, false );
								}
								break;
							case "selectValues":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									var vals = splitToStringNum( val, ';' );
									app.field( fld ).selectValues( vals, false );
									console.log('1:'+'app.field( ' + fld + ' ).selectValues( ' + vals + ', false )');
								}
								break;
							case "selectandLockField":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									app.field( fld ).selectMatch( val, true );
									app.field( fld ).lock()
								}
								break;
							case "lockField":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).lock()
								}
								break;
							case "applyBookmark":
								if ( !_.isEmpty( _self.backendApi.model.layout.props['bookmark' + i] ) ) {
									app.bookmark.apply( _self.backendApi.model.layout.props['bookmark' + i] );
								}
								break;
							case "setVariable":
								if ( !_.isEmpty(vari) ) {
									app.variable.setContent(vari, val);
								}
								break;
							default:
								break;
						}
					}
				}								
			}
		};
	});