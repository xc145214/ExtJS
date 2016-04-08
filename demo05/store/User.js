/**
 * Created by Administrator on 2016/4/6.
 */
Ext.define('MyApp.store.User', {
    extend: 'Ext.data.Store',
    model: 'MyApp.model.User',
    data : [
        {firstName: 'Seth',    age: '34'},
        {firstName: 'Scott', age: '72'},
        {firstName: 'Gary', age: '19'},
        {firstName: 'Capybara', age: '208'}
    ]
});