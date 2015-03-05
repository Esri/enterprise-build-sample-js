/*global define,console,unescape,escape*/

define([
      "dijit/Dialog"
], function (Dialog) {
	return {
		//	summary:
		//		Utility function class.
		//	_errorDialog:	dijit.Dialog
		//		Dialog used to display errors.
		_errorDialog: null,
		displayError: function(/*String*/error){
			//	summary:
			//		Display errors in a dialog on the map.
			//	error:	String
			//		Error to be displayed
			
			if (!this._errorDialog){
				this._errorDialog = new Dialog({"title":"Error"});
			}
			console.error(error);
			
			//	Note: The strange escape calls below are due to behavior where the input was invalid
			//			and creating "undefined" errors.
			this._errorDialog.set("content",unescape(escape(error)));
			this._errorDialog.show();
		}
	};
});
