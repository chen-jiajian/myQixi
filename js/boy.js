/////
function BoyWalk(){


        var swipe = Swipe($("#content"));
        var container = $("#content");
        // 页面可视区域
        var visualWidth = container.width();
        var visualHeight = container.height();
        /*$('button').click(function() {
            // 调用接口
           swipe.scrollTo($("#content").width() * 2, 5000);
        });*/
        // 获取数据
        var getValue = function(className) {
            var $elem = $('' + className + '');
                // 走路的路线坐标
            return {
                height: $elem.height(),
                top: $elem.position().top//获取离顶部距离
            };
        };
        
        // 路的Y轴
        var pathY = function() {
            var data = getValue('.a_background_middle');
            return data.top + data.height / 2;
        }();

        // 小男孩
        var $boy = $("#boy");
        var boyHeight = $boy.height();

        // 修正小男孩的正确位置
        $boy.css({
		    top: pathY - boyHeight + 25
		 });
        
	        // jquery的transition方法      
	       /* $boy.transition({
			    'left': $("#content").width() + 'px',
			}, 10000,'linear');*/
			//css方法
			/*$boy.css({
				'left': $("#content").width() + 'px',
				'transition': 'all 10s linear 0s'
			});*/
             // 10秒钟 ，走到0.5 也就是页面中间位置
           
	   
        //恢复走路
        function restoreWalk(){
            $boy.removeClass('pauseWalk');
            $boy.addClass('slowWalk');
        }
        //动作变化
        function slowWalk(){
            $boy.addClass('slowWalk');
        }
        //暂停走路
        function pauseWalk(){
            $boy.removeClass('slowWalk');
            $boy.addClass('pauseWalk');
        }
        //计算移动的距离 direction方向 proportion页面距离百分比
        function calculateDist(direction,proportion){
            //返回距离
            return (direction=="x"?visualWidth : visualHeight)*proportion;
        }

        //开始走路
        function walkRun(time,dist,disY){
            time=time||3000;
            //脚动作
            slowWalk();
            //移动
            var d1=startRun({
                'left':dist+"px",
                'top':disY?disY:undefined
            },time);
            return d1;//deferred对象 
            
        }

        //
        function startRun(options,time){
            //声明Deferred对象
            var dfdPlay = $.Deferred();
            // 恢复走路
            restoreWalk();
             // 平行移动
            $boy.transition(
                options,
                time,
                'linear',
                function() {
                    //pauseWalk();
                    dfdPlay.resolve(); // 动画完成
                });
                return dfdPlay;
            }

        /*开门*/
        function doorOpen(time,options){
            var d2=startOpen(options,time);
            return d2;
        }
       
        function startOpen(options,time){
            //声明Deferred对象
            var dfdOpen = $.Deferred();
            var count = 2;
            // 等待开门完成
            var complete = function() {
                if (count == 1) {
                    dfdOpen.resolve();
                    return;
                }
                count--;
            };

            $(".door-left").transition(
                options.le,
                time,
                'linear',
                complete
            );
            $(".door-right").transition(
               options.ri,
                time,
                'linear',
                complete
            );
            return dfdOpen;
        }
        /*开门end*/

        /*开灯*/
        var lamp={
            elem:$(".b_background"),
            /*转换背景来开关灯*/
            bright: function(){
                this.elem.addClass("lamp-bright");
               
            },
            dark:function(){
                this.elem.removeClass("lamp-bright");
            }
        }
        /*开灯end*/

        /*走进商店*/
        function ToShop(){
            var dfdToShop=$.Deferred();
            var doorObj=$(".door");
            //门坐标
            var offsetDoor = doorObj.offset();
            var doorOffsetLeft = offsetDoor.left;
            // 小孩当前的坐标
            var offsetBoy     = $boy.offset();
            var boyOffetLeft = offsetBoy.left;
            // 当前需要移动的坐标
            var instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);

            // 开始走路
            var walkPlay = startRun({
                transform: 'translateX(' + instanceX + 'px),scale(0.4,0.3)',//scale缩放功能
                opacity: 0
            }, 3000);
            // 走路完毕
            walkPlay.then(function() {
               /* $boy.css({
                    opacity: 0
                })*/
                dfdToShop.resolve();
            })
            return dfdToShop;
        }
        /*走进商店end*/
        /*走出商店*/
        function OutShop(){
            var dfdOutShop=$.Deferred();
             // 当前需要移动的坐标
            //var instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
             // 开始走路
            var walkPlay = startRun({
                transform: 'translateX(' + 1 + 'px),scale(1,1)',//scale缩放功能
                opacity: 1
            }, 3000);
            walkPlay.then(function() {
               /* $boy.css({
                    opacity: 0
                })*/
                dfdOutShop.resolve();
            });
            return dfdOutShop;
        }
        /*走出商店end*/

        /*取花*/
        function TalkFlower(){
            var dfdFlower=$.Deferred();
            setTimeout(function(){  
                $boy.addClass("slowFlowerWalk");
                dfdFlower.resolve();
            },1000);
            return dfdFlower;
        }


        return {
             walkTo: function(time, proportionX, proportionY) {
                var distX = calculateDist('x', proportionX)
                var distY = calculateDist('y', proportionY)
                return walkRun(time, distX, distY);
            },
            openDoor:function(time){
                var options={
                    'le':{'left':'-50%'},
                    'ri':{'left':'100%'}
                }
                return doorOpen(time,options);
            },
            closeDoor:function(time){
                var options={
                    'le':{'left':'0%'},
                    'ri':{'left':'50%'}
                }
                return doorOpen(time,options);
            },
            lamp:function(){
                return lamp;
            },
            toShop: function() {
                return ToShop() ;
            },
            stopWalk:function(){
                return pauseWalk();
            },
            outShop:function(){
                return OutShop();
            },
            talkFlower:function(){
                return TalkFlower();
            },
            getWidth:function(){
                return $boy.width();
            }
        }
}    