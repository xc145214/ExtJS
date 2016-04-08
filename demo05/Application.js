/**
 * 定义类
 *
 */

Ext.define('MyApp.Application', {
    extend: 'Ext.app.Application',

    name: 'MyApp',

    stores: [
        'User'
    ],

    launch: function () {
        // TODO - Launch the application
    }
});