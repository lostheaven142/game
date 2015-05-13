$( document ).ready(function() {
    var socket = io.connect('http://node-lostheaven142.c9.io/')
        
    $('.post').on('click', function(){
        $('.comment').val()
        socket.emit('new message', {user:document.getElementById('name').value,message:$('.comment').val()})
        $('.content').html()+$('.content').append('<b>'+document.getElementById('name').value+'</b>: <p>'+$('.comment').val()+'</p><br><br>')
        $('.comment').val('')
        console.log($('.comment').val())
    })
    socket.on('message for all', function(createNewMessage){
        $('.content').html()+$('.content').append('<b>'+createNewMessage.user+'</b>: <p>'+createNewMessage.message+'</p><br><br>')
    })
    $('.button').on('click', function(event){
        var myTextField = document.getElementById('name');
	    socket.emit('New', myTextField.value)
	    socket.on('All users', function(name){
	        
	       console.log(name)
	       for (var i=0;i<name.length;i++){
	           var div = document.createElement('div');
    	       div.id = name[i].name;
    	       div.className = "ghost"; 
    	       div.innerText = "I'm a "+name[i].name;
    	       $('body').append(div);
    	       $('.content').html()+$('.content').append('<b>Hello, ' +name[i].name+' !</b><br><br>');
	       }
	    })
        $('form').animate({opacity:0}, 500);
        $('.chat').animate({opacity:1, zIndex:10}, 500);
        $('.score').animate({opacity:1}, 500);
 
        socket.on('Coordinatess', function(coordinate){
            console.log('получаю чужие координаты');
            $('#'+coordinate.name).css('left',coordinate.left+'px').css('top',coordinate.top+'px');
        })
        socket.on('disco', function(evilMan){
            console.log(evilMan);
            $('.content').html()+$('.content').append('<b>' +evilMan+' is died</b><br><br>');
            $('#'+evilMan).remove();
            $('#'+evilMan).css('opacity',0);
        })
        $(window).on('mousemove', function(e){
            var left = e.pageX+20;
            var top = e.pageY+20;
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
                var now = $('.score').html()
                var plus = 1
                $('.score').html(parseInt(now)+parseInt(plus));
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
                var now = $('.score').html()
                var minus = 1
                $('.score').html(parseInt(now)-parseInt(minus));
                socket.emit('Click','box'+randomOb.forBox);
                
                var nameScore = document.getElementById('name').value;
                var countScore = document.getElementById('score').textContent;
                var score = {}
                score.name = nameScore
                score.count = countScore
                socket.emit('Score', score)
                
                setTimeout(function() {
                    $('.box'+randomOb.forBox).animate({opacity:0}, 300);
                    $('.box'+randomOb.forBox).removeClass('elem3')
                }, 300);
                v = v+1
            }
            else{
                $('.score').html()
            }
        });
        
        socket.on('Delete', function(del) {
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
        $('.content').html()+$('.content').append('<b>'+score.name+' : '+score.count+'</b><br><br>');
    })
});