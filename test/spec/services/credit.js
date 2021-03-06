'use strict';

describe('Service: Credit', function () {
	var $httpBackend;

	// load module
	beforeEach(function(){
		module('adminPanelApp', 'templates', 'mockedResponses');
		inject(function(_$httpBackend_, _ROUTES_){
			$httpBackend = _$httpBackend_;
			ROUTES = _ROUTES_;
			$httpBackend.expectGET(_ROUTES_.USER).respond(200);
			$httpBackend.whenGET(_ROUTES_.SESSION).respond(200);
		});
	});

	var Credit, Format, CreditData, ROUTES;

	// Load the service to test
	beforeEach(inject(function(_Credit_, _Format_, _CreditData_){
		Credit = _Credit_;
		CreditData = _CreditData_;
		Format = _Format_;
	}));

	it('Service should be injected.', function () {
		expect(Credit).toBeDefined();
	});

	it('Should retrieve user credit', function(){
		var userID = 1;

		var credit;

		$httpBackend.expectGET(ROUTES.ADMIN_SERVICES + '/' + userID + ROUTES.CREDIT).respond(200, CreditData);

		Credit.get(userID).then(function(data){
			credit = data;
		});

		expect(credit).toBeUndefined();

		$httpBackend.flush();

		expect(credit).toEqual(Format.credit(CreditData));

	});

	it('Should add user credit', function(){
		var userID = 1;

		var credit;

		$httpBackend.expectPOST(ROUTES.ADMIN_SERVICES + '/' + userID + ROUTES.CREDIT, {
			amount: 1,
			reason: 'vip',
			currency: 'GBP'
		}).respond(200, CreditData.items[0]);

		Credit.add(userID, {
			amount: 1,
			reason: 'vip'
		}).then(function(data){
			credit = data;
		});

		expect(credit).toBeUndefined();

		$httpBackend.flush();

		expect(credit).toEqual(Format.credit(CreditData));

	});

});
