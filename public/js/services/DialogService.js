angular.module('Acompanho').factory('DialogService', function($modal) {
	return {
		showConfirmDialog: function(message, onOK) {
			this.confirmMessage = message;
			var modalInstance = $modal.open({
				templateUrl: 'partials/confirm_dialog.html',
				controller: 'ConfirmDialogController',
				animation: true
			});

			modalInstance.result.then(onOK);
		}
	};
});