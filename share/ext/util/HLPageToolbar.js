/**
 * Created by chengjie on 2016/01/15. 分页控件
 *
 * 该控件主要是用于前台页面缓存数据再分页。每次载入5页数据，然后在这5页的数据里面进行分页查询；
 *
 */

Ext.define('app.view.widget.hongling.HLPagingToolbar', {
    extend : 'Ext.toolbar.Toolbar',
    alias : 'widget.hlpagingtoolbar',
    displayInfo : true,
    prependButtons : true,
    dock : 'bottom',
    localData : '',
    total : '',
    url : '',
    partKey:'',
    currentPage : 1,
    pageSize : 15,
    params : '',
    pageCount : 1,
    constructor : function(config) {

        this.url = config.url;

        this.params = config.params;

        this.callParent(arguments);
    },
    // 这里构造pageToolbar的界面
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'button',
            text : '上一页',
            mangin : '0 10 0 10',
            disabled:true,
            handler : function() {

                var items = Ext.ComponentQuery.query('button', me);

                var b = me.currentPage - 1;

                me.pageCount = me.total / me.pageSize;

                me.pageCount = Math.floor(me.pageCount);

                if (me.total % me.pageSize != 0) {
                    me.pageCount++;
                }

                if (b % 5 == 0) {

                    var p = {};

                    // 构造查询时所带的参数
                    for (var i = 0; i < me.params.length; i++) {

                        var temp = me.params[i];
                        var comp=Ext.getCmp(temp);
                        if(comp!=null&&comp!='undefined')
                        p[temp] = comp.getValue();
                    }

                    p.start = (b - 5) * me.pageSize;

                    // 每次加载5页数据
                    p.limit = me.pageSize * 5;

                    //获取分库键
                    if(me.partKey!=null&&me.partKey!='undefined'&&me.partKey!='')
                    p[me.partKey]=me.localData[0].get(me.partKey);

                    try {
                        Ext.Msg.wait('处理中，请稍后...', '提示'); // 进度条等待

                        Ext.Ajax.request({
                            url : me.url,
                            method : 'POST',
                            params : p,
                            success : function(response, options) {

                                var data = Ext.decode(response.responseText);

                                if (data.rows == null|| data.rows == 'undefined'|| data.rows.length == 0) {
                                    Ext.Msg.hide();
                                    return;
                                }

                                me.localData = data.rows;

                                me.store.removeAll();

                                var end = me.localData.length;

                                var start = end - me.pageSize;

                                me.store.loadRawData(me.localData.slice(start, end));

                                me.total = data.total;

                                me.pageCount = me.total / me.pageSize;

                                if (me.total % me.pageSize != 0) {
                                    me.pageCount++;
                                }
                                me.pageCount = Math.floor(me.pageCount);

                                Ext.Msg.hide();
                            },
                            failure : function(response, options) {
                                Ext.Msg.hide();
                                Ext.MessageBox.alert('提示','请求超时或网络故障,错误信息：'+ response.message);
                            }
                        });
                    } catch (e) {
                        Ext.Msg.hide();
                    }
                } else {
                    if (b > 0) {
                        var size = me.pageSize;
                        var start = ((b - 1) % 5) * size;
                        var end = (b % 5) * size;
                        me.store.removeAll();
                        me.store.loadRawData(me.localData.slice(start, end));
                    }
                }

                me.currentPage = b;

                // 总共大于1一页，当前第一页
                if (me.currentPage == 1 && me.pageCount > 1) {
                    items[0].setDisabled(true);
                    items[1].setDisabled(false);
                }

                // 在最后一页
                if (me.currentPage > 1 && me.pageCount == me.currentPage) {
                    items[0].setDisabled(true);
                    items[1].setDisabled(false);
                }

                // 总共一页，当前第一页
                if (me.currentPage == 1 && me.pageCount == 1) {
                    items[0].setDisabled(true);
                    items[1].setDisabled(true);
                }

                // 总共大于一页，当前小于总页数
                if (me.currentPage > 1 && me.pageCount > me.currentPage) {
                    items[0].setDisabled(false);
                    items[1].setDisabled(false);
                }

                var hlPageNum=Ext.ComponentQuery.query('numberfield', me)[0];

                var hlTotalPageNum=Ext.ComponentQuery.query('displayfield', me)[2];

                var hlPageMsg= Ext.ComponentQuery.query('displayfield', me)[3];

                hlPageNum.setValue(me.currentPage);
                hlTotalPageNum.setValue('共' + me.pageCount + "页");
                hlPageMsg.setValue('显示'+ ((me.currentPage - 1) * me.pageSize + 1) + ' - '+ me.currentPage * me.pageSize + '条，共计' + me.total+ '条');
            }
        }, '-', {
            xtype : 'displayfield',
            mangin : '0 10 0 10',
            value : '当前第'
        }, {
            xtype : 'numberfield',
            mangin : '0 10 0 10',
            width : 60,
            value : '1',
            hideLabel : true,
            listeners : {
                specialkey : function(field, e) {

                    if (field.value == null || field.value == '' || field.value == 'undefined') {
                        Ext.Msg.alert("提示", "请先输入页码!");
                        return;
                    }

                    if (e.getKey() == Ext.EventObject.ENTER) {

                        var hlPageNum=Ext.ComponentQuery.query('numberfield', me)[0];

                        var hlTotalPageNum=Ext.ComponentQuery.query('displayfield', me)[2];

                        var hlPageMsg= Ext.ComponentQuery.query('displayfield', me)[3];

                        var goPage = field.value;

                        if (Math.abs(goPage - me.currentPage) > 200) {
                            Ext.Msg.alert("提示", "跨度不能超过200页");
                            return;
                        }

                        var minPage = me.currentPage - me.currentPage % 5;

                        var maxPage =minPage+5;

                        //这里主要是由于5的整数倍的时候minpage得出事实上是页码的最大值
                        if(me.currentPage % 5==0){
                            maxPage= minPage;
                            minPage=maxPage-5;
                        }

                        //判断数据是否在缓存中，如果在则不发ajax，不重新加载数据
                        if(goPage>=minPage&&goPage<=maxPage){

                            var start=(goPage%5-1)*me.pageSize;

                            if(goPage%5==0){
                                start=(5-1)*me.pageSize;
                            }

                            var end =start + me.pageSize ;

                            if(end>me.localData){
                                me.store.loadRawData(me.localData.slice(start, me.localData.length));
                            }else{
                                me.store.loadRawData(me.localData.slice(start, end));
                            }

                            me.currentPage = goPage;

                            hlPageNum.setValue(me.currentPage);

                            if ((me.currentPage % 5) * me.pageSize > me.localData.length) {
                                hlPageMsg.setValue('显示'+ (me.currentPage * me.pageSize + 1)+ ' - '+ (me.currentPage * me.pageSize + me.localData.length)+ '条，共计' + me.total+ '条');
                            } else {
                                hlPageMsg.setValue('显示'+ ((me.currentPage - 1) * me.pageSize + 1)+ ' - ' + me.currentPage * me.pageSize + '条，共计'+ me.total + '条');
                            }

                            return ;
                        }

                        var startPage = goPage - goPage % 5;

                        var p = {};

                        // 构造查询时所带的参数
                        for (var i = 0; i < me.params.length; i++) {

                            var temp = me.params[i];
                            var comp=Ext.getCmp(temp);
                            if(comp!=null&&comp!='undefined')
                                p[temp] = comp.getValue();
                        }

                        p.start = startPage * me.pageSize;

                        // 每次加载5页数据
                        p.limit = me.pageSize * 5;

                        Ext.Msg.wait('处理中，请稍后...', '提示'); // 进度条等待
                        Ext.Ajax.request({
                            url : me.url,
                            method : 'POST',
                            params : p,
                            success : function(response, options) {
                                try {
                                    var data = Ext.decode(response.responseText);

                                    if (data.rows == null|| data.rows == 'undefined'|| data.rows.length == 0) {
                                        Ext.Msg.hide();
                                        return;
                                    }

                                    if(data.total==null||data.total==0){
                                        return ;
                                    }
                                    me.localData = data.rows;

                                    me.store.removeAll();

                                    var size = me.pageSize;

                                    var start = (goPage % 5-1) * size;

                                    var end = (goPage % 5) * size;

                                    if (me.localData.length < end) {
                                        end = me.localData.length;
                                    }

                                    me.store.loadRawData(me.localData.slice(
                                        start, end));

                                    me.total = data.total;

                                    me.pageCount = me.total / me.pageSize;

                                    if (me.total % me.pageSize != 0) {
                                        me.pageCount++;
                                    }
                                    me.pageCount = Math.floor(me.pageCount);

                                    me.currentPage = goPage;

                                    hlPageNum.setValue(me.currentPage);
                                    hlTotalPageNum.setValue('共'+ me.pageCount + "页");

                                    if ((me.currentPage % 5) * me.pageSize > me.localData.length) {
                                        hlPageMsg.setValue('显示'+ (me.currentPage * me.pageSize + 1)+ ' - '+ (me.currentPage * me.pageSize + me.localData.length)+ '条，共计' + me.total+ '条');
                                    } else {
                                        hlPageMsg.setValue('显示'+ ((me.currentPage - 1) * me.pageSize + 1)+ ' - ' + me.currentPage * me.pageSize + '条，共计'+ me.total + '条');
                                    }
                                } catch (e) {
                                    Ext.Msg.hide();
                                }
                                Ext.Msg.hide();
                            },
                            failure : function(response, options) {
                                Ext.Msg.hide();
                                Ext.MessageBox.alert('提示', '请求超时或网络故障,错误信息：'+ response.message);
                            }
                        });
                    }
                }
            }
            // value:'当前第'+this.currentPage+"页"
        }, {
            xtype : 'displayfield',
            mangin : '0 10 0 10',
            value : "页"
        }, "-", {
            xtype : 'displayfield',
            mangin : '0 10 0 10',
            value : '共' + this.pageCount + "页"
        }, '-', {
            xtype : 'button',
            text : '下一页',
            mangin : '0 10 0 10',
            disabled:true,
            handler : function() {

                var items = Ext.ComponentQuery.query('button', me);

                var b = me.currentPage + 1;

                me.pageCount = me.total / me.pageSize;

                me.pageCount = Math.floor(me.pageCount);

                if (me.total % me.pageSize != 0) {
                    me.pageCount++;
                }

                // 如果超过5页，重新加载数据
                if (b % 5 == 1 && b != 1) {

                    var p = {};

                    // 构造查询时所带的参数
                    for (var i = 0; i < me.params.length; i++) {

                        var temp = me.params[i];
                        var comp=Ext.getCmp(temp);
                        if(comp!=null&&comp!='undefined'){
                            p[temp] = comp.getValue();
                        }
                    }

                    p.start = (b - 1) * me.pageSize;

                    //获取分库键
                    if(me.partKey!=null&&me.partKey!='undefined'&&me.partKey!='')
                    p[me.partKey]=(me.localData[me.localData.length-1]).get(me.partKey);

                    // 每次加载5页数据
                    p.limit = me.pageSize * 5;

                    Ext.Msg.wait('处理中，请稍后...', '提示'); // 进度条等待

                    Ext.Ajax.request({
                        url : me.url,
                        method : 'POST',
                        params : p,
                        success : function(response, options) {

                            var data = Ext.decode(response.responseText);

                            if (data.rows == null|| data.rows == 'undefined'|| data.rows.length == 0) {
                                Ext.Msg.hide();
                                return;
                            }

                            me.localData = data.rows;

                            me.store.removeAll();

                            me.store.loadRawData(me.localData.slice(0, me.pageSize));

                            me.total = data.total;

                            me.pageCount = me.total / me.pageSize;

                            if (me.total % me.pageSize != 0) {
                                me.pageCount++;
                            }
                            me.pageCount = Math.floor(me.pageCount);

                            Ext.Msg.hide();
                        },
                        failure : function(response, options) {
                            Ext.Msg.hide();
                            Ext.MessageBox.alert('提示','请求超时或网络故障,错误信息：'+ response.message);
                        }
                    });

                } else {
                    if (b <= me.pageCount) {
                        var size = me.pageSize;
                        var start = (me.currentPage % 5) * size;
                        var end = (b % 5) * size;

                        if (b % 5 == 0) {
                            end = me.localData.length;
                        }

                        me.store.removeAll();

                        // 这里防止数据溢出
                        if (end < me.localData.length) {
                            me.store.loadRawData(me.localData.slice(start, end));
                        } else {
                            me.store.loadRawData(me.localData.slice(start, me.localData.length));
                        }
                    }
                }

                me.currentPage = b;

                // 总共大于1一页，当前第一页
                if (me.currentPage == 1 && me.pageCount > 1) {
                    items[0].setDisabled(true);
                    items[1].setDisabled(false);
                }

                // 总共大于一页，当前小于总页数
                if (me.currentPage > 1 && me.pageCount == me.currentPage) {
                    items[0].setDisabled(false);
                    items[1].setDisabled(true);
                }

                // 总共一页，当前第一页
                if (me.currentPage == 1 && me.pageCount == 1) {
                    items[0].setDisabled(true);
                    items[1].setDisabled(true);
                }

                // 总共大于一页，当前小于总页数
                if (me.currentPage > 1 && me.pageCount > me.currentPage) {
                    items[0].setDisabled(false);
                    items[1].setDisabled(false);
                }


                var hlPageNum=Ext.ComponentQuery.query('numberfield', me)[0];

                var hlTotalPageNum=Ext.ComponentQuery.query('displayfield', me)[2];

                var hlPageMsg= Ext.ComponentQuery.query('displayfield', me)[3];

                hlPageNum.setValue(me.currentPage);
                hlTotalPageNum.setValue('共' + me.pageCount + "页");

                if ((me.currentPage % 5) * me.pageSize > me.localData.length) {
                    hlPageMsg.setValue('显示'+ (me.currentPage * me.pageSize + 1)+ ' - '+ (me.currentPage * me.pageSize + me.localData.length)+ '条，共计' + me.total + '条');
                } else {
                    hlPageMsg.setValue('显示'+ ((me.currentPage - 1) * me.pageSize + 1) + ' - '+ me.currentPage * me.pageSize + '条，共计' + me.total+ '条');
                }

            }
        }, "-", {
            xtype : 'displayfield',
            mangin : '0 10 0 10',
            value : ''
            // value:'显示'+ 16 - 30+ '条，共计'+this.total +'条'
        }];
        me.callParent();
    },
    initLocalData : function(rows, total) {

        var items = Ext.ComponentQuery.query('button', this);

        var hlPageNum=Ext.ComponentQuery.query('numberfield', this)[0];

        var hlTotalPageNum=Ext.ComponentQuery.query('displayfield', this)[2];

        var hlPageMsg= Ext.ComponentQuery.query('displayfield', this)[3];

        this.localData = rows;
        this.total = total;
        var a = this.pageSize;

        //先清缓存
        this.store.removeAll();

        //如果数据为空禁用上一页和下一页按钮
        if(this.total==0||this.localData==null||this.localData.length==0){
            items[0].setDisabled(true);
            items[1].setDisabled(true);
            hlPageMsg.setValue('无数据');
            hlPageNum.setValue(1);
            hlTotalPageNum.setValue('共' + 0 + "页");
            return;
        }

        this.store.loadRawData(this.localData.slice(0, a));

        this.pageCount = this.total / this.pageSize;

        if (this.total % this.pageSize != 0) {
            this.pageCount++;
        }
        this.pageCount = Math.floor(this.pageCount);

        this.currentPage = 1;

        hlPageNum.setValue(this.currentPage);

        hlTotalPageNum.setValue('共' + this.pageCount + "页");

        if (this.localData.length > this.pageSize) {
            hlPageMsg.setValue('显示1 - ' + this.pageSize + '条，共计'+ this.total + '条');
        } else {
            hlPageMsg.setValue('显示1 - ' + this.localData.length+ '条，共计' + this.total + '条');
        }

        // 总共大于1一页，当前第一页
        if (this.currentPage == 1 && this.pageCount > 1) {
            items[0].setDisabled(true);
            items[1].setDisabled(false);
        }

        // 总共大于一页，当前小于总页数
        if (this.currentPage > 1 && this.pageCount == this.currentPage) {
            items[0].setDisabled(true);
            items[1].setDisabled(false);
        }

        // 总共一页，当前第一页
        if (this.currentPage == 1 && this.pageCount == 1) {
            items[0].setDisabled(true);
            items[1].setDisabled(true);
        }

        // 总共大于一页，当前小于总页数
        if (this.currentPage > 1 && this.pageCount > this.currentPage) {
            items[0].setDisabled(false);
            items[1].setDisabled(false);
        }

    }
});
