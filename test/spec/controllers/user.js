'use strict';

describe('Controller: UserCtrl', function () {

	// load module
	beforeEach(function(){
		module('adminPanelApp', 'templates', 'mockedResponses');
		inject(function(_$httpBackend_, _ROUTES_, _AdminUsers_, _PurchaseHistoryData_, _BookData_, _Format_, _CreditData_){
			$httpBackend = _$httpBackend_;
			ROUTES = _ROUTES_;
			AdminUsers = _AdminUsers_;
			PurchaseHistoryData = _PurchaseHistoryData_;
			BookData = _BookData_;
			Format = _Format_;
			CreditData = _CreditData_;
			$httpBackend.expectGET(ROUTES.USER).respond(401);
		});
	});

	var $httpBackend, ROUTES, BookData, UserCtrl, CreditData, Format, scope, userID = 1, AdminUsers, PurchaseHistoryData;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		UserCtrl = $controller('UserCtrl', {
			$scope: scope,
			$routeParams: {
				id: userID
			}
		});
	}));

	it('should save user information', function(){
		var response = $.extend({}, AdminUsers.items[0]);

		$httpBackend.expectGET(ROUTES.ADMIN_USERS + '/' + userID).respond(200, response);
		$httpBackend.expectGET(ROUTES.ADMIN_SERVICES + '/' + userID + ROUTES.PURCHASE_HISTORY).respond(200, PurchaseHistoryData);
		$httpBackend.expectGET(ROUTES.ADMIN_SERVICES + '/' + userID + ROUTES.CREDIT).respond(200, CreditData);
		$httpBackend.expectGET(ROUTES.BOOK + '?id=' + PurchaseHistoryData.purchases.map(function(d){return d.isbn;}).join('&id=')).respond(200, BookData.single);

		expect(scope.user.id).toBe(-1);

		$httpBackend.flush();

		expect(scope.user.id).not.toBe(-1);
		expect(scope.user).toEqual(Format.user(response, CreditData));

		// expect purchase history to be retrieved
		expect(scope.config.transactions.data.length).toBe(PurchaseHistoryData.purchases.length);
		$.each(scope.config.transactions.data, function(index, purchase){
			expect(purchase).toEqual(Format.purchase(PurchaseHistoryData.purchases[index], BookData.single.items[index]));
		});

		// expect previous email to be saved
		expect(scope.config.email.data.length).toBe(response.user_previous_usernames.length);
		expect(scope.config.email.data).toEqual(Format.user(response, CreditData).previous_emails);
	});

});