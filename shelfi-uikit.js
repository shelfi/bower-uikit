angular.module('uikit',['uikit.components','uikit.components.breadcrumb','uikit.components.cart','uikit.components.creditCardForm','uikit.components.filter','uikit.components.installmentTable','uikit.components.listManager','uikit.components.menu','uikit.components.navbar','uikit.components.orderSummary','uikit.components.pagination','uikit.components.paymentForm','uikit.components.paymentFormManager','uikit.components.productInfo','uikit.components.productItem','uikit.components.productOptions','uikit.components.productPrice','uikit.components.search','uikit.components.sort','uikit.components.userinfo','uikit.core','ngMaterial','ngMessages']);
(function() {

	'use strict';

	/**
	* Initialization for uikit-core
	*/

	angular.module('uikit.core', ['ngMaterial', 'shelfiFormBuilder'])
		
		.config(function ($mdThemingProvider, $mdIconProvider) {
			//$mdThemingProvider.alwaysWatchTheme(true);
			$mdThemingProvider.theme('altTheme')
				.primaryPalette('purple') // specify primary color, all other color intentions will be inherited from default
				.accentPalette('orange');

			$mdThemingProvider.theme('docs-dark', 'default')
				.primaryPalette('orange')
				.dark();

			$mdIconProvider
				.iconSet('action', '/uikit/images/icons/svg-sprite-action.svg', 24)
				.iconSet('navigation', '/uikit/images/icons/svg-sprite-navigation.svg', 24)
				.iconSet('content', '/uikit/images/icons/svg-sprite-content.svg', 24)
				.iconSet('communication', '/uikit/images/icons/svg-sprite-communication.svg', 24)
				.iconSet('maps', '/uikit/images/icons/svg-sprite-maps.svg', 24)
				.iconSet('av', '/uikit/images/icons/svg-sprite-av.svg', 24)
				.iconSet('extra', '/uikit/images/icons/extra.svg');
		})
		.run(function($log){
		  $log.debug("uikit + ngMaterial running...");
		})
		.directive('sfTemplate', function ($compile) {
			return {
				restrict: 'A',
				//scope: {
				//  template: '=sfTemplate',
				//  item: '=ngModel'
				//},
				link: function (scope, element, attrs) {

					//if (scope.template) {
					//  element.html(scope.template);
					//  $compile(element.contents())(scope);
					//}

					//console.log(attrs.sfTemplate, attrs.ngModel);

					//console.log(attrs.ngModel, scope.$parent[attrs.ngModel]);
					//console.log(attrs.sfTemplate, scope[attrs.sfTemplate]);
					//console.log(attrs.sfTemplate, scope);
					//console.log(attrs.sfTemplate, scope.$eval(attrs.sfTemplate));
					//var t = scope.$parent.$eval(attrs.sfTemplate);

					var t = scope.$eval(attrs.sfTemplate);
					if (t) {
						//console.log(t, scope.$parent);
						element.html(t);
						//console.log(element.contents());
						//$compile(element.contents())(scope.$parent);
						$compile(element.contents())(scope);
					}
				}
			};
		})
		.directive('ngIncludeReplace', function () {
			return {
				require: 'ngInclude',
				restrict: 'A',
				link: function (scope, el, attrs) {
					el.replaceWith(el.children());
				}
			};
		})
		.directive('holderJs', function () {
			// https://github.com/imsky/holder/pull/26
			return {
				link: function (scope, element, attrs) {
					attrs.$set('data-src', attrs.holderJs);
					Holder.run({ images: element[0], nocss: true });
				}
			};
		})
		.filter('offset', function () {
			return function (input, start) {
				start = parseInt(start, 10);
				return input.slice(start);
			};
		})
		.controller('listController', function ($filter) {

			var _self = this;

			this.doRequest1 = function (items) {

				if (this.config.cliensidePagination) {

					this.items = items;

					this.allItems = items;
					this.totalItems = items.length;
					//this.filter();
					return;
				}

				this.items = items;
				this.totalItems = items.length;






				/*
				var data = {
					//multi: true
					cliensidePagination: this.config.cliensidePagination,
					selectedFilterItems: this.selectedFilter.filterItems,
					search: this.search.$,
					orderBy: this.orderBy,
					reverse: this.reverse,
					itemsPerPage: this.itemsPerPage,
					currentPage: this.currentPage
				};

				//console.log('doRequest', this.config);
				//console.log('doRequest', data);

				Restangular.all(this.config.url).getList(data).then(function (response) {

					//console.log('doRequest', response);

					if(response.listOptions) {

						if(response.listOptions.hasOwnProperty('cliensidePagination')) {

							_self.config.cliensidePagination = response.listOptions.cliensidePagination;
						}
						
						if(response.listOptions.hasOwnProperty('totalItems')) {
							_self.totalItems = response.listOptions.totalItems;
						}
					}

					var r = response.list || response;

					if(_self.config.cliensidePagination) {

						_self.allItems = r;
						_self.totalItems = r.length;
						_self.filter();
						return;
					}

					_self.items = r;
				});
				*/
			};

			this.getItems = function (filterItems, search, order, currentPage) {
				//asd

				if (this.config.cliensidePagination) {
					this.allItems = r;
					this.totalItems = r.length;
					this.filter();
					return;
				}
				this.items = r;

				//process order --- ng-repeat="item in items | filter:search | orderBy:orderBy:reverse | offset:(currentPage-1)*itemsPerPage | limitTo:itemsPerPage"
				//--------------------------------------------------------------------------------------
				//1. filter:filter
				//2. filter:search
				//3. orderby
				//------------------------ pagination
				//4. offset
				//5. limit

				console.log(currentPage);
			};








			//filter
			this.selectFilter = function (filter) {
				this.selectedFilter = angular.copy(filter);
				//console.log('selectFilter', this.selectedFilter);
				this.filter();
			};

			this.selectDefaultFilter = function () {
				this.selectedFilter = angular.copy(this.filters[0]);
				//console.log('selectDefaultFilter', this.selectedFilter);
				this.filter();
			};

			this.removeFilterItem = function (filterItem) {
				var index = this.selectedFilter.filterItems.indexOf(filterItem);
				if (index > -1) {
					this.selectedFilter.filterItems.splice(index, 1);
					//console.log('removeFilterItem', this.selectedFilter);
					if (this.selectedFilter.filterItems.length === 0) {
						this.selectDefaultFilter();
						return;
					}
					this.filter();
				}
			};

			this.loadFilter = function () {
				/*
				//TODO:Load filter dynamically
				this.filters = [
					{ id: '0', name: this.config.defaultFilterName, filterItems: [] },
					{ id: '1', name: 'elmalar', filterItems: [ 
						{column: 'name', operator: 'eq', value: 'elma1'}
						,{column: 'name', operator: 'eq', value: 'elma2'} 
					]},
					{ id: '2', name: '100 TL\'den buyuk siparisler', filterItems: [ 
						{column: 'sku', operator: 'eq', value: 'asd'}, 
						{column: 'name', operator: 'neq', value: 'asd'}, 
						{column: 'name', operator: 'sm', value: 'asd'},
						{column: 'name', operator: 'nsm', value: 'asd'},
						{column: 'name', operator: 'gt', value: 'asd'},
						{column: 'name', operator: 'gteq', value: 'asd'},
						{column: 'name', operator: 'lt', value: 'asd'},
						{column: 'name', operator: 'lteq', value: 'asd'},
						{column: 'name', operator: 'btw', value: '1', value2: '5'},
						{column: 'name', operator: 'sw', value: 'asd'},
						{column: 'name', operator: 'ew', value: 'asd'}
					]},
					{ id: '3', name: 'Ucretsiz kargo kampanyasina ait siparisler', filterItems: [ {column: 'sku', operator: 'eq', value: 'asd'} ]}
				];
				*/
			};

			this.saveFilter = function (filter) {
				//console.log('saveFilter', filter);
				if (filter.id) {
					//update
					if (filter.id === '0') {
						return false;
					}

					//TODO:save to DB
					for (var i = 0; i < this.filters.length; i++) {

						if(this.filters[i].id === filter.id) {

							this.filters[i] = filter;
							this.selectFilter(filter);
							return true;
						}
					}
					return false;
				}
				else {
					//add
					//TODO:save to DB
					this.filters.push(filter);
					this.selectFilter(filter);
					return true;
				}
				return false;
			};

			this.removeFilter = function (filter) {
				//console.log('removeFilter', filter);
				if (filter.id === '0') {
					return false;
				}
				//TODO:save to DB
				for (var i = 0; i < this.filters.length; i++) {

					if (this.filters[i].id === filter.id) {
						this.selectDefaultFilter();
						this.filters.splice(i, 1);
						return true;
					}
				}
				return false;
			};

			this.searchChanged = function () {
				//console.log('searchChanged', this.search);
				this.filter();
			};

			this.filter = function () {

				//console.log('filter');
				if (this.config.cliensidePagination) {
					
					//process order --- ng-repeat="item in items | filter:search | orderBy:orderBy:reverse | offset:(currentPage-1)*itemsPerPage | limitTo:itemsPerPage"
					//--------------------------------------------------------------------------------------
					//1. filter:filter
					//2. filter:search
					//3. orderby
					//------------------------ pagination
					//4. offset
					//5. limit

					var items = this.allItems;

					items = $filter('filter')(items, function (item) {
						
						for (var i = 0; i < this.selectedFilter.filterItems.length; i++) {

							var filterItem = this.selectedFilter.filterItems[i];
							var value = item[filterItem.column];

							if(!operators.check(value, filterItem.operator, filterItem.value, filterItem.value2)) {
								return false;
							}
						}
						return true;
					}.bind(this));

					//search
					items = $filter('filter')(items, this.search);

					this.currentPage = 1;
					this.itemsFiltered = items;
					this.totalItems = items.length;

					this.sort();
					return;
				}
				this.doRequest();
			};

			//sort
			this.sortChanged = function (column) {
				//console.log('sortChanged', column);
				if (column.substr(column.length - 1) === "-") {
					this.orderBy = column.substr(0, column.length - 1);
					this.reverse = true;
					this.sort();
				}
				else if (this.orderBy === column) {
					this.reverse = !this.reverse;
					this.sort();
				}
				else {
					this.orderBy = column;
					this.reverse = false;
					this.sort();	
				}
			};

			this.sort = function () {
				//console.log('sort', this.orderBy, this.reverse);
				if (this.config.cliensidePagination) {
					this.itemsSorted = $filter('orderBy')(this.itemsFiltered, this.orderBy, this.reverse);
					this.paginate();
					return;
				}
				this.doRequest();
			};

			//pagination
			this.itemsPerPageChanged = function () {
				//console.log('itemsPerPageChanged', this.itemsPerPage);
				this.currentPage = 1;
				this.paginate();
			};

			this.pageChanged = function (page) {
				//console.log('pageChanged', page, this.itemsPerPage);
				this.paginate();
			};

			this.paginate = function() {
				//console.log('paginate');
				if (this.config.cliensidePagination) {
					var items = this.itemsSorted;
					items = $filter('offset')(items, (this.currentPage - 1) * this.itemsPerPage);
					items = $filter('limitTo')(items, this.itemsPerPage);
					this.items = items;
					return;
				}
				this.doRequest();
			};

			//action
			this.selectedItemActionFilter = function(action) {
				return action.apply === 'selected' || action.apply === 'all';
			};

			this.itemActionFilter = function(action) {
				return action.apply === 'item' || action.apply === 'all';
			};

			this.actionSelected = function (action) {
				var selectedItems = $filter('filter')(this.items, { selected: true });
				//console.log('actionSelected', action, selectedItems);
				action.fn(selectedItems);
			};

			//this.setConfig = function (config) {
			//	this.config = angular.extend({}, defaultListConfig, config);
			//};
			this.config = {};
			this.columns = [];
			this.items = [];
			this.itemsFiltered = [];
			this.itemsSorted = [];
			this.allItems = [];
			this.totalItems = 0;
			this.orderBy = '_id';
			this.reverse = false;
			this.itemsPerPage = 5;
			this.currentPage = 1;
			this.search = '';
			this.filters = [
				{ id: '0', name: 'Genel', filterItems: [] }
				//{ id: '0', name: $translate.instant(this.config.url + '.' + this.config.defaultFilterName), filterItems: [] }
				//{ id: '0', name: this._scope.config.defaultFilterName, filterItems: [] }
			];
			this.selectedFilter = angular.copy(this.filters[0]);
		});

	angular.module('uikit.components', ['uikit.core']);
	angular.module('uikit.snippets', ['uikit.core']);





	

})();
(function(){
'use strict';
angular.module('uikit.components.breadcrumb', [])
  .directive('sfBreadcrumb', sfBreadcrumbDirective);


function sfBreadcrumbDirective(){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/breadcrumb/breadcrumb.tmpl.html',
		controller: function(){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope:{
			navitems: '=ngModel'
		}
	};
}
})();
(function(){

	'use strict';

	angular.module('uikit.components.cart', [])
		.directive('sfCart', function () {
			return {
				restrict: 'E',
				templateUrl: 'components/cart/cart.tmpl.html',
				scope: {
					order: '=ngModel',
					columns: '=?',
					totals: '=?',
					actions: '=?',
					showHeader: '@',
					showGroupAction: '@',
					removeItem: '&'
				},
				bindToController: true,
				controller: function () {
					this.triggerActionCallback = function (cb) {
						var items = this.order.products.filter(function (p) {
							return p.selected === true;
						});
						if (items.length) {
							cb(items);
						}
					};
				},
				controllerAs: 'ctrl',
				link: function (scope, element, attrs) {
					if (!attrs.columns) {
						scope.ctrl.columns = [
							{ name: 'image', title: 'Image', width: '10', template: '<img holder-js="{{ item.image }}" />' },
							{ name: 'name', title: 'Name' },
							{ name: 'qty', title: 'Qty', width: '15', template: '<md-input-container ng-if="!item.qtyOptions"><label>Quantity</label><input ng-model="item.qty"></md-input-container><md-select ng-if="item.qtyOptions" ng-model="item.qty" placeholder="Select quantity"><md-option ng-repeat="qtyOption in item.qtyOptions" ng-value="qtyOption">{{ qtyOption }}</md-option></md-select>' },
							{ name: 'total', title: 'Total', width: '10', template: '{{ item.price * item.qty | currency }}' }
						];
					}

					if (scope.ctrl.showGroupAction === 'true') {
						scope.ctrl.columns.unshift({
							name: 'select',
							title: 'Select',
							width: '5',
							template: '<md-checkbox ng-model="item.selected" aria-label="Select item"></md-checkbox>'
						});
					}

					if (!attrs.totals) {
						scope.ctrl.totals = [
							{
								name: 'total',
								title: 'Total',
								fn: function (order) {
									return order.products.reduce(function (returned, current) {
										return returned + (current.price * current.qty);
									}, 0);
								}
							}
						];
					}
					scope.ctrl.actions = scope.ctrl.actions || [];
					if (attrs.removeItem) {
						scope.ctrl.actions.unshift({
							name: 'remove',
							title: 'Remove',
							icon: 'navigation:ic_close_24px',
							cb: function (items) {
								scope.ctrl.removeItem({ items: items });
							}
						});
					}
					if (scope.ctrl.actions.length) {
						scope.ctrl.columns.push({
							name: 'actions',
							title: 'Actions',
							width: '5',
							template: '<md-button ng-repeat="action in ctrl.actions" aria-label="{{ action.title }}" ng-click="action.cb(item)"><md-icon md-svg-icon="{{ action.icon }}"></md-icon></md-button>'
						});
					}
				}
			};
		});

})();
(function(){

	'use strict';

	angular.module('uikit.components.creditCardForm', [])
		
		//https://github.com/jessepollak/card
		//https://github.com/gavruk/angular-card/blob/master/src/card.js

		.directive('cardNumberValidator', function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					cardNumberValidator: '='
				},
				link: function(scope, element, attrs, ctrl) {
					ctrl.$validators.cardNumberValidator = function (value) {
						if (value) {
							var cardNumber = value.replace(/\s/g, ''),
								validator = scope.cardNumberValidator,
								valid = false;
							if (angular.isString(validator) || angular.isNumber(validator)) {
								valid = cardNumber.substring(0, validator.toString().length) === validator.toString();
								if (valid) {
									return Payment.fns.validateCardNumber(value);
								}
							}
							else if (angular.isArray(validator)) {
								var i = 0;
								for (i = 0; i < validator.length; i++) {
									valid = cardNumber.substring(0, validator[i].toString().length) === validator[i].toString();
									if (valid) {
										return Payment.fns.validateCardNumber(value);
									}
								}
							}
							else {
								return Payment.fns.validateCardNumber(value);
							}
							return false;
						}
						return false;
					};
				}
			};
		})

		.directive('cardExpiryValidator', function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function(scope, element, attrs, ctrl) {
					ctrl.$validators.cardExpiryValidator = function (value) {
						if (value) {
							var expiry = Payment.fns.cardExpiryVal(value);
							return Payment.fns.validateCardExpiry(expiry.month, expiry.year);
						}
						return false;
					};
				}
			};
		})

		.directive('cardCvcValidator', function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function(scope, element, attrs, ctrl) {
					ctrl.$validators.cardCvcValidator = function (value) {
						if (value) {
							return Payment.fns.validateCardCVC(value);
						}
						return false;
					};
				}
			};
		})
		
		.directive('sfCreditCardForm', function () {
			return {
				restrict: 'E',
				require: '?ngModel',
				templateUrl: 'components/creditCardForm/creditCardForm.tmpl.html',
				scope: {
					card: '=ngModel',
					form: '=',
					preview: '@',
					onCreditCardChange: '&'
				},
				bindToController: true,
				controller: function () {
					var _self = this;
					this.structure = {
						row: [
							{
								inputContainer: {
									label: 'Full name',
									input: {
										type: 'text',
										name: 'name',
										ngModel: 'data.name',
										required: '',
										validationTexts: {
											required : 'Full name is required. Please fill the input.'
										}
									}
								}
							},
							{
								inputContainer: {
									label: 'Card number',
									input: {
										type: 'text',
										name: 'number',
										ngModel: 'data.number',
										ngChange: _self.onCreditCardChange,
										required: '',
										cardNumberValidator: '',
										validationTexts: {
											required : 'Card number is required. Please fill the input.',
											cardNumberValidator : 'The card number is not valid!'
										}
									}
								}
							},
							{
								inputContainer: {
									label: 'Expiry',
									input: {
										type: 'text',
										name: 'expiry',
										ngModel: 'data.expiry',
										ngChange: _self.onCreditCardChange,
										required: '',
										cardExpiryValidator: '',
										validationTexts: {
											required : 'Expiry is required. Please fill the input.',
											cardExpiryValidator : 'Expiry is not valid!'
										}
									}
								}
							},
							{
								inputContainer: {
									label: 'Cvc',
									input: {
										type: 'text',
										name: 'cvc',
										ngModel: 'data.cvc',
										ngChange: _self.onCreditCardChange,
										autocomplete: 'off',
										required: '',
										cardCvcValidator: '',
										validationTexts: {
											required : 'Cvc is required. Please fill the input.',
											cardCvcValidator : 'Cvc is not valid!'
										}
									}
								}
							}
						]
					};
				},
				controllerAs: 'ctrl',
				link: function (scope, element, attrs, ngModelCtrl) {
					if (ngModelCtrl) {
						ngModelCtrl.$formatters.push(function (v) {
							
							v.name = v.name || '';
							v.number = v.number || '';
							v.expiry = v.expiry || '';
							v.cvc = v.cvc || '';

							v.number = Payment.fns.formatCardNumber(v.number);

							if (!Payment.fns.validateCardNumber(v.number)) {
								v.number = '';
							}

							var expiry = Payment.fns.cardExpiryVal(v.expiry);
							if (!Payment.fns.validateCardExpiry(expiry.month, expiry.year)) {
								v.expiry = '';
							}

							if (!Payment.fns.validateCardCVC(v.cvc)) {
								v.cvc = '';
							}
							return v;
						});

						//ngModelCtrl.$parsers.push(function (v) {
						//	console.log('parsers', v);
						//	return v;
						//});

						if (scope.ctrl.card && scope.ctrl.card.number) {
							scope.ctrl.onCreditCardChange();
						}
					}

					var simulateEvents = function () {
						//console.log('watchMAIN');
						//http://stackoverflow.com/questions/446892/how-to-find-event-listeners-on-a-dom-node
						//WebKit Inspector in Chrome or Safari browsers now does this. It will display the event listeners for a DOM element when you select it in the Elements pane.
						//http://www.w3schools.com/jsref/met_document_addeventlistener.asp
						//https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
						//http://stackoverflow.com/questions/18823872/jquery-dispatchevent-wrapper-method
						//https://github.com/sandeep45/betterTrigger
						//https://learn.jquery.com/events/triggering-event-handlers/
						angular.element('input[name="name"]').simulate('keyup');
						angular.element('input[name="number"]').simulate('keyup');
						angular.element('input[name="expiry"]').simulate('keyup');
						angular.element('input[name="cvc"]').simulate('keyup');
						scope.ctrl.onCreditCardChange();
					};

					scope.$watch('ctrl.card', simulateEvents);

					element.ready(function () {
						var card = new Card({
							form: 'form[name="creditCardForm.form"]',
							container: '.card-wrapper',
							width: 200,
							formatting: true,
							debug: true
						});
						simulateEvents();
					});
				}
			};
		});

})();
(function(){
'use strict';
angular.module('uikit.components.filter', [])
  .directive('sfFilter', sfFilterDirective);


function sfFilterDirective(){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/filter/filter.tmpl.html'
	};
}
})();
(function(){

	'use strict';

	angular.module('uikit.components.installmentTable', [])

		.directive('sfInstallmentTable', function () {
			return {
				restrict: 'E',
				templateUrl: 'components/installmentTable/installmentTable.tmpl.html',
				scope: {
					amount: '=ngModel',
					paymentOptions: '=',
					onSelectOption: '&'
				},
				bindToController: true,
				controller: function () {
					this.getAmount = function (installment) {
						return this.amount + (this.amount * installment.rate / 100);
					};
				},
				controllerAs: 'ctrl',
				link: function (scope, element, attrs) {
					scope.onSelectOption = false;
					if (attrs.onSelectOption) {
						scope.onSelectOption = true;
					}
				}
			};
		});

})();
(function(){

	'use strict';

	angular.module('uikit.components.listManager', [])
		
		.directive('sfListManager', function () {
			return {
				restrict: 'E',
				templateUrl: 'components/listManager/listManager.tmpl.html',
				scope: {
					items: '=ngModel',
					showItemLayout: '@',
					itemLayout: '@',
					onItemLayoutChange: '&',
					
					sortOptions: '=',
					sort: '=',

					onSortChange: '&',

					filter: '=',
					onFilterChange: '&',

					actionButtons: '='
				},
				bindToController: true,
				controller: function () {
					this.onActionClick = function (cb) {
						cb(this.items.filter(function (item) {
							return item.selected;
						}));
					};
					this.getIcon = function (action) {
						return action.toLowerCase().replace(/\s/g, '_');
					};
				},
				controllerAs: 'ctrl'
			};
		});

})();
(function(){
'use strict';
angular.module('uikit.components.menu', [])
  .directive('sfMenu', sfMenuDirective);


function sfMenuDirective(){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/menu/menu.tmpl.html',
		controller: function(){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			item: '=ngModel',
		}
	};
}
})();
(function(){
'use strict';
angular.module('uikit.components.navbar', [])
  .directive('sfNavbar', sfNavbarDirective);


function sfNavbarDirective(){
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'components/navbar/navbar.tmpl.html',
			controller: function(){},
			controllerAs: 'ctrl',
			bindToController: true,
			scope: {
				item: '=ngModel'
			}
		};
	}
})();
(function(){
'use strict';
angular.module('uikit.components.orderSummary', [])
  .directive('sfOrderSummary', sfOrderSummaryDirective);


function sfOrderSummaryDirective($mdTheming){
	return {
		restrict: 'E',
		transclude: true,
		template: getTemplate,
		link: postLink,
		controller: function(){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			item: '=ngModel'
		}
	};

	function postLink (scope, element){
		$mdTheming(element);
	}

	function getTemplate (){
		return '<div>this is order summary</div>';
	}
}
})();
(function(){
	
	'use strict';
	
	//cloned from ui.bootstrap.pagination
	angular.module('uikit.components.pagination', [])

	.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
	  var self = this,
	      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
	      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

	  this.init = function(ngModelCtrl_, config) {
	    ngModelCtrl = ngModelCtrl_;
	    this.config = config;

	    ngModelCtrl.$render = function() {
	      self.render();
	    };

		$scope.itemsPerPageOptions = null;
		if ($attrs.itemsPerPageOptions) {
			$scope.$parent.$watch($parse($attrs.itemsPerPageOptions), function(value) {
				$scope.itemsPerPageOptions = value;
			});
		}
		
	    if ($attrs.itemsPerPage) {
	      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
	        self.itemsPerPage = parseInt(value, 10);
	        $scope.totalPages = self.calculateTotalPages();
	      });
	    } else {
	      this.itemsPerPage = config.itemsPerPage;
	    }
	  };

	  this.calculateTotalPages = function() {
	    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
	    return Math.max(totalPages || 0, 1);
	  };

	  this.render = function() {
	    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
	  };

	  $scope.selectPage = function(page) {
	    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
	      ngModelCtrl.$setViewValue(page);
	      ngModelCtrl.$render();
	      $scope.onPageChanged({page: page});
	    }
	  };

	  $scope.getText = function( key ) {
	    return $scope[key + 'Text'] || self.config[key + 'Text'];
	  };
	  $scope.noPrevious = function() {
	    return $scope.page === 1;
	  };
	  $scope.noNext = function() {
	    return $scope.page === $scope.totalPages;
	  };

	  $scope.$watch('totalItems', function() {
	    $scope.totalPages = self.calculateTotalPages();
	  });

	  $scope.$watch('totalPages', function(value) {
	    setNumPages($scope.$parent, value); // Readonly variable

	    if ( $scope.page > value ) {
	      $scope.selectPage(value);
	    } else {
	      ngModelCtrl.$render();
	    }
	  });
	}])

	.constant('paginationConfig', {
	  itemsPerPage: 10,
	  boundaryLinks: false,
	  directionLinks: true,
	  firstText: 'First',
	  previousText: 'Previous',
	  nextText: 'Next',
	  lastText: 'Last',
	  rotate: true
	})

	.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      firstText: '@',
	      previousText: '@',
	      nextText: '@',
	      lastText: '@',
	      onPageChanged: '&',
	      onItemsPerPageChanged: '&'
	    },
	    require: ['pagination', '?ngModel'],
	    controller: 'PaginationController',
	    //templateUrl: 'template/pagination/pagination.html',
	    templateUrl: 'components/pagination/pagination.tmpl.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      // Setup configuration parameters
	      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
	          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
	      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
	      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

	      paginationCtrl.init(ngModelCtrl, paginationConfig);

	      if (attrs.maxSize) {
	        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
	          maxSize = parseInt(value, 10);
	          paginationCtrl.render();
	        });
	      }







	      scope.showItemsPerPage = false;

	      scope.toggleDropup = function () {
	      	scope.showItemsPerPage = !scope.showItemsPerPage;
	      };
	      
	      scope.changeItemPerPage = function (newVal) {
	      	//set parent itemPerPage model
	      	var itemPerPageSetter = $parse(attrs.itemsPerPage).assign;
	      	itemPerPageSetter(scope.$parent, newVal);

	      	scope.showItemsPerPage = false;
	        paginationCtrl.itemsPerPage = parseInt(newVal, 10);
	        scope.totalPages = paginationCtrl.calculateTotalPages();
	        scope.selectPage(1);
	        paginationCtrl.render();
	        scope.onItemsPerPageChanged();
		  };







	      // Create page object used in template
	      function makePage(number, text, isActive) {
	        return {
	          number: number,
	          text: text,
	          active: isActive
	        };
	      }

	      function getPages(currentPage, totalPages) {
	        var pages = [];

	        // Default page limits
	        var startPage = 1, endPage = totalPages;
	        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

	        // recompute if maxSize
	        if ( isMaxSized ) {
	          if ( rotate ) {
	            // Current page is displayed in the middle of the visible ones
	            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
	            endPage   = startPage + maxSize - 1;

	            // Adjust if limit is exceeded
	            if (endPage > totalPages) {
	              endPage   = totalPages;
	              startPage = endPage - maxSize + 1;
	            }
	          } else {
	            // Visible pages are paginated with maxSize
	            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

	            // Adjust last page if limit is exceeded
	            endPage = Math.min(startPage + maxSize - 1, totalPages);
	          }
	        }

	        // Add page number links
	        for (var number = startPage; number <= endPage; number++) {
	          var page = makePage(number, number, number === currentPage);
	          pages.push(page);
	        }

	        // Add links to move between page sets
	        if ( isMaxSized && ! rotate ) {
	          if ( startPage > 1 ) {
	            var previousPageSet = makePage(startPage - 1, '...', false);
	            pages.unshift(previousPageSet);
	          }

	          if ( endPage < totalPages ) {
	            var nextPageSet = makePage(endPage + 1, '...', false);
	            pages.push(nextPageSet);
	          }
	        }

	        return pages;
	      }

	      var originalRender = paginationCtrl.render;
	      paginationCtrl.render = function() {
	        originalRender();
	        if (scope.page > 0 && scope.page <= scope.totalPages) {
	          scope.pages = getPages(scope.page, scope.totalPages);
	        }
	      };
	    }
	  };
	}])

	.constant('pagerConfig', {
	  itemsPerPage: 10,
	  previousText: '« Previous',
	  nextText: 'Next »',
	  align: true
	})

	.directive('pager', ['pagerConfig', function(pagerConfig) {
	  return {
	    restrict: 'EA',
	    scope: {
	      totalItems: '=',
	      previousText: '@',
	      nextText: '@'
	    },
	    require: ['pager', '?ngModel'],
	    controller: 'PaginationController',
	    //templateUrl: 'template/pagination/pager.html',
	    templateUrl: 'components/pagination/pager.tmpl.html',
	    replace: true,
	    link: function(scope, element, attrs, ctrls) {
	      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

	      if (!ngModelCtrl) {
	         return; // do nothing if no ng-model
	      }

	      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
	      paginationCtrl.init(ngModelCtrl, pagerConfig);
	    }
	  };
	}]);

})();
(function(){

	'use strict';

	angular.module('uikit.components.paymentForm', [])

		.directive('sfPaymentForm', function () {
			return {
				restrict: 'E',
				templateUrl: function (element, attrs) {
					var view = attrs.view || 'tab';
					return 'components/paymentForm/paymentForm-' + view + '.tmpl.html';
				},
				scope: {
					paymentOptions: '=ngModel',
					proceed: '&'
				},
				bindToController: true,
				controller: function () {
					//asdsad
				},
				controllerAs: 'ctrl'
				//link: function (scope, element, attrs, ngModelCtrl) {
				//	//asd
				//}
			};
		});

})();
(function(){

	'use strict';

	angular.module('uikit.components.paymentFormManager', []);

})();
(function(){
'use strict';
angular.module('uikit.components.productInfo', [])
  .directive('sfProductInfo', sfProductInfoDirective);


function sfProductInfoDirective(){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/productInfo/productInfo.tmpl.html',
		controller: function(){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			item: '=ngModel'
		}
	};

}
})();
(function(){

'use strict';

	angular.module('uikit.components.productItem', [])

		.directive('sfProductItem', function () {
			return {
				restrict: 'E',
				require: "^?sfProductList",
				templateUrl: 'components/productItem/productItem.tmpl.html',
				scope: {
					item: '=ngModel',
					itemLayout: '@',
					showImage: '@',
					showName: '@',
					showDescription: '@',
					showPrice: '@',
					showQuantity: '@',
					showPromotion: '@',
					selectable: '@',
					click: '&',
					addToCart: '&'
				},
				// Check for angular 1.4 bindToController usage: http://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html#improvements-in-14
				bindToController: true,
				controller: function () {
					//console.log('ctrl', this.addToCart);
				},
				controllerAs: 'ctrl',
				link: function (scope, element, attrs, ctrl) {
					scope.ctrl.showAddToCartButton = attrs.addToCart ? 'true' : 'false';
					scope.ctrl.itemLayout = 'list';
					scope.ctrl.predefineQuantity = false;
					scope.ctrl.quantity = {
						value: 1,
						step: 100,
						min:100,
						max: 5000
					};

					if (ctrl) {
						scope.ctrl.showImage = scope.ctrl.showImage || ctrl.showImage;
						scope.ctrl.showName = scope.ctrl.showName || ctrl.showName;
						scope.ctrl.showDescription = scope.ctrl.showDescription || ctrl.showDescription;
						scope.ctrl.showPrice = scope.ctrl.showPrice || ctrl.showPrice;
						scope.ctrl.showQuantity = scope.ctrl.showQuantity || ctrl.showQuantity;
						scope.ctrl.showPromotion = scope.ctrl.showPromotion || ctrl.showPromotion;
						scope.ctrl.selectable = scope.ctrl.selectable || ctrl.selectable;
					}

					scope.ctrl.itemLayout = scope.ctrl.itemLayout || 'grid';
				}
			};

			//function link (scope, element){
			//	$mdTheming(element);
			//}
			
		});

})();
(function(){
'use strict';
angular.module('uikit.components.productOptions', [])
  .directive('sfProductOptions', sfProductOptionsDirective);


function sfProductOptionsDirective($mdTheming){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/productOptions/productOptions.tmpl.html',
		link: postLink,
		controller: function(){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			item: '=ngModel'
		}
	};

	function postLink (scope, element){
		$mdTheming(element);
	}
}
})();
(function(){
'use strict';
angular.module('uikit.components.productPrice', [])
  .directive('sfproductPrice', sfproductPriceDirective);


function sfproductPriceDirective(){
	return {
		restrict: 'E',
		transclude: true,
		template: '1231321',
		controller: function(){
			console.log('12');
		},
		controllerAs: 'ctrl',
		bindToController: true
	};
}
})();
(function(){
'use strict';
angular.module('uikit.components.search', [])
  .directive('sfSearch', sfSearchDirective);


function sfSearchDirective($mdTheming){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/search/search.tmpl.html',
		link: postLink,
		controller: function (){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			search: '=ngModel'
		}
	};

	function postLink (scope, element){
		$mdTheming(element);
	}

}
})();
(function(){
'use strict';
angular.module('uikit.components.sort', [])
  .directive('sfSort', sfSortDirective);


function sfSortDirective($mdTheming){
	return {
		restrict: 'E',
		transclude: true,
		template: getTemplate,
		link: postLink,
		controller: function(){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			item: '=ngModel'
		}
	};

	function postLink (scope, element){
		$mdTheming(element);
	}
	function getTemplate (){
		return '<div>this is sorter</div>';
	}
}
})();
(function(){
'use strict';
angular.module('uikit.components.userinfo', [])
  .directive('sfUserInfo', sfUserInfoDirective);


function sfUserInfoDirective($mdTheming){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'components/userInfo/userInfo.tmpl.html',
		link: postLink,
		controller: function (){},
		controllerAs: 'ctrl',
		bindToController: true,
		scope: {
			user: '=ngModel'
		}
	};

	function postLink (scope, element){
		$mdTheming(element);
	}

}
})();
angular.module("uikit").run(["$templateCache", function($templateCache) {$templateCache.put("components/breadcrumb/breadcrumb.tmpl.html","<div class=\"sf-breadcrumb\">\n	<ul class=\"inline\">\n		<li class=\"sf-breadcrumb__item\" ng-repeat=\"item in ctrl.navitems.primary\"><a href=\"{{ctrl.navitems.link}}\">{{item.title}}</a></li>\n	</ul>\n</div>");
$templateCache.put("components/cart/cart.tmpl.html","<div class=\"sf-cart\" layout=\"column\">\n	<div class=\"sf-cart__detail\">\n		<md-list>\n			<md-item class=\"sf-cart__detail-header\" ng-show=\"ctrl.showHeader === \'true\'\">\n				<md-item-content layout=\"row\">\n					<div ng-repeat=\"column in ctrl.columns\" flex=\"{{ column.width }}\" flex-sm=\"30\">{{ column.title }}</div>\n				</md-item-content>\n			</md-item>\n			<md-item ng-repeat=\"item in ctrl.order.products\" class=\"sf-cart__detail-item\">\n				<md-item-content layout=\"row\">\n					<div ng-repeat=\"column in ctrl.columns\" flex=\"{{ column.width }}\" flex-sm=\"30\" sf-template=\"column.template\" ng-model=\"item\">{{ item[column.name] }}</div>\n				</md-item-content>\n			</md-item>\n			<md-item-content class=\"sf-cart__detail-totals\" layout=\"column\" layout-align=\"center end\" ng-show=\"ctrl.totals\">\n				<div flex ng-repeat=\"total in ctrl.totals\"><strong>{{ total.title }}:</strong> {{ total.fn(ctrl.order) | currency }}</div>\n			</md-item-content>\n		</md-list>\n\n		<md-button ng-if=\"ctrl.showGroupAction === \'true\'\" class=\"md-raised\" ng-repeat=\"action in ctrl.actions\" aria-label=\"{{ action.title }}\" ng-click=\"ctrl.triggerActionCallback(action.cb)\">{{ action.title }} <md-icon md-svg-icon=\"{{ action.icon }}\"></md-icon></md-button>\n\n	</div>\n</div><!-- sf-cart__detail-action -->");
$templateCache.put("components/creditCardForm/creditCardForm.tmpl.html","<div class=\"demo-container\">\n\n	<div class=\"card-wrapper\" ng-show=\"ctrl.preview === \'true\'\"></div>\n\n	<sf-form-builder structure=\"ctrl.structure\" ng-model=\"ctrl.card\" form=\"ctrl.form\"></sf-form-builder>\n</div>");
$templateCache.put("components/filter/filter.tmpl.html","<div ng-repeat=\"item in ctrl.filter\">\n<md-checkbox ng-model=\"item.cb\" aria-label=\"Checkbox 1\">\n    <div ng-transclude></div>\n</md-checkbox>\n</div>");
$templateCache.put("components/installmentTable/installmentTable.tmpl.html","<div class=\"demo-container\">\n\n	<div ng-repeat=\"paymentOption in ctrl.paymentOptions | filter:{ installment: true }\">\n		<h2>{{ paymentOption.title }}</h2>\n		<ul>\n			<li ng-repeat=\"installment in paymentOption.installments\">\n				<span ng-if=\"!onSelectOption\">\n					{{ installment.installment }}\n					- {{ installment.rate }}\n					- {{ ctrl.getAmount(installment) | currency }}\n					- {{ ctrl.getAmount(installment) / installment.installment | currency }}\n				</span>\n				<a ng-if=\"onSelectOption\" ng-href ng-click=\"ctrl.onSelectOption({ paymentOption: paymentOption, installment: installment })\">\n					{{ installment.installment }}\n					- {{ installment.rate }}\n					- {{ ctrl.getAmount(installment) | currency }}\n					- {{ ctrl.getAmount(installment) / installment.installment | currency }}\n				</a>\n			</li>\n		</ul>\n	</div>\n</div>");
$templateCache.put("components/listManager/listManager.tmpl.html","<div class=\"sf-list-manager\" layout=\"row\">\n	<div class=\"sf-list-manager__layout\" ng-if=\"ctrl.showItemLayout === \'true\'\">\n		<md-button class=\"md-primary sf-list-manager__layout-btn\" ng-class=\"{ \'--active\': ctrl.itemLayout === \'list\' }\" aria-label=\"view list\" ng-click=\"ctrl.onItemLayoutChange({layout: \'list\'})\"><md-icon md-svg-icon=\"action:ic_view_headline_24px\" alt=\"List View\" title=\"List View\"></md-icon></md-button>\n		<md-button class=\"md-primary sf-list-manager__layout-btn\" ng-class=\"{ \'--active\': ctrl.itemLayout === \'detailedlist\' }\" aria-label=\"view detailed list\" ng-click=\"ctrl.onItemLayoutChange({layout: \'detailedlist\'})\"><md-icon md-svg-icon=\"action:ic_view_list_24px\" alt=\"Detailed List View\" title=\"Detailed List View\"></md-icon></md-button>\n		<md-button class=\"md-primary sf-list-manager__layout-btn\" ng-class=\"{ \'--active\': ctrl.itemLayout === \'grid\' }\" aria-label=\"view grid\" ng-click=\"ctrl.onItemLayoutChange({layout: \'grid\'})\"><md-icon md-svg-icon=\"action:ic_view_module_24px\" alt=\"Grid View\" title=\"Grid View\"></md-icon></md-button>\n	</div>\n	<div class=\"sf-list-manager__sort\" ng-if=\"ctrl.sortOptions\">\n		<md-select ng-model=\"ctrl.sort\" placeholder=\"Sort\" class=\"sf-list-manager__sort-select\" ng-change=\"ctrl.onSortChange({sort: ctrl.sort})\">\n			<md-option ng-repeat=\"o in ctrl.sortOptions\" ng-value=\"o\">{{ o }}</md-option>\n		</md-select>\n\n		<!--INFO:added for simulate to click of column header -->\n		<span ng-repeat=\"o in ctrl.sortOptions\" style=\"margin-right:5px;\" hide>\n			<a href ng-click=\"ctrl.onSortChange({sort: o})\">{{o}}</a>\n		</span>\n	</div>\n	<div class=\"sf-list-manager__action\">\n		<!-- replace sfListManagerActive behaviour with md-menu (milestone 0.10.0 - April 14th)-->\n		<!-- https://github.com/angular/material/issues/78 -->\n		<md-button class=\"md-primary\" aria-label=\"click to filter\" title=\"click to filter\" ng-click=\"sfListFilterActive = !sfListFilterActive\"><md-icon md-svg-icon=\"action:ic_search_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<md-button class=\"md-primary\" aria-label=\"click to add\" title=\"click to add selected\" ng-click=\"sfListManagerActive = !sfListManagerActive\"><md-icon md-svg-icon=\"navigation:ic_more_vert_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<div class=\"sf-list-manager__action-list md-shadow-bottom-z-1\" ng-show=\"sfListManagerActive\">\n		<md-button ng-repeat=\"(action, cb) in ctrl.actionButtons\" class=\"md-primary sf-list-manager__action-list-item\" ng-click=\"ctrl.onActionClick(cb)\" aria-label=\"{{ action }}\" class=\"sf-list-manager__action-btn\">\n			<md-icon md-svg-icon=\"{{ ctrl.getIcon(action) }}\"></md-icon>\n			<md-tooltip md-direction=\"left\">{{ action }}</md-tooltip>\n		</md-button>\n		</div>\n	</div>\n	<div class=\"sf-list-manager__filter\" ng-show=\"sfListFilterActive\">\n		<md-input-container>\n		<label for=\"blabla\"><md-icon md-svg-icon=\"action:ic_search_24px\"></md-icon>Filter</label>\n			<input type=\"text\" ng-model=\"ctrl.filter\" ng-change=\"ctrl.onFilterChange()\" />\n		</md-input-container>\n		<md-button class=\"sf-list-manager__filter-close\" ng-click=\"sfListFilterActive = false\" aria-label=\"close\"><md-icon md-svg-icon=\"navigation:ic_close_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n	</div>\n</div>");
$templateCache.put("components/menu/menu.tmpl.html","<ul class=\"sf-menu\">\n    <li ng-repeat=\"item in ctrl.item.root\">\n      <md-button class=\"md-button-toggle\" ng-click=\"toggle()\">\n        {{item.title}}\n        <span aria-hidden=\"true\" class=\"md-toggle-icon\" ng-class=\"{\'toggled\' : isOpen()}\"></span>\n            <span class=\"visually-hidden\">Toggle {{isOpen()? \'expanded\' : \'collapsed\'}}</span>\n            </md-button>\n      <ul class=\"sf-menu__tree\">\n      <li ng-repeat=\"item in item.submenu\">\n        <a href=\"#\">{{item.title}}<md-icon md-svg-icon=\"navigation:ic_expand_more_24px\" alt=\"Icon Alt\"></md-icon></a>\n        <ul class=\"sf-menu__subtree\">\n          <li ng-repeat=\"item in item.subsubmenu\">\n              <a href=\"{{subitem.link}}\">{{item.title}}</a>\n              <a href=\"#\" ng-click=\"ctrl.expanditem != ctrl.expanditem\"><md-icon md-svg-icon=\"navigation:ic_expand_more_24px\" alt=\"Icon Alt\"></md-icon></a>\n              <ul class=\"sf-menu__subsubtree\">\n                <li ng-repeat=\"item in ctrl.item.subsubtree\"><a href=\"{{item.link}}\">{{item.title}}</a>\n                  <a href=\"#\" ng-click=\"ctrl.item.expanditem != ctrl.item.expanditem\"><md-icon md-svg-icon=\"navigation:ic_chevron_right_24px\" alt=\"Icon Alt\"></md-icon></a></li>\n              </ul>\n          </li>\n          </ul>\n      </li>\n    </ul>\n  </li>\n</ul>");
$templateCache.put("components/navbar/navbar.tmpl.html","<nav class=\"sf-navbar\" role=\"navigation\">\n	<ul layout layout-align=\"space-around\" layout-fill layout-wrap>\n		<li ng-repeat=\"item in ctrl.item\" flex flex-sm=\"50\"><a href=\"{{item.link}}\" class=\"sf-navbar_link\">{{item.title}}</a>\n		<ul class=\"sf-navbar__submenu\">\n			<li ng-repeat=\"subitem in item.submenu\"><a href=\"{{subitem.link}}\">{{subitem.title}}</a></li>\n		</ul>\n		</li>\n	</ul>\n</nav>");
$templateCache.put("components/orderSummary/orderSummary.tmpl.html","<div class=\"order-summary-container\">	\n	<div class=\"panel panel-contrast\">\n		<div class=\"panel-heading\">\n			Sipariş Özeti\n		</div><!-- /panel-heading -->\n		<div class=\"panel-body\">\n			<div class=\"order-summary\">\n				<strong>Urun Adet</strong>\n				<span class=\"order-quantity\">{{ $root.order.products.length }}</span>\n				<strong>KDV Dahil Toplam Tutar</strong>\n				<span class=\"order-total-price\">{{ $root.order.total | currency }}<!--<em>TL</em>--></span>\n			</div><!-- /order-sumary -->\n			<div class=\"order-extra\">\n				<sf-checkbox value=\"0\" id=\"order-extra-note\" text=\"Siparis Notum Var\" checked=\"false\"></sf-checkbox>\n				<sf-checkbox value=\"0\" id=\"order-extra-gift\" text=\"Hediye Paketi Olsun\" checked=\"false\"></sf-checkbox>\n			</div><!-- /order-extra -->\n			<div class=\"order-cta\">\n				<button type=\"button\" class=\"btn btn-primary btn-xs\" ng-click=\"cartCtrl.addPromotionCode()\">Promosyon kodu Ekle <span class=\"fui-plus pull-right\"></span></button>\n				<button type=\"button\" class=\"btn btn-primary btn-xs\">Ek Urun Ekle <span class=\"fui-plus pull-right\"></span></button>\n			</div><!-- /order-cta -->\n		</div><!-- /panel-body -->\n		<div class=\"panel-footer pbl\">\n			<div class=\"step-action\" ng-transclude></div>\n		</div><!-- panel-footer -->\n	</div>\n</div>");
$templateCache.put("components/pagination/pager.tmpl.html","<ul class=\"pager\">\n  <li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href ng-click=\"selectPage(page - 1)\">{{getText(\'previous\')}}</a></li>\n  <li ng-class=\"{disabled: noNext(), next: align}\"><a href ng-click=\"selectPage(page + 1)\">{{getText(\'next\')}}</a></li>\n</ul>");
$templateCache.put("components/pagination/pagination.tmpl.html","<div class=\"sf-pagination\">\n	<ul class=\"sf-pagination__list\" layout=\"row\">\n		<li ng-if=\"boundaryLinks\" ng-class=\"{\'sf-pagination__item--disabled\': noPrevious()}\" class=\"sf-pagination__item-first\">\n			<a href ng-click=\"selectPage(1)\"><md-icon md-svg-icon=\"extra:chevron-double-left\" alt=\"Icon Alt\"></md-icon></a>\n		</li>\n		<li ng-if=\"directionLinks\" ng-class=\"{\'sf-pagination__item--disabled\': noPrevious()}\" class=\"sf-pagination__item-previous\">\n			<a href ng-click=\"selectPage(page - 1)\"><md-icon md-svg-icon=\"navigation:ic_chevron_left_24px\" alt=\"Icon Alt\"></md-icon></a>\n		</li>\n		<li ng-repeat=\"page in pages track by $index\" ng-class=\"{\'sf-pagination__item--active\': page.active}\" class=\"sf-pagination__item-number\" hide-sm>\n			<a href ng-click=\"selectPage(page.number)\">{{page.text}}</a>\n		</li>\n		<li class=\"sf-pagination__item-current\" show-sm hide>{{page}} / {{totalPages}}</li>\n		<li ng-if=\"directionLinks\" ng-class=\"{\'sf-pagination__item--disabled\': noNext()}\" class=\"sf-pagination__item-next\">\n			<a href ng-click=\"selectPage(page + 1)\"><md-icon md-svg-icon=\"navigation:ic_chevron_right_24px\" alt=\"Icon Alt\"></md-icon></a>\n		</li>\n		<li ng-if=\"boundaryLinks\" ng-class=\"{\'sf-pagination__item--disabled\': noNext()}\" class=\"sf-pagination__item-last\">\n			<a href ng-click=\"selectPage(totalPages)\"><md-icon md-svg-icon=\"extra:chevron-double-right\" alt=\"Icon Alt\"></md-icon></a>\n		</li>\n		<li class=\"sf-pagination__item-dropup\" ng-if=\"itemsPerPageOptions\">\n			<a href ng-click=\"toggleDropup()\" ng-class=\"{\'sf-pagination__itemperpage--active\':showItemsPerPage}\"><md-icon md-svg-icon=\"navigation:ic_arrow_drop_up_24px\" alt=\"Icon Alt\"></md-icon></a>\n			<ul class=\"sf-pagination__itemperpage\" ng-show=\"showItemsPerPage\">\n	        	<li ng-repeat=\"ipp in itemsPerPageOptions\" class=\"sf-pagination__itemperpage-item\"><a ng-click=\"changeItemPerPage(ipp);\">{{ipp}}</a></li>\n	      </ul>\n		</li>\n	</ul>\n</div>");
$templateCache.put("components/paymentForm/paymentForm-list.tmpl.html","<div ng-repeat=\"paymentOption in ctrl.paymentOptions\">\n	<h2>{{paymentOption.name}}</h2>\n	<ul>\n		<li ng-repeat=\"installment in paymentOption.installment\" payment-gateway-isbank>\n			<span ng-show=\"installment.rate !== 0\">% {{ installment.rate }} Komisyon</span>\n			<span ng-show=\"installment.rate === 0\">Komisyonsuz</span>\n			<span ng-show=\"installment.installment !== 1\">{{ installment.installment }} Taksit ile</span>\n			<span ng-show=\"installment.installment === 1\">Pesin</span>\n			<span>{{ ((ctrl.amount * 1) + (ctrl.amount * installment.rate / 100)) | currency }}</span>\n\n			<md-button class=\"md-raised\" ng-click=\"ctrl.showModal(paymentOption, installment)\">Normal</md-button>\n			<md-button class=\"md-raised\" ng-click=\"ctrl.showModal(paymentOption, installment)\">3D</md-button>\n			<md-button class=\"md-raised\" ng-click=\"ctrl.showModal(paymentOption, installment)\">Puan</md-button>\n\n			<span>Ode</span>\n		</li>\n	</ul>\n</div>");
$templateCache.put("components/paymentForm/paymentForm-tab.tmpl.html","<md-tabs md-selected=\"selectedIndex\" md-border-bottom>\n	<md-tab ng-repeat=\"paymentOption in ctrl.paymentOptions\" label=\"{{ paymentOption.name }}\">\n		\n		\n		<div class=\"demo-tab tab{{$index%4}}\" style=\"padding: 25px; text-align: center;\">\n			{{ paymentOption.name }} icerigi\n		</div>\n\n\n	</md-tab>\n</md-tabs>");
$templateCache.put("components/productInfo/productInfo.tmpl.html","<div class=\"sf-product__info\" layout=\"row\" layout-wrap>\n	<h4 flex=\"100\">Technical Info</h4>\n	<span flex=\"15\">Field Title</span>\n	<span flex=\"85\">Lorem ipsum dolor sit amet, consectetur  qui animi doloremque</span>\n</div>\n");
$templateCache.put("components/productItem/productItem.tmpl.html","<div class=\"sf-product\" ng-class=\"{ \'sf-product--grid\': ctrl.itemLayout === \'grid\', \'sf-product--list\': ctrl.itemLayout === \'list\', \'sf-product--detailedlist\': ctrl.itemLayout === \'detailedlist\' }\">\n	<div class=\"sf-product__image\" ng-if=\"ctrl.showImage === \'true\'\">\n		<a ng-href ng-click=\"ctrl.click({ product: ctrl.item })\"><img holder-js=\"{{ ctrl.item.image }}\" class=\"md-card-image\"></a>\n	</div>\n	<div class=\"sf-product__badge\" ng-if=\"ctrl.showPromotion === \'true\'\">\n		<div class=\"sf-product__badge-item\" ng-repeat=\"item in ctrl.item.promotion\">\n			<md-icon md-svg-icon=\"{{item.icon}}\" alt=\"{{item.description}}\"></md-icon>\n			<md-tooltip md-direction=\"top\" md-delay=\"200\">{{ item.description }}</md-tooltip>\n		</div>\n	</div>\n	<div class=\"sf-product__info\">\n		<h3 ng-if=\"ctrl.showName === \'true\'\" class=\"sf-product__title\"><a ng-href ng-click=\"ctrl.click({ product: ctrl.item })\">{{ ctrl.item.name }}</a></h3>\n		<p ng-if=\"ctrl.showDescription === \'true\'\" class=\"sf-product__description\">{{ ctrl.item.desc }}</p>\n		<div  class=\"sf-product__price\" ng-if=\"ctrl.showPrice === \'true\'\">\n			<span>{{ ctrl.item.price | currency }}</span>\n		</div>\n	</div>\n	<div class=\"sf-product__action\" ng-if=\"ctrl.showAddToCartButton === \'true\'\">\n		<div class=\"sf-product__quantity\" ng-if=\"ctrl.showQuantity === \'true\'\">\n			<!-- text input veya select olarak adet girilebilir (select item predefine ozelligi controllerdan define oluyor.)-->\n			<md-input-container class=\"sf-product__quantity-number\">\n				<label for=\"quantity\">Adet</label>\n				<input type=\"number\" name=\"quantity\" ng-model=\"ctrl.quantity.value\" min=\"1\" max=\"1000\" ng-if=\"!ctrl.predefineQuantity\">\n				<input type=\"number\" step=\"{{ctrl.quantity.step}}\" ng-model=\"ctrl.quantity.value\" min=\"{{ctrl.quantity.min}}\" max=\"{{ctrl.quantity.max}}\" ng-if=\"ctrl.predefineQuantity\">\n			</md-input-container>\n		</div>\n		<div class=\"sf-product__cta\">\n			<md-button class=\"md-fab md-primary md-raised sf-product__cta-btn\" ng-click=\"ctrl.addToCart({ product: ctrl.item })\" aria-label=\"Sepete Ekle\">\n				<md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Icon Alt\">\n					<md-tooltip>Sepete Ekle</md-tooltip>\n				</md-icon>\n			</md-button>\n		</div>\n		<div class=\"sf-product__compare\" ng-if=\"ctrl.selectable === \'true\'\">\n			<md-checkbox ng-model=\"ctrl.item.selected\" class=\"sf-product__compare-checkbox\" aria-label=\"{{ctrl.item.name}}\"></md-checkbox>\n		</div>\n	</div>\n</div>");
$templateCache.put("components/productOptions/productOptions.tmpl.html","<div class=\"sf-product-item__variations\">\n	<select name=\"\" id=\"\">\n		<option value=\"\">Option1</option>\n		<option value=\"\">Option2</option>\n	</select>\n</div>");
$templateCache.put("components/productPrice/productPrice.tmpl.html","<div class=\"sf-product__price\" layout=\"column\">\n	<span class=\"sf-product__price--primary\">25TL</span>\n	<span class=\"sf-product__price--discount\">30TL</span>\n</div>");
$templateCache.put("components/search/search.tmpl.html","<div class=\"sf-search-container\">\n	<md-input-container>\n		<label><md-icon md-svg-icon=\"action:ic_search_24px\" alt=\"Icon Alt\"></md-icon></label>\n		<input ng-model=\"search.entry\">\n	</md-input-container>\n</div>");
$templateCache.put("components/sort/sort.tmpl.html","<div class=\"sf-product-sorter\">\n	<select ng-model=\"ctrl.products\" ng-options=\"opt as opt.label for opt in options\">\n    </select>\n</div>");
$templateCache.put("components/userInfo/userInfo.tmpl.html","<div layout=\"column\" layout-fill>\n	<md-card class=\"md-whiteframe-z1\" layout=\"column\" layout-align=\"center center\" md-padding>\n		<div><img data-src=\"{{ctrl.user.image}}\" alt=\"{{ctrl.user.name}}\"></div>\n		<h5>{{ctrl.user.name}}</h5>\n		<p><md-button><md-icon md-svg-icon=\"communication:ic_email_24px\" alt=\"Help\" aria-label=\"email\"></md-icon></md-button>{{ctrl.user.email}}</p>\n		<p><md-button><md-icon md-svg-icon=\"communication:ic_phone_24px\" alt=\"Help\" aria-label=\"phone\"></md-icon></md-button>{{ctrl.user.phone}}</p>\n	</md-card>\n</div>");
$templateCache.put("templates/barem/partials/BAREM-banner.tmpl.html","<div class=\"sf-banner\">\n	<img data-src=\"holder.js/100%x60/text:Main banner\" alt=\"Banner\">\n</div>");
$templateCache.put("templates/barem/partials/BAREM-footer.tmpl.html","<footer layout=\"column\" layout-padding class=\"sf-footer\">\n	<div layout=\"row\">\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">BAREM</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Döviz Kurları</a></li>\n				<li><a href=\"#\">Banka Hesapları</a></li>\n				<li><a href=\"#\">Sevkiyat Programı</a></li>\n				<li><a href=\"#\">Form ve Broşürler</a></li>\n				<li><a href=\"#\">Başvuru Formları</a></li>\n			</ul>\n		</div>\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">HESABIM</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Hesap Ayarları</a></li>\n				<li><a href=\"#\">Sepetlerim</a></li>\n				<li><a href=\"#\">Tekliflerim</a></li>\n				<li><a href=\"#\">Cari Hesabım</a></li>\n				<li><a href=\"#\">Siparişlerim</a></li>\n				<li><a href=\"#\">İade Talepleri</a></li>\n			</ul>\n		</div>\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">KAMPANYALAR</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Yeni Ürünler</a></li>\n				<li><a href=\"#\">İndirimdekiler</a></li>\n				<li><a href=\"#\">E-posta Listesi</a></li>\n				<li><a href=\"#\">Bit Pazarı</a></li>\n			</ul>\n		</div>\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">DESTEK</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Müşteri Hizmetleri</a></li>\n				<li><a href=\"#\">Arıza Kabul</a></li>\n				<li><a href=\"#\">Arıza Takip</a></li>\n				<li><a href=\"#\">Kargo Takip</a></li>\n				<li><a href=\"#\">Garanti Sorgulama</a></li>\n				<li><a href=\"#\">SSS</a></li>\n				<li><a href=\"#\">İletişim</a></li>\n			</ul>\n		</div>\n	</div>\n	<div class=\"sf-tertiary\">\n		<small>© 2006 - 2015 BAREM Bilgisayar Hizmetleri Tic. Ltd. Şti. B2B elektronik ticaret sitesi\nÜrün resimleri, bilgileri ve özellikleri üretici / dağıtıcı / ithalatçı firmalardan derlenmiştir.\nPHONEX ve NOTEPAL, BAREM Bilgisayar Hizmetleri Tic. Ltd. Şti.\'nin tescilli logo ve markalarıdır.\nDiğer logo ve markalar ilgili şirketlerin tescilli logo ve markalarıdır.</small>\n	</div>\n</footer>");
$templateCache.put("templates/barem/partials/BAREM-header.tmpl.html","<body ng-controller=\"TemplatesCtrl as ctrl\" layout=\"column\" md-theme=\"altTheme\" md-theme-watch>\n    <div ng-include=\"\'templates/BAREM/partials/BAREM-topbar.tmpl.html\'\" ng-include-replace></div>\n    <div class=\"sf-wrapper\" layout=\"row\">");
$templateCache.put("templates/barem/partials/BAREM-minicart-sidenav.tmpl.html","<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"mini-cart\">\n    <md-toolbar>\n        <h2 class=\"md-toolbar-tools\">Mini Cart\n			<md-button ng-click=\"ctrl.closeMiniCart()\" aria-label=\"Close\"><md-icon md-svg-icon=\"navigation:ic_close_24px\" alt=\"Close\"></md-icon></md-button>\n        </h2>\n    </md-toolbar>\n    <md-content class=\"md-padding\">\n    	<sf-cart ng-model=\"ctrl.order\" columns=\"ctrl.columns\" show-header=\"true\" show-delete-button=\"true\" show-standby-button=\"true\" show-totals=\"true\"></sf-cart>\n    </md-content>\n</md-sidenav>");
$templateCache.put("templates/barem/partials/BAREM-payment.tmpl.html","<div layout=\"row\" layout-align=\"space-between\" layout-padding>	\n	<div layout=\"column\" flex=\"60\">\n		<div>\n			<h3>1) Ödeme Tutarı Girin</h3>\n			<md-input-container>\n			<label for=\"amount\">Tutar</label>\n			<input type=\"text\" name=\"amount\" id=\"amount\">\n			</md-input-container>\n		</div>\n		<div>\n		<h3>2) Ödeme Metodu Seçin</h3>\n		<ul class=\"inline\">\n			<li><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Icon Alt\"></md-icon> Normal</md-button></li>\n				<li><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_3d_rotation_24px\" alt=\"Icon Alt\"></md-icon> 3d Secure</md-button></li>\n				<li><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_loyalty_24px\" alt=\"Icon Alt\"></md-icon> Puan</md-button></li>\n		</ul>\n		</div>\n	</div>\n	<div>\n		<h5>Kredi Kartı Kampanyalarımız</h5>\n		<ul class=\"sf-payment__info\">\n			<li><span>Halkbank</span>2 taksit 0 komisyon</li>\n			<li><span>BankAsya</span>3 taksit 0 komisyon</li>\n			<li><span>Maximum</span>3 taksit 0 komisyon</li>\n			<li><span>Vakifbank</span>2 taksit icin +3, 3 taksit icin +6 ek taksit</li>\n		</ul>\n	</div>\n</div>\n\n<div layout=\"column\" class=\"sf-table\" layout-padding>\n	<h3>3) Banka ve Taksit Seçin</h3>\n	<div layout=\"row\" class=\"sf-table__header\">\n		<div flex=\"20\">Banka</div>\n		<div flex=\"20\"><strong>Taksit Türü</strong></div>\n		<div flex=\"20\"><strong>Komisyon</strong></div>\n		<div flex=\"20\"><strong>Toplam</strong></div>\n		<div flex=\"20\"><strong>Taksit Tutarı</strong></div>\n	</div>\n	<div layout=\"row\">\n		<div flex=\"20\">\n			<img data-src=\"holder.js/100%x320/text:Maximum\" alt=\"Maximum Bank\">\n			<small>Maximum Bank</small>\n		</div>\n		<div layout=\"column\" flex=\"80\">\n			<div layout=\"column\" flex>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">6</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(3);\">\n					<div flex=\"25\">9</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n			<div layout=\"column\" flex layout-fill>\n				<span class=\"title\">Ticari Kart Oranlari</span class=\"title\">\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	<div layout=\"row\" class=\"sf-table__section\">\n		<div flex=\"20\">\n			<img data-src=\"holder.js/100%x320/text:Yapi Kredi\" alt=\"Maximum Bank\" hide-sm>\n			<small>Yapi Kredi Bank</small>\n		</div>\n		<div layout=\"column\" flex=\"80\">\n			<div layout=\"column\" flex>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">6</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(3);\">\n					<div flex=\"25\">9</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n			<div layout=\"column\" flex layout-fill>\n				<span class=\"title\">Ticari Kart Oranlari</span class=\"title\">\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n\n\n\n<script type=\"text/ng-template\" id=\"payment.tmpl.html\">\n    <md-dialog aria-label=\"Odeme\">\n        <md-content>\n            <md-subheader class=\"md-sticky-no-effect\">Kredi Kartı Formu</md-subheader>\n            \n            <ul class=\"sf-payment__info\">\n            	<li><span>Banka</span>: Vakifbank</li>\n            	<li><span>Odeme Tutar</span>: 1.391,36</li>\n            	<li><span>Komisyon Tutar</span>: 36,68</li>\n            	<li><span>Çekilecek Toplam Tutar</span>: 36,68</li>\n            	<li><span>Taksit Adet</span>: 2</li>\n            	<li><span>Aylık Taksit Tutar</span>: 713,22</li>\n            </ul>\n\n            <div layout=\"column\">\n            <md-input-container flex=\"100\">\n                  	<label>Kart Sahibinin Adı Soyadı</label>\n                  	<input ng-model=\"creditcart.name\">\n			</md-input-container>\n            <md-input-container flex=\"100\">\n                  	<label>Kart Numarasi</label>\n                  	<input ng-model=\"creditcart.creditcard\">\n			</md-input-container>\n\n			  <div layout=\"row\">\n			  <md-input-container flex=\"80\">\n			        	<label>Son kullanma tarihi</label>\n			        	<input ng-model=\"creditcart.expiration\" type=\"date\">\n			        	</md-input-container>\n			<md-input-container flex=\"20\">\n			      	<label>CCV</label>\n			      	<input ng-model=\"creditcart.ccv\">\n			 </md-input-container>\n			 </div>\n\n\n\n            </div>\n        </md-content>\n        <div class=\"md-actions\" layout=\"row\">\n            <md-button href=\"http://en.wikipedia.org/wiki/Mango\" target=\"_blank\" hide show-md>\n                More on Wikipedia\n            </md-button>\n            <span class=\"title\" flex></span class=\"title\">\n            <md-button ng-click=\"answer(\'Iptal\')\">\n                Iptal\n            </md-button>\n            <md-button ng-click=\"answer(\'Odeme Yap\')\" class=\"md-primary md-raised\">\n                Ödeme Yap\n            </md-button>\n        </div>\n    </md-dialog>\n</script>\n");
$templateCache.put("templates/barem/partials/BAREM-productlist-control.tmpl.html","<div class=\"sf-productlist-control\" layout=\"row\" layout-align=\"center center\" layout-wrap>\n	<div flex=\"10\" flex-sm=\"50\">\n		<md-button class=\"md-primary\" aria-label=\"view list\"><md-icon md-svg-icon=\"action:ic_view_headline_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<md-button class=\"md-primary\" aria-label=\"view detailed list\"><md-icon md-svg-icon=\"action:ic_view_list_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<md-button class=\"md-primary\" aria-label=\"view grid\"><md-icon md-svg-icon=\"action:ic_view_module_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n	</div>\n	<div flex flex-sm=\"50\">\n		<select name=\"sort\" id=\"sort\">\n			<option value=\"\">Sırala</option>\n			<option value=\"\">Urun Kodu</option>\n			<option value=\"\">Stok</option>\n			<option value=\"\">Marka</option>\n			<option value=\"\">Fiyat Azalan</option>\n			<option value=\"\">Fiyat Artan</option>\n			<option value=\"\">Puan</option>\n		</select>\n		<select name=\"itemperpage\" id=\"itemperpage\">\n			<option value=\"\">12 Urun</option>\n			<option value=\"\">24 Urun</option>\n			<option value=\"\">48 Urun</option>\n		</select>\n	</div>\n	<div flex flex-sm=\"50\">\n	</div>\n	<div flex layout layout-align=\"end center\" flex-sm=\"50\">\n		<md-button class=\"md-primary\" ng-show=\"listHasCheckbox\">Karsilastir<md-icon md-svg-icon=\"action:ic_swap_vert_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<md-button class=\"md-primary\">Sepete EKle<md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n	</div>\n	<sf-pagination ng-model=\"ctrl.pages\" layout layout-align=\"end end\" flex flex-sm=\"100\"></sf-pagination>\n</div>");
$templateCache.put("templates/barem/partials/BAREM-promo.tmpl.html","<ul>\n	<li>Super fast delivery!</li>\n	<li>Super nice prices</li>\n	<li>Super awesome customer support</li>\n</ul>");
$templateCache.put("templates/barem/partials/BAREM-sidenav-filter.tmpl.html","<md-sidenav class=\"md-sidenav-left sf-main-sidenav site-sidenav md-sidenav-left\" md-is-locked-open=\"$media(\'gt-md\')\" md-component-id=\"main-sidenav\">\n<md-toolbar class=\"sf-primary\"><span class=\"md-toolbar-tools\"><img data-src=\"holder.js/100%x40/text:{{ctrl.brand}}\" alt=\"Logo\" /></span></md-toolbar>\n	<md-content>\n		<div ng-repeat=\"item in ctrl.filter\">\n			<h5>{{item[0].title}}</h5>\n			<sf-filter ng-model=\"item[1]\">{{item[1].name}}</sf-filter>\n		</div>\n	</md-content>\n</md-sidenav>");
$templateCache.put("templates/barem/partials/BAREM-sidenav-primary.tmpl.html","<md-sidenav class=\"md-sidenav-left sf-main-sidenav site-sidenav md-sidenav-left\" md-is-locked-open=\"$media(\'gt-md\')\" md-component-id=\"main-sidenav\">\n<md-toolbar class=\"sf-primary\"><span class=\"md-toolbar-tools\"><img data-src=\"holder.js/100%x40/text:{{ctrl.brand}}\" alt=\"Logo\" /></span></md-toolbar>\n	<md-content>\n		<div layout=\"column\">\n			<sf-menu ng-model=\"ctrl.menu\"></sf-menu>\n		</div>\n		<div class=\"sf-promo\" layout-padding>\n			<div class=\"sf-promo__item\">\n				<img data-src=\"holder.js/100%x150/text:Kargom Nerede\" alt=\"Logo\" />\n			</div>\n			<div class=\"sf-promo__item\">\n				<img data-src=\"holder.js/100%x150/text:Güvenli İnternet\" alt=\"Logo\" />\n			</div>\n		</div>\n	</md-content>\n</md-sidenav>");
$templateCache.put("templates/barem/partials/BAREM-site-options.tmpl.html","<div class=\"site-options\">\n	<div layout=\"row\">\n		<div class=\"language\" flex-sm=\"50\">\n			<select name=\"language\" id=\"language\">\n				<option value=\"\">TR</option>\n				<option value=\"\">EN</option>\n			</select>\n		</div>\n		<div class=\"currency\" flex-sm=\"50\">\n			<select name=\"currency\" id=\"currency\">\n				<option value=\"\">TL</option>\n				<option value=\"\">$</option>\n			</select>\n		</div>\n	</div>\n</div><!-- /site-options -->");
$templateCache.put("templates/barem/partials/BAREM-social-links.tmpl.html","<div class=\"social-links\"></div>\n	<ul>\n		<li><a href=\"#\">Facebook</a></li>\n		<li><a href=\"#\">Twitter</a></li>\n		<li><a href=\"#\">Pinterest</a></li>\n	</ul>\n</div>");
$templateCache.put("templates/barem/partials/BAREM-social-share.tmpl.html","<ul>\n	<li>like on facebook</li>\n	<li>share on twitter</li>\n	<li>pin on pinterest</li>\n</ul>");
$templateCache.put("templates/barem/partials/BAREM-spot-home.tmpl.html","<div class=\"sf-spot\" layout=\"row\"  layout-padding>\n	<div flex=\"33\" layout-padding layout-align=\"center center\" layout=\"column\" class=\"sf-spot__title\">\n		<h3>TPLINK ACCESS POINT</h3>\n		<p>Outdoor Access Point</p>\n	</div>\n	<div flex=\"66\" class=\"sf-spot__image\"><img data-src=\"holder.js/100%x380/text:BIG IMAGE\" alt=\"\"></div>\n</div><!-- /sf-spot -->");
$templateCache.put("templates/barem/partials/BAREM-toolbar-primary.tmpl.html","<md-toolbar layout-align=\"center\">\n<div class=\"md-toolbar-tools\">\n	<div flex=\"20\" hide-gt-md>\n		<md-button ng-click=\"ctrl.toggleMainSidebar()\" aria-label=\"Toggle Menu\"><md-icon md-svg-icon=\"navigation:ic_menu_24px\" alt=\"Help\"></md-icon></md-button>\n	</div>\n	<div flex><sf-search ng-model=\"this.ctrl.search\"></sf-search></div>\n	<div flex=\"15\" layout=\"row\" layout-align=\"end center\">\n		<md-button aria-label=\"Mini Cart\" ng-click=\"ctrl.toggleMiniCart()\" class=\"md-primary-theme\"><md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Exit\"></md-icon>\n		<span class=\"badge\">2</span>\n		</md-button>\n	</div>\n</div>\n</md-toolbar>");
$templateCache.put("templates/barem/partials/BAREM-toolbar-secondary.tmpl.html","<md-toolbar layout-align=\"center\">\n<div class=\"md-toolbar-tools\">\n	<div flex=\"10\" hide-gt-md>\n		<md-button ng-click=\"ctrl.toggleMainSidebar()\" aria-label=\"Toggle Menu\"><md-icon md-svg-icon=\"navigation:ic_menu_24px\" alt=\"Help\"></md-icon></md-button>\n	</div>\n	<div flex=\"15\" show-gt-md hide>\n		<img data-src=\"holder.js/100%x40/text:{{ctrl.brand}}\" alt=\"Logo\" />\n	</div>\n	<div flex><sf-search ng-model=\"this.ctrl.search\"></sf-search></div>\n	<div flex=\"15\" layout=\"row\" layout-align=\"end center\">\n		<md-button aria-label=\"Mini Cart\" ng-click=\"ctrl.toggleMiniCart()\" class=\"md-primary-theme\"><md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Exit\"></md-icon>\n		<span class=\"badge\">2</span>\n		</md-button>\n	</div>\n</div>\n</md-toolbar>");
$templateCache.put("templates/barem/partials/BAREM-topbar.tmpl.html","<div class=\"sf-topbar sf-user-info\" layout=\"row\" layout-align=\"start center\">\n	<div class=\"sf-user-info__name\" flex=\"20\" layout-padding hide-sm><small>Hello, {{ctrl.user.name}}</small></div>\n	<div class=\"sf-user-info__user-nav\" layout-align-gt-sm=\"end center\" flex layout=\"row\">\n		<span><md-button class=\"md-primary\" aria-label=\"Help\"><md-icon md-svg-icon=\"action:ic_help_24px\" alt=\"Exit\"></md-icon></md-button><md-tooltip>\n          Help\n        </md-tooltip></span>\n        <span><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_visibility_24px\" alt=\"Exit\" aria-label=\"Exit\"></md-icon><md-icon md-svg-icon=\"action:ic_visibility_off_24px\" alt=\"Exit\" aria-label=\"Exit\"></md-icon></md-button>\n		<md-tooltip>\n          Fiyat Cinsi\n        </md-tooltip>\n		</span>\n		<span><md-button ng-click=\"ctrl.toggleUserPanel()\" class=\"md-primary\" aria-label=\"User Panel\"><md-icon md-svg-icon=\"action:ic_account_box_24px\" alt=\"Exit\" aria-label=\"UserPanel\"></md-icon></md-button>\n		<md-tooltip>\n          User\n        </md-tooltip>\n		</span>\n		<span><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_exit_to_app_24px\" alt=\"Exit\" aria-label=\"Exit\"></md-icon></md-button>\n		<md-tooltip>\n          Exit\n        </md-tooltip>\n		</span>\n	</div>\n</div>");
$templateCache.put("templates/barem/partials/BAREM-usermenu-sidenav.tmpl.html","<div class=\"sf-sidenav__user\">\n<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"user-panel\">\n    <md-toolbar class=\"md-theme-light\">\n        <h2 class=\"md-toolbar-tools\">User Panel\n		<md-button ng-click=\"ctrl.closeUserPanel()\" alt=\"Close\" aria-label=\"Close\"><md-icon md-svg-icon=\"navigation:ic_close_24px\"></md-icon></md-button>\n        </h2>\n    </md-toolbar>\n    <md-content class=\"md-padding\">\n    <sf-user-info ng-model=\"ctrl.user\"></sf-user-info>\n	    <md-list>\n	      <md-item ng-repeat=\"item in ctrl.user.menu\">\n	        <md-item-content>\n	          <div class=\"md-tile-left\">\n	          	<md-button>\n	              <md-icon md-svg-icon=\"{{item.icon}}\" alt=\"Exit\" aria-label=\"{{item.title}}\"></md-icon>\n	              {{item.title}}\n	              </md-button>\n	          </div>\n	        </md-item-content>\n	      </md-item>\n	    </md-list>\n    </md-content>\n</md-sidenav>\n</div><!-- /sf-sidenav-user -->");
$templateCache.put("templates/po/partials/PO-banner.tmpl.html","<div class=\"sf-banner\">\n	<img data-src=\"holder.js/100%x60/text:Main banner\" alt=\"Banner\">\n</div>");
$templateCache.put("templates/po/partials/PO-footer.tmpl.html","<footer layout=\"column\" layout-padding class=\"sf-footer\">\n	<div layout=\"row\">\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">Printonline</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Form ve Broşürler</a></li>\n				<li><a href=\"#\">Başvuru Formları</a></li>\n			</ul>\n		</div>\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">HESABIM</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Hesap Ayarları</a></li>\n				<li><a href=\"#\">Sepetlerim</a></li>\n				<li><a href=\"#\">Kayıtlı Sepetlerim/a></li>\n				<li><a href=\"#\">Stok Yonetimi</a></li>\n				<li><a href=\"#\">Kullanıcılar</a></li>\n			</ul>\n		</div>\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">KAMPANYALAR</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">E-posta Listesi</a></li>\n			</ul>\n		</div>\n		<div class=\"sf-footer__col\" flex>\n			<span class=\"sf-footer__menu-title\">DESTEK</span>\n			<ul class=\"sf-footer__menu\">\n				<li><a href=\"#\">Müşteri Hizmetleri</a></li>\n				<li><a href=\"#\">Print</a></li>\n				<li><a href=\"#\">SSS</a></li>\n				<li><a href=\"#\">İletişim</a></li>\n			</ul>\n		</div>\n	</div>\n	<div class=\"sf-tertiary\">\n		<small>© 2015 Printionline</small>\n	</div>\n</footer>");
$templateCache.put("templates/po/partials/PO-header.tmpl.html","<body ng-controller=\"TemplatesCtrl as ctrl\" layout=\"column\" md-theme=\"altTheme\" md-theme-watch>\n    <div ng-include=\"\'templates/BAREM/partials/BAREM-topbar.tmpl.html\'\" ng-include-replace></div>\n    <div class=\"sf-wrapper\" layout=\"row\">");
$templateCache.put("templates/po/partials/PO-hover.tmpl.html","<md-dialog aria-label=\"Product Name\">\n<md-content class=\"sf-product__hover\">\n<md-subheader class=\"md-sticky-no-effect\">A6 Standart Kartvizit</md-subheader>\n		<div layout=\"row\" layout-sm=\"column\" class=\"sf-product-detail\" itemscope itemtype=\"http://schema.org/Product\" layout-padding>\n			<div layout-padding layout=\"column\" flex=\"40\">\n				<div class=\"sf-product__image\">\n					<h6>{{ctrl.products[0].name}}</h6>\n					<img src=\"http://placehold.it/280x280\" alt=\"image\">\n					<md-button class=\"md-fab md-primary\">\n					<md-icon md-svg-icon=\"action:ic_visibility_24px\" alt=\"Icon Alt\"></md-icon>\n					<md-tooltip md-direction=\"left\">Provayı Görüntüle</md-tooltip>\n					</md-button>\n				</div>\n				<div layout=\"row\">\n					<md-input-container flex>\n					<label for=\"po\">PO No:</label>\n					<input type=\"text\" name=\"po\">\n					</md-input-container flex>\n					<md-input-container>\n					<label for=\"po\">Baskı Adet:</label>\n					<input type=\"text\" name=\"po\">\n					</md-input-container>\n				</div>\n			</div><!-- /sf-main-feature -->\n			<div layout-padding layout=\"column\" flex=\"60\">\n				<div class=\"sf-product__details\">\n					<h5>Özellikler</h5>\n					<ul>\n						<li><strong>Tür</strong>: Poster</li>\n						<li><strong>Ölçüler</strong>: Poster</li>\n						<li><strong>Tanım:</strong> Standart A6 Kartvızıt</li>\n						<li><strong>Teslim Süresi:</strong> 3 Gün</li>\n					</ul>\n					<h5>Fiyatlandırma</h5>\n					<ul>\n						<li><strong>1-50:</strong> 0,50TL / Adet</li>\n						<li><strong>50-250:</strong> 0,40TL / Adet</li>\n						<li><strong>250-550:</strong> 0,30TL / Adet</li>\n						<li><strong>500-1000:</strong> 0,20TL / Adet</li>\n					</ul>\n					<div>\n						<small>Not:Bu ürünü acil olarak sipariş verebilirsiniz. Acil olarak verilen siparişler ek ücrete tabidir. Aşağıdaki kutuyu işaretlemeniz durumunda siparişiniz aynı gün içerisinde gönderilir.</small>\n						<md-checkbox>Bu ürün acil </md-checkbox>\n						<md-tooltip md-direction=\"left\">Aynı gün içerisinde almak için tıkla</md-tooltip>\n					</div>\n				</div>\n			</div><!-- /info -->\n		</div><!-- /sf-detail -->\n		<div layout=\"row\" layout-sm=\"column\" layout-md=\"column\">\n			<div class=\"sf-product__price\" itemprop=\"offers\" flex=\"33\" flex-sm=\"100\">\n				<span><strong>Toplam fiyat: 25</strong> <small itemprop=\"priceCurrency\">TL</small> </span>\n				<link itemprop=\"availability\" href=\"http://schema.org/InStock\">\n				<meta itemprop=\"priceCurrency\" content=\"{{$root.global.currency.current}}\">\n			</div>\n			<div class=\"sf-product__action\" flex=\"66\" flex-sm=\"100\">\n				<md-button class=\"md-raised md-primary\">SEPETE EKLE <md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n			</div>\n		</div>\n	</md-content>\n</md-dialog>");
$templateCache.put("templates/po/partials/PO-minicart-sidenav.tmpl.html","<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"mini-cart\">\n    <md-toolbar>\n        <h2 class=\"md-toolbar-tools\">Mini Cart\n			<md-button ng-click=\"ctrl.closeMiniCart()\" aria-label=\"Close\"><md-icon md-svg-icon=\"navigation:ic_close_24px\" alt=\"Close\"></md-icon></md-button>\n        </h2>\n    </md-toolbar>\n    <md-content class=\"md-padding\">\n    	<sf-cart ng-model=\"ctrl.order\" columns=\"ctrl.columns\" show-header=\"true\" show-delete-button=\"true\" show-standby-button=\"true\" show-totals=\"true\"></sf-cart>\n    	<md-button class=\"md-raised md-primary\">SEPETE GIT</md-button>\n    </md-content>\n</md-sidenav>");
$templateCache.put("templates/po/partials/PO-payment.tmpl.html","<div layout=\"row\" layout-align=\"space-between\" layout-padding>	\n	<div layout=\"column\" flex=\"60\">\n		<div>\n			<h3>1) Ödeme Tutarı Girin</h3>\n			<md-input-container>\n			<label for=\"amount\">Tutar</label>\n			<input type=\"text\" name=\"amount\" id=\"amount\">\n			</md-input-container>\n		</div>\n		<div>\n		<h3>2) Ödeme Metodu Seçin</h3>\n		<ul class=\"inline\">\n			<li><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Icon Alt\"></md-icon> Normal</md-button></li>\n				<li><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_3d_rotation_24px\" alt=\"Icon Alt\"></md-icon> 3d Secure</md-button></li>\n				<li><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_loyalty_24px\" alt=\"Icon Alt\"></md-icon> Puan</md-button></li>\n		</ul>\n		</div>\n	</div>\n	<div>\n		<h5>Kredi Kartı Kampanyalarımız</h5>\n		<ul class=\"sf-payment__info\">\n			<li><span>Halkbank</span>2 taksit 0 komisyon</li>\n			<li><span>BankAsya</span>3 taksit 0 komisyon</li>\n			<li><span>Maximum</span>3 taksit 0 komisyon</li>\n			<li><span>Vakifbank</span>2 taksit icin +3, 3 taksit icin +6 ek taksit</li>\n		</ul>\n	</div>\n</div>\n\n<div layout=\"column\" class=\"sf-table\" layout-padding>\n	<h3>3) Banka ve Taksit Seçin</h3>\n	<div layout=\"row\" class=\"sf-table__header\">\n		<div flex=\"20\">Banka</div>\n		<div flex=\"20\"><strong>Taksit Türü</strong></div>\n		<div flex=\"20\"><strong>Komisyon</strong></div>\n		<div flex=\"20\"><strong>Toplam</strong></div>\n		<div flex=\"20\"><strong>Taksit Tutarı</strong></div>\n	</div>\n	<div layout=\"row\">\n		<div flex=\"20\">\n			<img data-src=\"holder.js/100%x320/text:Maximum\" alt=\"Maximum Bank\">\n			<small>Maximum Bank</small>\n		</div>\n		<div layout=\"column\" flex=\"80\">\n			<div layout=\"column\" flex>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">6</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(3);\">\n					<div flex=\"25\">9</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n			<div layout=\"column\" flex layout-fill>\n				<span class=\"title\">Ticari Kart Oranlari</span class=\"title\">\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	<div layout=\"row\" class=\"sf-table__section\">\n		<div flex=\"20\">\n			<img data-src=\"holder.js/100%x320/text:Yapi Kredi\" alt=\"Maximum Bank\" hide-sm>\n			<small>Yapi Kredi Bank</small>\n		</div>\n		<div layout=\"column\" flex=\"80\">\n			<div layout=\"column\" flex>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">6</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(3);\">\n					<div flex=\"25\">9</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n			<div layout=\"column\" flex layout-fill>\n				<span class=\"title\">Ticari Kart Oranlari</span class=\"title\">\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">Tek Cekim</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(1);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n				<div layout=\"row\" class=\"sf-table__row \" ng-click=\"ctrl.makePayment(2);\">\n					<div flex=\"25\">3</div>\n					<div flex=\"25\">%2</div>\n					<div flex=\"25\">1650,00 TL</div>\n					<div flex=\"25\">165,00 TL</div>\n					<div class=\"sf-pay-action\">Seç ve ödeme yap</div>\n				</div>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n\n\n\n<script type=\"text/ng-template\" id=\"payment.tmpl.html\">\n    <md-dialog aria-label=\"Odeme\">\n        <md-content>\n            <md-subheader class=\"md-sticky-no-effect\">Kredi Kartı Formu</md-subheader>\n            \n            <ul class=\"sf-payment__info\">\n            	<li><span>Banka</span>: Vakifbank</li>\n            	<li><span>Odeme Tutar</span>: 1.391,36</li>\n            	<li><span>Komisyon Tutar</span>: 36,68</li>\n            	<li><span>Çekilecek Toplam Tutar</span>: 36,68</li>\n            	<li><span>Taksit Adet</span>: 2</li>\n            	<li><span>Aylık Taksit Tutar</span>: 713,22</li>\n            </ul>\n\n            <div layout=\"column\">\n            <md-input-container flex=\"100\">\n                  	<label>Kart Sahibinin Adı Soyadı</label>\n                  	<input ng-model=\"creditcart.name\">\n			</md-input-container>\n            <md-input-container flex=\"100\">\n                  	<label>Kart Numarasi</label>\n                  	<input ng-model=\"creditcart.creditcard\">\n			</md-input-container>\n\n			  <div layout=\"row\">\n			  <md-input-container flex=\"80\">\n			        	<label>Son kullanma tarihi</label>\n			        	<input ng-model=\"creditcart.expiration\" type=\"date\">\n			        	</md-input-container>\n			<md-input-container flex=\"20\">\n			      	<label>CCV</label>\n			      	<input ng-model=\"creditcart.ccv\">\n			 </md-input-container>\n			 </div>\n\n\n\n            </div>\n        </md-content>\n        <div class=\"md-actions\" layout=\"row\">\n            <md-button href=\"http://en.wikipedia.org/wiki/Mango\" target=\"_blank\" hide show-md>\n                More on Wikipedia\n            </md-button>\n            <span class=\"title\" flex></span class=\"title\">\n            <md-button ng-click=\"answer(\'Iptal\')\">\n                Iptal\n            </md-button>\n            <md-button ng-click=\"answer(\'Odeme Yap\')\" class=\"md-primary md-raised\">\n                Ödeme Yap\n            </md-button>\n        </div>\n    </md-dialog>\n</script>\n");
$templateCache.put("templates/po/partials/PO-productlist-control.tmpl.html","<div class=\"sf-productlist-control\" layout=\"row\" layout-align=\"center center\" layout-wrap layout-sm=\"column\">\n	<div flex=\"15\" flex-sm=\"50\">\n		<md-button class=\"md-primary\" aria-label=\"view list\"><md-icon md-svg-icon=\"action:ic_view_headline_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<md-button class=\"md-primary\" aria-label=\"view detailed list\"><md-icon md-svg-icon=\"action:ic_view_list_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<md-button class=\"md-primary\" aria-label=\"view grid\"><md-icon md-svg-icon=\"action:ic_view_module_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n	</div>\n	<div flex flex-sm=\"35\">\n		<select name=\"sort\" id=\"sort\">\n			<option value=\"\">Sırala</option>\n			<option value=\"\">Urun Kodu</option>\n			<option value=\"\">Stok</option>\n			<option value=\"\">Marka</option>\n			<option value=\"\">Fiyat Azalan</option>\n			<option value=\"\">Fiyat Artan</option>\n			<option value=\"\">Puan</option>\n		</select>\n		<select name=\"itemperpage\" id=\"itemperpage\">\n			<option value=\"\">12 Urun</option>\n			<option value=\"\">24 Urun</option>\n			<option value=\"\">48 Urun</option>\n		</select>\n	</div>\n	<div flex>\n		<md-button class=\"md-primary\" ng-show=\"listHasCheckbox\">Karsilastir<md-icon md-svg-icon=\"action:ic_swap_vert_24px\" alt=\"Icon Alt\"></md-icon></md-button>\n		<div flex=\"20\"><md-input-container><label for=\"\">Listeyi Filtrele</label><input type=\"text\"></md-input-container></div>\n	</div>\n	<sf-pagination ng-model=\"ctrl.pages\" layout layout-align=\"end end\" flex flex-sm=\"100\"></sf-pagination>\n</div>");
$templateCache.put("templates/po/partials/PO-promo.tmpl.html","<ul>\n	<li>Super fast delivery!</li>\n	<li>Super nice prices</li>\n	<li>Super awesome customer support</li>\n</ul>");
$templateCache.put("templates/po/partials/PO-sidenav-filter.tmpl.html","<md-sidenav class=\"md-sidenav-left sf-main-sidenav site-sidenav md-sidenav-left\" md-is-locked-open=\"$media(\'gt-md\')\" md-component-id=\"main-sidenav\">\n<md-toolbar class=\"sf-primary\"><span class=\"md-toolbar-tools\"><img data-src=\"holder.js/100%x40/text:{{ctrl.brand}}\" alt=\"Logo\" /></span></md-toolbar>\n	<md-content>\n		<div ng-repeat=\"item in ctrl.filter\">\n			<h5>{{item[0].title}}</h5>\n			<sf-filter ng-model=\"item[1]\">{{item[1].name}}</sf-filter>\n		</div>\n	</md-content>\n</md-sidenav>");
$templateCache.put("templates/po/partials/PO-sidenav-primary.tmpl.html","<md-sidenav class=\"md-sidenav-left sf-main-sidenav site-sidenav md-sidenav-left\" md-is-locked-open=\"$media(\'gt-md\')\" md-component-id=\"main-sidenav\">\n<md-toolbar class=\"sf-primary\"><span class=\"md-toolbar-tools\"><img data-src=\"holder.js/100%x40/text:{{ctrl.brand}}\" alt=\"Logo\" /></span></md-toolbar>\n	<md-content>\n		<div layout=\"column\">\n			<sf-menu ng-model=\"ctrl.menu\"></sf-menu>\n		</div>\n		<div class=\"sf-promo\" layout-padding>\n			<div class=\"sf-promo__item\">\n				<img data-src=\"holder.js/100%x60/text:Printonline Yardım\" alt=\"Logo\" />\n			</div>\n			<div class=\"sf-promo__item\">\n				<img data-src=\"holder.js/100%x60/text:Printonline Yeni Urunler\" alt=\"Logo\" />\n			</div>\n			<div class=\"sf-promo__item\">\n				<img data-src=\"holder.js/100%x60/text:Printonline Destek\" alt=\"Logo\" />\n			</div>\n		</div>\n	</md-content>\n</md-sidenav>");
$templateCache.put("templates/po/partials/PO-site-options.tmpl.html","<div class=\"site-options\">\n	<div layout=\"row\">\n		<div class=\"language\" flex-sm=\"50\">\n			<select name=\"language\" id=\"language\">\n				<option value=\"\">TR</option>\n				<option value=\"\">EN</option>\n			</select>\n		</div>\n		<div class=\"currency\" flex-sm=\"50\">\n			<select name=\"currency\" id=\"currency\">\n				<option value=\"\">TL</option>\n				<option value=\"\">$</option>\n			</select>\n		</div>\n	</div>\n</div><!-- /site-options -->");
$templateCache.put("templates/po/partials/PO-social-links.tmpl.html","<div class=\"social-links\"></div>\n	<ul>\n		<li><a href=\"#\">Facebook</a></li>\n		<li><a href=\"#\">Twitter</a></li>\n		<li><a href=\"#\">Pinterest</a></li>\n	</ul>\n</div>");
$templateCache.put("templates/po/partials/PO-social-share.tmpl.html","<ul>\n	<li>like on facebook</li>\n	<li>share on twitter</li>\n	<li>pin on pinterest</li>\n</ul>");
$templateCache.put("templates/po/partials/PO-spot-home.tmpl.html","<div class=\"sf-spot\" layout=\"row\" layout-fill>\n	<div flex=\"33\" layout-padding layout-align=\"center center\" layout=\"column\" class=\"sf-spot__title\">\n		<h3>Yeni Urun!</h3>\n		<p>Hologram Kartvizit</p>\n	</div>\n	<div flex=\"66\" class=\"sf-spot__image\">\n		<img data-src=\"holder.js/100%x480/text:PROD IMAGE\" alt=\"BIG\">\n	</div>\n</div><!-- /sf-spot -->");
$templateCache.put("templates/po/partials/PO-toolbar-primary.tmpl.html","<md-toolbar layout-align=\"center\">\n<div class=\"md-toolbar-tools\">\n	<div flex=\"20\" hide-gt-md>\n		<md-button ng-click=\"ctrl.toggleMainSidebar()\" aria-label=\"Toggle Menu\"><md-icon md-svg-icon=\"navigation:ic_menu_24px\" alt=\"Help\"></md-icon></md-button>\n	</div>\n	<div flex><sf-search ng-model=\"this.ctrl.search\"></sf-search></div>\n	<div flex=\"15\" layout=\"row\" layout-align=\"end center\">\n		<md-button aria-label=\"Mini Cart\" ng-click=\"ctrl.toggleMiniCart()\" class=\"md-primary-theme\"><md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Exit\"></md-icon>\n		<span class=\"badge\">2</span>\n		</md-button>\n	</div>\n</div>\n</md-toolbar>");
$templateCache.put("templates/po/partials/PO-toolbar-secondary.tmpl.html","<md-toolbar layout-align=\"center\">\n<div class=\"md-toolbar-tools\">\n	<div flex=\"10\" hide-gt-md>\n		<md-button ng-click=\"ctrl.toggleMainSidebar()\" aria-label=\"Toggle Menu\"><md-icon md-svg-icon=\"navigation:ic_menu_24px\" alt=\"Help\"></md-icon></md-button>\n	</div>\n	<div flex=\"15\" show-gt-md hide>\n		<img data-src=\"holder.js/100%x40/text:{{ctrl.brand}}\" alt=\"Logo\" />\n	</div>\n	<div flex><sf-search ng-model=\"this.ctrl.search\"></sf-search></div>\n	<div flex=\"15\" layout=\"row\" layout-align=\"end center\">\n		<md-button aria-label=\"Mini Cart\" ng-click=\"ctrl.toggleMiniCart()\" class=\"md-primary-theme\"><md-icon md-svg-icon=\"action:ic_shopping_cart_24px\" alt=\"Exit\"></md-icon>\n		<span class=\"badge\">2</span>\n		</md-button>\n	</div>\n</div>\n</md-toolbar>");
$templateCache.put("templates/po/partials/PO-topbar.tmpl.html","<div class=\"sf-topbar sf-user-info\" layout=\"row\" layout-align=\"start center\">\n	<div class=\"sf-user-info__name\" flex=\"20\" layout-padding hide-sm><small>Merhaba, {{ctrl.user.name}}</small></div>\n	<div class=\"sf-user-info__user-nav\" layout-align-gt-sm=\"end center\" flex layout=\"row\">\n		<span><md-button class=\"md-primary\" aria-label=\"Help\"><md-icon md-svg-icon=\"action:ic_help_24px\" alt=\"Exit\"></md-icon></md-button><md-tooltip>\n          Help\n        </md-tooltip></span>\n		<span><md-button ng-click=\"ctrl.toggleUserPanel()\" class=\"md-primary\" aria-label=\"User Panel\"><md-icon md-svg-icon=\"action:ic_account_box_24px\" alt=\"Exit\" aria-label=\"UserPanel\"></md-icon></md-button>\n		<md-tooltip>\n          User\n        </md-tooltip>\n		</span>\n		<span><md-button class=\"md-primary\"><md-icon md-svg-icon=\"action:ic_exit_to_app_24px\" alt=\"Exit\" aria-label=\"Exit\"></md-icon></md-button>\n		<md-tooltip>\n          Exit\n        </md-tooltip>\n		</span>\n	</div>\n</div>");
$templateCache.put("templates/po/partials/PO-usermenu-sidenav.tmpl.html","<div class=\"sf-sidenav__user\">\n<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"user-panel\">\n    <md-toolbar class=\"md-theme-light\">\n        <h2 class=\"md-toolbar-tools\">User Panel\n		<md-button ng-click=\"ctrl.closeUserPanel()\" alt=\"Close\" aria-label=\"Close\"><md-icon md-svg-icon=\"navigation:ic_close_24px\"></md-icon></md-button>\n        </h2>\n    </md-toolbar>\n    <md-content class=\"md-padding\">\n    <sf-user-info ng-model=\"ctrl.user\"></sf-user-info>\n	    <md-list>\n	      <md-item ng-repeat=\"item in ctrl.user.menu\">\n	        <md-item-content>\n	          <div class=\"md-tile-left\">\n	          	<md-button>\n	              <md-icon md-svg-icon=\"{{item.icon}}\" alt=\"Exit\" aria-label=\"{{item.title}}\"></md-icon>\n	              {{item.title}}\n	              </md-button>\n	          </div>\n	        </md-item-content>\n	      </md-item>\n	    </md-list>\n    </md-content>\n</md-sidenav>\n</div><!-- /sf-sidenav-user -->");}]);