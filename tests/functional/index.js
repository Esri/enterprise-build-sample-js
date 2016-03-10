define([
    'intern!object',
    'intern/chai!assert',
    'require'
], function(registerSuite, assert, require) {
    registerSuite({
        name: 'index',
        'build sample app': function() {


            return this.remote
                .get('http://localhost/enterprise-build-sample-js/web')
                .setFindTimeout(10000)
                .findByXpath('//div[@id="toolbar"]//span[text()="Show Transportation"]')
                .click()
                .end()
                .findById('map_streetMap')
                .execute("return site.map.getLayer('streetMap').url")
                .then(function(url) {
                    assert.strictEqual(url, 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer', 'Site loaded and street map was created on button click');
                });
        }
    });
});