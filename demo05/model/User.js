/**
 * Created by Administrator on 2016/4/6.
 */
Ext.define('MyApp.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name',  type: 'string'},
        {name: 'age',   type: 'int'}
    ]
});