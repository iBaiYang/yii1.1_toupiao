;
(function($, w, d) {
    $(function() {
        /* 判断时间是否开始 */
        /* ================================================== */
        var nowtime = new Date();
        var starttime = new Date('2017-1-2 18:00:00');
        var endtime = new Date('2017-1-2 21:00:00');
        var isstart=3;
        if (nowtime < starttime) {
            alert('投票还未开始，请稍后再试！');
            return false;
        } else if (nowtime > endtime) {
            alert('投票已经结束！');
            isstart=3;
            endGetdata();
            return false;
        } else {
            timeGetdata();
        }

        var defaultvote = 150; //每个节目最初预算
        var needadd = false;
        var getdata = 0;

        function timeGetdata() {
            if (starttime <= nowtime <= endtime) {
                $.ajax({ //开始请求数据
                    url: $(".list_content").data("server"),
                    type: 'post',
                    dataType: 'json',
                    data: { events: 1 },
                    success: function(data) {
                        setVote(data);
                    },
                    error: function(data) {
                        alert("后台程序错误！");
                    }
                });
                getdata = setTimeout(function() {
                    timeGetdata();
                }, 2000);
            } else {
                clearTimeout(tm);
                return false;
            }

        }

        /* 投票结束请求页面结果 */
        /* ================================================== */
        function endGetdata() {
            $.ajax({ //结束时最后一次请求
                url: $(".list_content").data("server"),
                type: 'post',
                dataType: 'json',
                data: { events: 0 },
                success: function(data) {
                    setVote(data);
                    //判断是否已经结束投票
                    if (data.champion || data.champion != "") {
                        //source.close(); //断开请求
                        for (var j = 0; j < data.champion.length; j++) {
                            for (var x = 0; x < data.champion[j].length; x++) {
                                $("li#order_" + data.champion[j][x]).addClass('champion_' + (j + 1));
                            }
                        }
                    }
                },
                error: function(data) {
                    alert("后台程序错误！");
                }
            });
        }

        /* 投票器 */
        /* ================================================== */
        function setVote(data) {
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].votes > defaultvote - 20) {
                    needadd = true;
                }
                var num_w = (parseFloat(data.list[i].votes) / defaultvote * 100).toFixed(2);
                $("li#order_" + data.list[i].order).find(".gressing").css({ "width": num_w + "%" });
                $("li#order_" + data.list[i].order).find(".nownumb").html(data.list[i].votes + "票");
            }
            if (needadd) {
                defaultvote += 20;
                needadd = false;
            }
        }
    });
})(jQuery, window, document);
