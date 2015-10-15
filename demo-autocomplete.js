$(function(){

	$("#tt").autoCompleteSelector({data:[{title:"Beijing(PEK),北京"},{title:"ChengDu(CTU),成都"},{title:"ChongQing(CKG),重庆"},{title:"Fuzhou(FOC),福州"},{title:"Guilin(KWL),桂林"}]});
    $("#ff").autoCompleteSelector({width:"200px",data:[{title:"book"},
                                    {title:"blue"},
                                    {title:"fool"},
                                    {title:"bus"}]});
    $("#qq").autoCompleteSelector({data:[{title:"book",result:"booooook"},//拿到 result 里的数据可继续处理
                                    {title:"blue",result:"bluuuuue"},
                                    {title:"fool"},
                                    {title:"bus",result:[1,2,3]}],
                          callback:function(data){
                            alert(data.result);
                          }});

    var url_ = "../selector/ajax.php";
    $("#nn").autoCompleteSelector({url:url_});

    $(".batch-text").autoCompleteSelector({data:[{title:"book"},{title:"blue"},{title:"fool"},{title:"bus"}]});

})
