$(function(){
    //alert弹框
    window.alert =alert;
    function alert(e){
        $("body").append('<div id="msg"><div id="msg_top">提示<span class="msg_close">×</span></div><div id="msg_cont">'+e+'</div><div class="msg_close" id="msg_clear">确定</div></div>');
        $(".msg_close").click(function (){
            $("#msg").remove();
        });
    }

    var width_size = document.body.clientWidth;

    if(980 < width_size && width_size < 1200) {
        $("#footer_img").attr("src","image/footer_1200.png");
    }else if(770 < width_size && width_size < 980){
        $("#footer_img").attr("src","image/footer_980.png");
    }else if(480 < width_size && width_size < 770){
        $("#footer_img").attr("src","image/footer_768.png");
    }else if(width_size < 480){
        $("#footer_img").attr("src","image/footer_480.jpg");
    }else{
        $("#footer_img").attr("src","image/footer.png");
    }

    if(width_size < 980){
        $("#cooperation_icon").attr("src","image/logo_icon_100.png");
    }else{
        $("#cooperation_icon").attr("src","image/logo_icon.png");
    }
    $(".icon").click(function () {

        if($(".menu ul").css('display') == 'none'){
            $(".menu ul").slideDown();
        }else{
            $(".menu ul").slideUp();
            
        }
    });
    
    var newsList = [];
    var newsInfo = '';

})



function newsDate(current){
    $(".news_introduce").html('');
    $.ajax({
        url:'http://39.99.175.166:9000/admin/website/informationList',
        dataType:'json',//数据类型
        type:'GET',//类型
        data:{
            current:current,
            size:5,
        },
        //请求成功
        success:function(res,status){
            var winW = $(window).width();
            if(res['errcode'] == 0) {
                localStorage.setItem("total", res.data.total);

                newsList =  res.data.records;  
                
                $.each(newsList,function(index,value){
                    var max_content=80;
                        if(value['content'].length>max_content){
                            value['content'] = value['content'].substring(0,max_content);
                            value['content'] = value['content'] +'......';
                        }
                    
                    var max_title=36;
                        if(value['title'].length>max_title){
                            value['title'] = value['title'].substring(0,max_title);
                            value['title'] = value['title'] +'......';
                        }


                    newsInfo = '<a href="news_detail.html?id='+value.id+'"><div class="news_list">\n'+
                    '<div class="news_img"><img style="width: 100%;" src="'+value.img+'"></div>\n'+
                    '<div class="news_info">\n'+
                        '<p class="news_tite">'+value.title+'</p>\n'+
                        '<p class="news_date">'+value.created+'</p>\n'+
                        '<p class="news_text" style="color:#646464">'+value.content+'</p>\n'+
                        '<p class="news_btn">查看详情</p>\n'+
                    '</div>\n'+
                '</div></a>\n'

                $(".news_introduce").append(newsInfo);

                    if(winW<768){
                        var button = $('#pageParent_page button');
                        $('#pageParent_page').html('');
                        $('#pageParent_page').append(button);
                    }
                });

                
                console.log(res.data.records)
            }else{
                alert(res['errmsg'])
            }
            
        },
        //失败/超时
        error:function(XMLHttpRequest,textStatus,errorThrown){
            if(textStatus==='timeout'){
                alert('請求超時');
                setTimeout(function(){
                    alert('重新请求');
                },2000);
            }
        }
        
    })
}


function news_detail(id){
   
    $.ajax({
        url:'http://39.99.175.166:9000/admin/website/information',
        dataType:'json',//数据类型
        type:'GET',//类型
        data:{
            id:id,
        },
        //请求成功
        success:function(res,status){
            if(res['errcode'] == 0) {
                var value =res.data;
                newsInfo = '<div>\n'+
                        '<p class="title">'+value.title+'</p>\n'+
                        '<p class="date">'+value.created+'</p>\n'+
                        '<p class="content">'+value.content+'</p>\n'+
                    '</div>\n'

                $(".news_detail").append(newsInfo);
                // console.log(res.data.records)
            }else{
                alert(res['errmsg'])
            }
        },
        //失败/超时
        error:function(XMLHttpRequest,textStatus,errorThrown){
            if(textStatus==='timeout'){
                alert('請求超時');
                setTimeout(function(){
                    alert('重新请求');
                },2000);
            }
        }
    })

}

function tijiao(){
    var name = $("#name").val();
    var mobile = $("#mobile").val();
    var email = $("#email").val();
    var message = $("#message").val();
    if(name == ''){
        alert('请输入您的姓名。');
            return false;
    }
    if(email == ''){
        alert('请输入您的邮箱地址。');
            return false;
    }
    if(mobile == ''){
        alert('请输入您的电话。');
            return false;
    }
    if(message == ''){
        alert('请填写留言。');
            return false;
    }
    $.ajax({
        url:'http://39.99.175.166:9000/admin/website/business/add',
        contentType: 'application/json',
        type:'POST',//类型
        data: JSON.stringify({
            name:name,
            phone:mobile,
            email:email,
            remark:message,
        }),
        //请求成功
        success:function(data,status){
            if(data['errcode'] == 0){
                setTimeout(function(){
                    alert("提交成功！");
                    },600);
                window.location.reload();
                
            }else{
                alert(data['errmsg'])
            }
        },
        //失败/超时
        error:function(XMLHttpRequest,textStatus,errorThrown){
            if(textStatus==='timeout'){
                alert('請求超時');
                setTimeout(function(){
                    alert('重新请求');
                },2000);
            }
        }
    })
}

