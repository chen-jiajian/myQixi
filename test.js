        
function Swipe(container){
        //滑动对象
        var swipe={};

        // 获取第一个子节点
        var element = container.find(":first");
        // li页面数量
        var slides = element.find(">");
        // 获取容器尺寸
        var width = container.width();
        var height = container.height();
        // 设置li页面总宽度(ul宽度撑大三倍)
        element.css({
            width  : (slides.length * width) + 'px',
            height : height + 'px'
        });
        // 设置每一个页面li的宽度 ==容器宽度
        $.each(slides, function(index) {
            var slide = slides.eq(index); //获取到每一个li元素    
            //动态设置
            slide.css({
			    width  : width + 'px',
			    height : height + 'px'
			});
        });

         // 绑定一个事件，触发通过
        swipe.scrollTo=function(x,speed) {
            // 在5秒的时间内，移动X的位置，为2个页面单位
            //var dfdScroll=$.Deferred();
            /*element.transition(
                {'left':x},
                speed,
                'linear',
                  function() {
                    //pauseWalk();
                    dfdScroll.resolve(); // 动画完成
            });*/
            element.css({
                'transition-timing-function': 'linear',
                'transition-duration': speed+'ms',
                'transform': 'translate3d(-' + x+ 'px,0px,0px)' //设置页面X轴移动
            });
            return this;
        };
        return swipe;
}