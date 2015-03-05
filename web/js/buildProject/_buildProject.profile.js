var profile = (function () {
	return {
		resourceTags : {
			amd : function (filename, mid) {
				//	summary:
				//		Used by the dojo build process to determine if a file is AMD
				//	filename : String
				//		The name of the file being processed
				//	mid: String
				//		The Module ID of the file being processed

				// All our files are AMD, so we just check to see if it ends in "js"

				return /\.js$/.test(filename);
			}
		}
	};
})();