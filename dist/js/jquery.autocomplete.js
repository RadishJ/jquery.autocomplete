/*!
 * jQuery AutoComplete
 *
 * Parameters :
 *
 * 	 width        : 0,
 * 	 url          : null,
 * 	 data         : null,
 * 	 callback     : null
 *
 * Version        : V1.01
 * BaseOn         : jquery.bigautocomplete
 * Maintained by  : RadishJ (https://github.com/RadishJ/)
 * Create Date    : 2015-08-10
 * Last Fix Date  : 2015-09-10
 */
;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    var autoCompleteSelector = new function() {
        currentInputText = null; //目前获得光标的输入框（解决一个页面多个输入框绑定自动补全功能）
        this.functionalKeyArray = [9, 20, 13, 16, 17, 18, 91, 92, 93, 45, 36, 33, 34, 35, 37, 39, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 19, 145, 40, 38, 27]; //键盘上功能键键值数组
        this.holdText = null; //输入框中原始输入的内容

        //初始化插入自动补全div，并在document注册mousedown，点击非div区域隐藏div
        this.init = function() {
            $("body").append("<div id='autoCompleteSelector' class='autoCompleteSelector-layout'></div>");
            $(document).bind('mousedown', function(event) {
                var $target = $(event.target);
                if ((!($target.parents().andSelf().is('#autoCompleteSelector'))) && (!$target.is($(currentInputText)))) {
                    autoCompleteSelector.hideSelector();
                }
            })

            //鼠标悬停时选中当前行
            $("#autoCompleteSelector").delegate("tr", "mouseover", function() {
                $("#autoCompleteSelector tr").removeClass("ct");
                $(this).addClass("ct");
            }).delegate("tr", "mouseout", function() {
                $("#autoCompleteSelector tr").removeClass("ct");
            });


            //单击选中行后，选中行内容设置到输入框中，并执行callback函数
            $("#autoCompleteSelector").delegate("tr", "click", function() {
                $(currentInputText).val($(this).find("div:last").html());
                var callback_ = $(currentInputText).data("config").callback;
                if ($("#autoCompleteSelector").css("display") != "none" && callback_ && $.isFunction(callback_)) {
                    callback_($(this).data("jsonData"));

                }
                autoCompleteSelector.hideSelector();
            });
        }

        this.selector = function(param) {

                if ($("body").length > 0 && $("#autoCompleteSelector").length <= 0) {
                    autoCompleteSelector.init(); //初始化信息
                }
                var $this = this; //为绑定自动补全功能的输入框jquery对象

                var $autoCompleteSelector = $("#autoCompleteSelector");

                this.config = {
                    //width:下拉框的宽度，默认使用输入框宽度
                    width: 0,
                    //url：格式url:""用来ajax后台获取数据，返回的数据格式为data参数一样
                    url: null,
                    /*data：格式{data:[{title:null,result:{}},{title:null,result:{}}]}
			               url和data参数只有一个生效，data优先*/
                    data: null,
                    //callback：选中行后按回车或单击时回调的函数
                    callback: null
                };
                $.extend(this.config, param);

                $this.data("config", this.config);

                //输入框keydown事件
                $this.keydown(function(event) {
                    var node = event.currentTarget;
                    switch (event.keyCode) {
                        case 40: //向下键

                            if ($autoCompleteSelector.css("display") == "none") return;

                            var $nextSiblingTr = $autoCompleteSelector.find(".ct");
                            if ($nextSiblingTr.length <= 0) { //没有选中行时，选中第一行
                                $nextSiblingTr = $autoCompleteSelector.find("tr:first");
                            } else {
                                $nextSiblingTr = $nextSiblingTr.next();
                            }
                            $autoCompleteSelector.find("tr").removeClass("ct");

                            if ($nextSiblingTr.length > 0) { //有下一行时（不是最后一行）
                                $nextSiblingTr.addClass("ct"); //选中的行加背景
                                $(node).val($nextSiblingTr.find("div:last").html()); //选中行内容设置到输入框中

                                //div滚动到选中的行,jquery-1.6.1 $nextSiblingTr.offset().top 有bug，数值有问题
                                $autoCompleteSelector.scrollTop($nextSiblingTr[0].offsetTop - $autoCompleteSelector.height() + $nextSiblingTr.height());

                            } else {
                                $(node).val(autoCompleteSelector.holdText); //输入框显示用户原始输入的值
                            }


                            break;
                        case 38: //向上键
                            if ($autoCompleteSelector.css("display") == "none") return;

                            var $previousSiblingTr = $autoCompleteSelector.find(".ct");
                            if ($previousSiblingTr.length <= 0) { //没有选中行时，选中最后一行行
                                $previousSiblingTr = $autoCompleteSelector.find("tr:last");
                            } else {
                                $previousSiblingTr = $previousSiblingTr.prev();
                            }
                            $autoCompleteSelector.find("tr").removeClass("ct");

                            if ($previousSiblingTr.length > 0) { //有上一行时（不是第一行）
                                $previousSiblingTr.addClass("ct"); //选中的行加背景
                                $(node).val($previousSiblingTr.find("div:last").html()); //选中行内容设置到输入框中

                                //div滚动到选中的行,jquery-1.6.1 $$previousSiblingTr.offset().top 有bug，数值有问题
                                $autoCompleteSelector.scrollTop($previousSiblingTr[0].offsetTop - $autoCompleteSelector.height() + $previousSiblingTr.height());
                            } else {
                                $(node).val(autoCompleteSelector.holdText); //输入框显示用户原始输入的值
                            }

                            break;
                        case 27: //ESC键隐藏下拉框
                            autoCompleteSelector.hideSelector();
                            break;
                    }
                });

                //输入框keyup事件
                $this.keyup(function(event) {
                    var k = event.keyCode;
                    var node = event.currentTarget;
                    var ctrl = event.ctrlKey;
                    var isFunctionalKey = false; //按下的键是否是功能键
                    for (var i = 0; i < autoCompleteSelector.functionalKeyArray.length; i++) {
                        if (k == autoCompleteSelector.functionalKeyArray[i]) {
                            isFunctionalKey = true;
                            break;
                        }
                    }
                    //k键值不是功能键或是ctrl+c、ctrl+x时才触发自动补全功能
                    if (!isFunctionalKey && (!ctrl || (ctrl && k == 67) || (ctrl && k == 88))) {
                        var config = $(node).data("config");

                        var offset = $(node).offset();
                        if (config.width <= 0) {
                            config.width = $(node).outerWidth() - 2
                        }
                        $autoCompleteSelector.width(config.width);
                        var h = $(node).outerHeight() - 1;
                        $autoCompleteSelector.css({
                            "top": offset.top + h,
                            "left": offset.left
                        });

                        var data = config.data;
                        var url = config.url;
                        var _keyword = $.trim($(node).val());
                        if (_keyword == null || _keyword == "") {
                            showAllData();
                            return;
                        }

                        if (url != null && url != "") { //ajax请求数据
                            $.post(url, {
                                keyword: _keyword
                            }, function(result) {
                                makeContAndShow(result.data)
                            }, "json");
                        } else {
                            makeContAndShow(dataFilter(data, _keyword));
                        }

                        autoCompleteSelector.holdText = $(node).val();
                    }
                    //回车键
                    if (k == 13) {
                        if ($autoCompleteSelector.css("display") == "none") return;

                        var $selectTr = $autoCompleteSelector.find(".ct");
                        if ($selectTr.length > 0) { //没有选中行时，选中第一行
                            $(currentInputText).val($selectTr.text());
                        }
                        //回调函数
                        var callback_ = $(node).data("config").callback;
                        if ($autoCompleteSelector.css("display") != "none") {
                            if (callback_ && $.isFunction(callback_)) {
                                callback_($autoCompleteSelector.find(".ct").data("jsonData"));
                            }
                            $autoCompleteSelector.hide();
                        }
                    }
                });


                //组装下拉框html内容并显示
                function makeContAndShow(_data) {
                    if (_data == null || _data.length <= 0) {
                        autoCompleteSelector.hideSelector();
                        return;
                    }

                    var cont = "<table><tbody>";
                    for (var i = 0; i < _data.length; i++) {
                        cont += "<tr><td><div>" + _data[i].title + "</div></td></tr>";
                    }
                    cont += "</tbody></table>";
                    $autoCompleteSelector.html(cont);
                    $autoCompleteSelector.show();
                    $autoCompleteSelector.find("tr:first").addClass("ct");
                    //每行tr绑定数据，返回给回调函数
                    $autoCompleteSelector.find("tr").each(function(index) {
                        $(this).data("jsonData", _data[index]);
                    })
                }

                function dataFilter(data, keyword) {
                    var _data = new Array();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].title.indexOf(keyword) > -1) {
                            _data.push(data[i]);
                        }
                    }
                    return _data;
                }

                function showAllData() {
                        //获取数据，并展示
                        var node = event.currentTarget;
                        var config = $(node).data("config");
                        var offset = $(node).offset();
                        if (config.width <= 0) {
                            config.width = $(node).outerWidth() - 2
                        }
                        $autoCompleteSelector.width(config.width);
                        var h = $(node).outerHeight() - 1;
                        $autoCompleteSelector.css({
                            "top": offset.top + h,
                            "left": offset.left
                        });
                        var data = config.data;
                        var url = config.url;

                        if (data != null && $.isArray(data)) {
                            var _keyword = $.trim($(node).val());
                            if ("" != _keyword) {
                                makeContAndShow(dataFilter(data, _keyword));
                            } else {
                                var _data = new Array();
                                for (var i = 0; i < data.length; i++) {
                                    _data.push(data[i]);
                                }
                                makeContAndShow(_data);
                            }
                        } else if (url != null && url != "") { //ajax请求数据
                            $.post(url, {}, function(result) {
                                makeContAndShow(result.data);
                            }, "json")
                        }
                    }
                    //输入框focus事件
                $this.focus(function(event) {
                    currentInputText = event.currentTarget;
                    showAllData();
                });

            }
            //隐藏下拉框
        this.hideSelector = function() {
            var $autoCompleteSelector = $("#autoCompleteSelector");
            if ($autoCompleteSelector.css("display") != "none") {
                $autoCompleteSelector.find("tr").removeClass("ct");
                $autoCompleteSelector.hide();
            }
        }

    };

    $.fn.autoCompleteSelector = autoCompleteSelector.selector;

}));
