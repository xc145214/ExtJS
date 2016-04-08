/**
 * Created by chengjie on 2015/11/28.
 */
Ext.apply(Ext.form.VTypes, {
    mobile:function (value, field) {
        var telReg = !!value.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);

        return telReg;
    },
    mobileText:'手机格式不正确' ,

    repetition: function(val, field) {     //返回true，则验证通过，否则验证失败
        if (field.repetition) {               //如果表单有使用repetition配置，repetition配置是一个JSON对象，该对象提供了一个名为targetCmpId的字段，该字段指定了需要进行比较的另一个组件ID。
            var cmp = Ext.getCmp(field.repetition.targetCmpId);   //通过targetCmpId的字段查找组件
            if (Ext.isEmpty(cmp)) {      //如果组件（表单）不存在，提示错误
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '发生异常错误，指定的组件未找到',
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return false;
            }

            if (val == cmp.getValue()) {  //取得目标组件（表单）的值，与宿主表单的值进行比较。
                return true;
            } else {
                return false;
            }
        }
    },

    oneDayType: function(val, field) {

            var cmp = Ext.getCmp(field.oneDayType.targetCmpId);
            var startTime = cmp.getValue();
            var endTime = val;

            if(startTime !=null && endTime == null){
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '日期选择时间范围，或者都不选！',
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return false;
            }

            if(startTime ==null && endTime != null){
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '日期选择时间范围，或者都不选！',
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return false;
            }

            if(startTime !=null && endTime != null){
                var startTimeDate =  startTime;//
                var endTimeDate =  new Date((endTime).replace(new RegExp("-","gm"),"/")).getTime();
                var time = endTimeDate- startTimeDate.getTime();
                var days = Math.floor(time/(24*60*60*1000));
                if(days < 0 || days > 1){
                    Ext.MessageBox.show({
                        title: '错误',
                        msg: '两个日期的时间差必须控制在一天内！',
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });
                    return false;
                }

            }
            return true;
    },


    oneMonthType: function(val, field) {

        var cmp = Ext.getCmp(field.oneMonthType.targetCmpId);
        var startTime = cmp.getValue();
        var endTime = val;

        if(startTime !=null && endTime == null){
            Ext.MessageBox.show({
                title: '错误',
                msg: '日期选择时间范围，或者都不选！',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
            return false;
        }

        if(startTime ==null && endTime != null){
            Ext.MessageBox.show({
                title: '错误',
                msg: '日期选择时间范围，或者都不选！',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
            return false;
        }

        if(startTime !=null && endTime != null){
            var startTimeDate =  startTime;//
            var endTimeDate =  new Date((endTime).replace(new RegExp("-","gm"),"/")).getTime();
            var time = endTimeDate- startTimeDate.getTime();
            var days = Math.floor(time/(24*60*60*1000));
            if(days < 0 || days > 31){
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '两个日期的时间差必须控制在31天内！',
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return false;
            }

        }
        return true;
    },


    greaterDayType:function(val, field) {

        var cmp = Ext.getCmp(field.greaterDayType.targetCmpId);
        var startTime = cmp.getValue();
        var endTime = val;

        if(startTime == null || endTime == null){
            Ext.MessageBox.show({
                title: '错误',
                msg: '日期选择时间范围！',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
            return false;
        }

        if(startTime !=null && endTime != null){
            var startTimeDate =  startTime;
            var endTimeDate =  new Date((endTime).replace(new RegExp("-","gm"),"/")).getTime();
            var time = endTimeDate- startTimeDate.getTime();
            var days = Math.floor(time/(24*60*60*1000));
            if(days < 0){
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '后面的时间必须大于前面的时间！',
                    icon: Ext.Msg.ERROR,
                    buttons: Ext.Msg.OK
                });
                return false;
            }

        }
        return true;
    },


    repetitionText: '输入的两次密码不一样'
})