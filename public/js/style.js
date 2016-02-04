/**
 * Created by Ashima on 2015/9/14.
 */
$(function() {
    var pagename=$("body").attr("pagename");
    var isIe8=judgeie89();
    attachPie('applypie',isIe8);
    attachPlaceholder("input[placeholder],textarea[placeholder]",isIe8);
    /**
     * 搜索
     */
    $("body").bind("click", function (e, event) {
        if (e.target.className.indexOf("search") != -1) {
            return;
        }
        if ($(".search").val() !== '') {
            return;
        }
        var searchBox=$(".soform");
        if(searchBox.hasClass('spread')){
            return ;
        }
        searchBox.removeClass("open");
    });
    $(".ico-serche").unbind("click").bind("click", function (event) {
        var searchBox=$(".soform");
        if(searchBox.hasClass('spread')){
            return ;
        }
        $(".soform").addClass("open");
        $("#soform .search").focus();
    });
    $("#soform .search").focus(function(){
        $("#soform").addClass('focus');
    }).blur(function(){
        $("#soform").removeClass('focus');
    });
    //头部下拉

    $("body").on({
        mouseenter:function(){$(this).find(".per").addClass("show")},
        mouseleave:function(){ $(this).find(".per").removeClass("show")}
    },".user-prop");
    $(".topbar").delegate(".subtit","mouseover",function(){
        $(this).addClass("hover");
    }).delegate(".subtit","mouseout",function(){
        $(this).removeClass("hover");
    });
    /**
     * 推荐课程,梦想照进现实hover现实状态
     * @param
     * @param
     * @private
     */
    $("body").delegate(".showItme","mouseenter",function(event){
        var thisObj= $(this),
        box=thisObj.addClass("show").find(".slidebox");
        spreadHeight=box.find(".p1").outerHeight(true)+box.find(".p2").outerHeight(true);
        thisObj.addClass("show").find(".slidebox").stop().animate({"height":spreadHeight+"px"},700,'easeOutQuint');
        thisObj.find(".tit").stop().fadeTo(700,0,'easeOutQuint');
        if(isIe8){
            thisObj.find(".btn").css({"filter":"alpha(opacity=100);","zoom":1,"display":"inline"});
        }else{
            thisObj.find(".btn").stop().fadeTo(700,1,'easeOutQuint');
        }
        
     }).delegate(".showItme","mouseleave",function(event){
        var thisObj= $(this);
        thisObj.removeClass("show").find(".slidebox").stop().animate({"height":"14px"},700,'easeOutQuint');
        thisObj.find(".tit").stop().fadeTo(600,1,'easeOutQuint');
        if(isIe8){
            thisObj.find(".btn").css({"filter":"alpha(opacity=0);","zoom":1,"display":"inline"});
        }else{
            thisObj.find(".btn").stop().fadeTo(600,0,'easeOutQuint');
        }
     }); 
    /**
     * 关闭广告
     * @param
     * @param
     * @private
     */
    $(".advertisement").delegate('em','click',function(){
        $(this).parent().hide();
    });

    /**
     * 详情页面学习流程
     */
    var xstTimer=null;
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if(!pagename){
            pagename=$("body").attr("pagename");
        }
        //只有首页导航有动画效果
        if(pagename=='index'){
            var _get_nav = $(".index .topbar"),_get_nav_parent=$(".index .page-header"),searchBox=$("#soform");
            if (scroll >= 20) {
                _get_nav.removeClass("transparentBg");
                _get_nav_parent.addClass("noGradident");
                searchBox.addClass("open").addClass("spread");

            } else {
                _get_nav.addClass("transparentBg");
                _get_nav_parent.removeClass("noGradident");
                searchBox.removeClass("open");
                if(pagename=='index'){
                    searchBox.removeClass("spread");
                }

            }

        }
        //详情页面学习流程
        var _study_process = $(".detail .study-step");
        if (_study_process.length > 0) {
            var basetop=_study_process.offset().top;
            basetop=basetop>200?basetop-200:0;
            if (scroll > basetop && scroll < basetop+200) {
                _study_process.removeClass("active");
                _study_process.eq(0).addClass("active");
            } else if (scroll > basetop+200 && scroll < basetop+900) {
                _study_process.removeClass("active");
                _study_process.eq(1).addClass("active");
            } else if (scroll > basetop+900 && scroll < basetop+1100) {
                _study_process.removeClass("active");
                _study_process.eq(2).addClass("active");
            }
        }
        //小书童动画
        var xstobj = $("#xst");
        if (xstobj.length > 0 && !isIe8) {

            var xstTop=xstobj.offset().top,windowHeight=$(window).height();
            if (scroll+windowHeight > xstobj.offset().top &&scroll<xstobj.offset().top) {

                /**
                 * 普通动画函数
                 *general:普通状态动画 eye:普通状态眨眼睛 loading:页面加载动画
                 * @return {[type]} [description]
                 */
                xstobj.removeClass("general eye  loading ").addClass("loading");
                var  count=0;
                var timer=null;
                var generalAnimate=null;
                var generalAnimate2=null;
                var animationGeneralFun = function() {
                    xstobj.removeClass("general eye  loading ");
                    if(generalAnimate){
                        clearTimeout(generalAnimate);
                    }
                    generalAnimate = setTimeout(function myFunction() {
                        if(generalAnimate2){
                            clearTimeout(generalAnimate2);
                        }
                        xstobj.addClass("general");
                        count++;
                        if(count==5){
                            count=0;
                            xstobj.removeClass("general").addClass("eye");
                            setTimeout(animationGeneralFun,1000);
                            clearTimeout(generalAnimate);
                            return ;
                        }
                        generalAnimate2=setTimeout(function(){xstobj.removeClass("general");}, 6000);
                        generalAnimate = setTimeout(myFunction, 8000);
                    },2000);
                };
                setTimeout(animationGeneralFun,2000);
            }
        }
    });
    /**
     * 返回顶部
     */
    $('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var scroll = $(window).scrollTop(), _animate_time = 2000;
            if (scroll < 999) {
                _animate_time = 1000;
            } else {
                _animate_time = 2000
            }
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, _animate_time);
                return false;
            }
        }
    });

    if(pagename){
        //首页和课程介绍页显示营销弹出框
        if(pagename=="index"||pagename=="detail"){
            setTimeout(function(){
                $(".consultAdvertisement").fadeIn();
            },20000);
        }
        switch(pagename){
            case 'index':
                indexInit();
                break;
            case 'detail':
                detailInit();
                break;

        }
    }

    /**
     * 播放弹出框
     */
    if($(".video-play").length>0){
        var _video_sign=$(".sign-tip-video"),_video_content=$(".sign-video"),_tip_zc= $(".sign-video .tip_zc");
        $(".video-play").bind("click",function(){
            self_resize(_video_content);
            _video_sign.addClass("is-visible");
        })

        $(".sign-video .tip_gb").bind("click", function () {
            _video_sign.removeClass("is-visible");
        });
        $(".sign-video .video_zc_l").bind("click", function () {
            _tip_zc.hide();
        });
        $(window).resize(function () {
            self_resize(_video_content)
        });
    }

});
/**
 * 判断是否为ie89
 * @param 返回true表示是
 */
function judgeie89(){
    //判断是不是ie8
    var temp=false;
    if(navigator.userAgent.indexOf("MSIE")>0){
        if(navigator.userAgent.indexOf("MSIE 8.0")>0 || navigator.userAgent.indexOf("MSIE 9.0")>0)
        {
            temp=true;
        }
    }
    return temp;
}
/**
 * 兼容ie 圆角等等
 * @param name 类名
 */
function attachPie(name,isIe8) {
    $('.' + name).each(function () {
        if (isIe8) {
            PIE.attach(this);
        }
    });
}
/**
 * 兼容ie placeholder
 * @param name 类名
 */
function attachPlaceholder(selector,isIe8) {
    $(selector).each(function () {
        if (isIe8) {
            $(this).placeholder();
        }
    });
}
//首页初始化
function indexInit(){
    //切换文字
    textChange(".text-list");
    _get_pics("#pics2",function(){
        pics(".pager1 .prev",".pager1 .next","#pics");
        pics(".pager2 .prev",".pager2 .next","#pics2");
    });

}
//详细页面初始化
function detailInit(){
    _get_pics("#strongman-sequence",function(){
        pics("#strongmanPrev","#strongmanNext","#strongman-sequence");
    });
    _get_pics("#pics2",function(){
        pics(".pager2 .prev",".pager2 .next","#pics2");
    });
    //显示底部导航中对应课程模块标签
    var aList=$(".detail").find(".anchorItem");
    var fixbar=$(".fixbar");
    aList.each(function(){
        var clasStr="."+$(this).attr("name");
        var currentLI=fixbar.find(clasStr);
        if(currentLI.length>0){
            currentLI.show();
        }
    });
    fixbar.find(".go_bm").show();

}

/**
 * 下滑到下一目录
 * @param id目标元素的类名或id名
 * @param num距离头部偏差的问题
 * @private
 */
function nextSection(id,num){
    var scroll = $(window).scrollTop();
    var objTop=$(id).offset().top;
    $('html,body').animate({scrollTop:(objTop-num)+"px"},500);
}
/**
 * 自动计算弹出框位置，居中
 * @param $dom
 */
function self_resize($dom){
    var left = ($(window).width() - $dom.width()) / 2;
    var top = ($(window).height() - $dom.height()) / 2;
    $dom.css({position: "fixed", left: left + 'px', top: top + 'px'});

}
/**
 * 轮播事件
 * @param pre
 * @param nex
 * @param box
 */
function pics(pre,nex,box) {
    var oPrev = $(pre);
    var oNext = $(nex);
    var hdp = $(box);
    var oImg = hdp.find(".sequence-canvas li");
    var oAc = hdp.find(".sequence-pagination li");
    $(oImg[0]).show();
    var i = 0;
    var current=0;
    var nextcurrent;
    var total=oImg.length;
    var times=null;
    /*淡入淡出切换效果*/
    function fSwitch(dir,num) {
        if( dir === 'pre' ) {
            num= num < 0 ? total - 1 : num;
        }
        else if( dir === 'next' ) {
            num = num > total - 1 ? 0 : num;
        }
        $(oImg[current]).fadeOut(500,"easeInQuart",function(){
            $(oAc).find("em").removeClass("icon-jindu-weiwancheng").addClass("icon-jindu-wancheng");
            $(oImg[num]).fadeIn({duration:500,easing:"easeInQuart"});
            $(oAc[num]).find("em").removeClass("icon-jindu-wancheng").addClass("icon-jindu-weiwancheng");
            current=num;
            i=num;
        });
    }
    /*鼠标移入移除暂停动画*/
    $(hdp).on('mouseenter', function(e){
        if(times){
            clearInterval(times);
        }
    }).on('mouseleave', function(e){
        play();
    });
    /*点击事件内容*/
    function dianji() {
        oPrev.click(function () {
            i--;
            fSwitch('pre',i);
        });
        oNext.click(function () {
            i++;
            i = i > total - 1 ? 0 : i;
            fSwitch('next',i);
        })
    }

    /*幻灯片播放*/
    function play() {
        times = setInterval(function () {
            i++;
            fSwitch("next",i);
        }, 4000);
    }

    /*圆点点击事件*/
    $(oAc).each(function (index, obj) {
        $(obj).click(function () {
            i = index;
            fSwitch("next",i);
        })
    });
    dianji();
    play();
}
/**
 * 轮播填充数据
 * @param ids
 * @param callback
 * @private
 */
function _get_pics(ids, callback){
    var img_pic=$(ids+" .sequence-canvas li");
    var _item_option=$(ids+" .sequence-pagination");
    var _item_option_html="";
    for(var i=0;i<img_pic.length;i++){
        if(i==0){
            _item_option_html+='<li><em class="icon-jindu-weiwancheng"></em></li>'
        }else{
            _item_option_html+='<li><em class="icon-jindu-wancheng"></em></li>'
        }
    }
    _item_option.append(_item_option_html);
    if(callback){
        callback();
    }
}


/**
 * 文字切换
 * @param $class 包含框的类名或id名
 * @param
 * @private
 */
function textChange($class){
    var liList=$($class).find("li");
    var total=liList.length;
    var index=0;
    var next=0;
    liList.css({opacity:0,left:'-120px',zIndex:"-1"});
    liList.eq(index).animate({opacity:1,left:'0px',zIndex:'2'},{duration:540,easing:"easeOutBack"});
    setInterval(function(){
        var currentObj=$($class).find("li").eq(index);
        if(index+1>=total){
            var next=0;
        }else{
            var next=index+1;
        }
        currentObj.animate({opacity:0},740).delay(100).animate({left:'-120px',zIndex:"-1"});
        liList.eq(next).delay(690).animate({opacity:1,left:'0px',zIndex:"2"},{duration:540,easing:"easeOutBack"});
        index=next;
    },3000);
}
/**
 * 关闭弹框
 * @param $class 包含框的类名或id名
 * @param 
 * @private
 */
 function close($class){
    $($class).hide();
 }