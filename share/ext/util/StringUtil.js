/**
 * Created by chengjie on 2015/11/30.
 */

function obj2str(o){
    var r = [];
    if(typeof o == "string" || o == null) {
        return o;
    }
    if(typeof o == "object"){
        if(!o.sort){
            r[0]="{"
            for(var i in o){
                r[r.length]=i;
                r[r.length]=":";
                r[r.length]=obj2str(o[i]);
                r[r.length]=",";
            }
            r[r.length-1]="}"
        }else{
            r[0]="["
            for(var i =0;i<o.length;i++){
                r[r.length]=obj2str(o[i]);
                r[r.length]=",";
            }
            r[r.length-1]="]"
        }
        return r.join("");
    }
    return o.toString();
}



function formatMoney(s){
    s = s+"";
    if(/[^0-9\.]/.test(s)) return "incorrect  value";
    s=s.replace(/^(\d*)$/,"$1.");
    s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
    s=s.replace(".",",");
    var re=/(\d)(\d{3},)/;
    while(re.test(s))
        s=s.replace(re,"$1,$2");
    s=s.replace(/,(\d\d)$/,".$1");
    return "￥" + s.replace(/^\./,"0.");
}
/**
 * 格式化时间格式
 * @param value
 * @returns {*}
 */
function formatMoneyDate(value){
    if(value==null){
        return '';
    }
    var date=new Date(value);
    return  Ext.util.Format.date(date,"Y-m-d H:i:s") ;
}


function stringToImageUrl(value){
    if(value==null){
        return '';
    }
    return '<img src="'+value+'"  style="width:300px;height:75px;top:0px;left:0px;margin-top:10" />';
}