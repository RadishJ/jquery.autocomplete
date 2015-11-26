$(function(){

	$("#tt").autoCompleteSelector({data:[{title:"Beijing"},{title:"ChengDu"},{title:"重庆"},{title:"Fuzhou"},{title:"桂林"}]});
    $("#ff").autoCompleteSelector({width:"200px",data:[{title:"book"},
                                    {title:"blue"},
                                    {title:"fool"},
                                    {title:"bus"}]});
    $("#qq").autoCompleteSelector({data:[{title:"book",result:"booooook"},
                                    {title:"blue",result:"blue xx"},
                                    {title:"fool"},
                                    {title:"bus",result:[1,2,3]}],
                          callback:function(data){
                            alert(data.result);
                          }});

    var url_ = "../selector/ajax.php";
    $("#nn").autoCompleteSelector({url:url_});

    $(".batch-text").autoCompleteSelector({data:[{title:"book"},{title:"blue"},{title:"fool"},{title:"bus"}]});

})
