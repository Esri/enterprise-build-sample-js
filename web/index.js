require([
   "dojo/_base/kernel",
   "./js/buildProject/SiteManager"
], function (kernel, SiteManager) {
   kernel.global.site = new SiteManager();
   kernel.global.site.init();
});