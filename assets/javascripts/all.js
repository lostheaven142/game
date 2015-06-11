$( document ).ready(function() {
    var socket = io.connect('http://node-lostheaven142.c9.io/')
    // document.body.onclick = function() {
    //     document.body.onselectstart = function() { return false };
    //     document.body.onmousedown = function() { return false };
    // }

    $('.post').on('click', function(){
        $('.comment').val()
        socket.emit('new message', {user:document.getElementById('name').value,message:$('.comment').val()})
        $('.content').html()+$('.content').append('<div class="comment-wrapper"><b>'+document.getElementById('name').value+'</b>: <p>'+$('.comment').val()+'</p></div><br>')
        $('.content').scrollTop($('div.comment-wrapper:last').offset().top);
        $('.comment').val('')
        console.log($('.comment').val())
    })
    socket.on('message for all', function(createNewMessage){
        $('.content').html()+$('.content').append('<div class="comment-wrapper"><b>'+createNewMessage.user+'</b>: <p>'+createNewMessage.message+'</p></div><br>')
        $('.content').scrollTop($('div.comment-wrapper:last').offset().top); 
    })
    $('.button').on('click', function(event){
        var myTextField = document.getElementById('name');
	    socket.emit('New', myTextField.value)
	    socket.on('All users', function(name){
	        //console.log(name)
	        for (var i=0;i<name.length;i++){
	           // console.log('name is '+name)
	           // console.log('name[i] is '+name[i])
	           // console.log('name[i].name is '+name[i].name)
	            var div = document.createElement('div');
    	        div.id = name[i].name;
    	        div.dataset.index=name[i].id;
    	        div.className = "ghost"; 
    	        //div.innerText = "I'm a "+name[i].name;
    	        div.innerText = name[i].name;
    	        $('body').append(div);
    	        $('.content').html()+$('.content').append('<div class="comment-wrapper"><b>'+name[i].name+' joined !</b></div><br>');
            }
	    })
	    socket.on('I am the one', function(hello){
	       // console.log(hello)
	        $('.content').html()+$('.content').append('<div class="comment-wrapper"><p>Hello, ' +hello.name+'!</p><br><br><p>Man: +1 point<br>Cat: -1 point<br> You can steal points from another ghost</p></div><br>');
	        $('.content').scrollTop($('div.comment-wrapper:last').offset().top); 
	        $('html').css('cursor', "url('/images/ghost1.png'), auto");
	        
	    })
	   // $('form').css('top','-100px')
	    $('form').animate({top:-500}, 500);
        // $('form').animate({opacity:0}, 500);
        $('.chat').animate({opacity:1, zIndex:10}, 500);
        $('.score').animate({opacity:1}, 500);
        $('html').css('cursor', "url('/images/cursor.png'), auto");
        $('input').css('cursor', "url('/images/cursor.png'), auto");
        $('.button').css('cursor', "url('/images/cursor.png'), auto");
        socket.on('Coordinatess', function(coordinate){
            console.log('получаю чужие координаты');
            $('#'+coordinate.name).css('left',coordinate.left+'px').css('top',coordinate.top+'px');
        })
        socket.on('disco', function(evilMan){
            console.log(evilMan);
            $('.content').html()+$('.content').append('<div class="comment-wrapper"><b>' +evilMan+' died</b></div><br>');
            $('.content').scrollTop($('div.comment-wrapper:last').offset().top); 
            $('#'+evilMan).remove();
            $('#'+evilMan).css('opacity',0);
        })
        $(window).on('mousemove', function(e){
            var left = e.pageX;
            var top = e.pageY+10;
            $('#'+myTextField.value).css('left',left+'px').css('top',top+'px');
            socket.emit('Coordinates',{left:left,top:top,name:myTextField.value});
        })
	    
    })
    socket.on('smth', function(randomOb){
        // console.log(randomOb)
        var box = document.createElement('div');
        box.className = ('box'+randomOb.forBox);
        $('.game').append(box);
        $('.box'+randomOb.forBox).addClass('elem'+randomOb.forOb);
        $('.box'+randomOb.forBox).animate({opacity:1}, 500);
        
        var v = 1
        $('.elem1').on('click', function() {
            if (v == 1){
                console.log('+1');
                $('html').css('cursor', "url('/images/ghost2.png'), auto");
                setTimeout(function() {
                    $('html').css('cursor', "url('/images/ghost1.png'), auto");
                }, 600);
                var now = $('.score').html()
                var plus = 1
                $('.score').html(parseInt(now)+parseInt(plus));
                // $('.score').animate({transform:'scale(2)'}, 500);
                $('.score').css('transform', 'scale(3)');
                setTimeout(function() {
                    $('.score').css('transform', 'scale(1)');
                }, 100);
                socket.emit('Click','box'+randomOb.forBox);
                
                var nameScore = document.getElementById('name').value;
                var countScore = document.getElementById('score').textContent;
                var score = {}
                score.name = nameScore
                score.count = countScore
                socket.emit('Score', score)
                v = v+1
                // console.log(v)
            }
            else{
                $('.score').html()
            }
        })
        $('.elem2').on('click', function() {
            if (v == 1){
                $(this).addClass("elem3");  
                $(this).removeClass("elem2"); 
                var audio = new Audio();
                audio.src = '/images/cat.mp3';
                audio.autoplay = true;
                console.log('-1');
                $('html').css('cursor', "url('/images/ghost3.png'), auto");
                if($('.score').html() > '0'){
                    var now = $('.score').html()
                    var minus = 1
                    $('.score').html(parseInt(now)-parseInt(minus));
                    $('.score').css('transform', 'scale(3)');
                    $('.score').css('color', 'red');
                    setTimeout(function() {
                        $('.score').css('transform', 'scale(1)');
                        $('.score').css('color', 'white');
                    }, 100);
                    
                    var nameScore = document.getElementById('name').value;
                    var countScore = document.getElementById('score').textContent;
                    var score = {}
                    score.name = nameScore
                    score.count = countScore
                    socket.emit('Score', score)
                    setTimeout(function() {
                        $('html').css('cursor', "url('/images/ghost1.png'), auto");
                    }, 1000);
                    setTimeout(function() {
                        $('.box'+randomOb.forBox).animate({opacity:0}, 300);
                        $('.box'+randomOb.forBox).removeClass('elem3')
                    }, 300);
                    v = v+1
                }
            }
            else{
                $('.score').html()
            }
        });
        socket.on('Delete', function(del) {
            // console.log('loooool'+del)
            $('.'+del).removeClass("elem1");
            $('.'+del).removeClass("elem2");
        });
        setTimeout(function() {
            setTimeout(function() {
                $('.box'+randomOb.forBox).removeClass('elem'+randomOb.forOb);
            }, 2000);
            $('.box'+randomOb.forBox).animate({opacity:0}, 500);
            $('.box'+randomOb.forBox).remove();
        }, 2500);
    })
    socket.on('Score', function(score){
        $('.content').html()+$('.content').append('<div class="comment-wrapper"> <b>'+score.name+': '+score.count+'</b></div><br>');
        $('.content').scrollTop($('div.comment-wrapper:last').offset().top); 
        // $('.content').html()+$('.content').append('<b>'+score.name+': '+score.count+'</b><br><br>');
    })
    
    
    function coolingClickGhost(ghost){
        $(ghost).removeClass('cooling');
        
    }
    
    $('body').on('click','.ghost', function() {
                if($(this).hasClass('cooling')){
                    var canClick = false;
                }else{
                    var canClick = true;   
                }
                if(canClick){
                    $(this).addClass('cooling');
                    
                    // socket.on('myId', function(itSmyId){
                    //     socket.emit('ClickBy',itSmyId)
                    // })
                    // socket.emit('ClickGhost',this.dataset.index)
                    
                    var obj = this;
                    $('html').css('cursor', "url('/images/ghost2.png'), auto");
                    
                    setTimeout(function() {
                        $('html').css('cursor', "url('/images/ghost1.png'), auto");
                    }, 600);
                    socket.emit('ClickGhost',this.dataset.index)
                    setTimeout(function(){
                        coolingClickGhost(obj);
                    },1000);
                }
	    })
	    socket.on('heHaveScore', function(){
            var now = $('.score').html()
            var plus = 1
            $('.score').html(parseInt(now)+parseInt(plus));
            $('.score').css('transform', 'scale(3)');
            setTimeout(function() {
                $('.score').css('transform', 'scale(1)');
            }, 100);
                
            var nameScore = document.getElementById('name').value;
            var countScore = document.getElementById('score').textContent;
            var score = {}
            score.name = nameScore
            score.count = countScore
            socket.emit('Score', score)
        })
	    socket.on('scaresGhost', function(scaredGhost){
            // console.log('меня напугали и я получил id:'+scaredGhost);
            // if($('.score').html() > '0'){
                var now = $('.score').html()
                socket.emit('canGive',now)
                var minus = -1
                $('.score').html(parseInt(now)+parseInt(minus));
                $('.score').css('transform', 'scale(3)');
                $('.score').css('color', 'red');
                setTimeout(function() {
                    $('.score').css('transform', 'scale(1)');
                    $('.score').css('color', 'white');
                }, 100);
                
                var nameScore = document.getElementById('name').value;
                var countScore = document.getElementById('score').textContent;
                var score = {}
                score.name = nameScore
                score.count = countScore
                socket.emit('Score', score)
                
                $('html').css('cursor', "url('/images/ghost3.png'), auto");
                setTimeout(function() {
                    $('html').css('cursor', "url('/images/ghost1.png'), auto");
                }, 1000);
                // $('.content').html()+$('.content').append('<b>'+document.getElementById('name').value+': '+document.getElementById('score').textContent+'</b><br><br>');
            // }
        })
});