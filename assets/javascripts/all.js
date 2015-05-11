// $(function() {
//     function First() {
//         this.object = {
//             x:0,
//             y:0
//         };
//     }
//     First.prototype.lolwat = function(){
//         var X = this.object.x + 100
//         var Y = this.object.y
//         console.log(X, Y)
//     }
    
//     var Second = new First()
//     Second.lolwat()
// });

$( document ).ready(function() {
    var socket = io.connect('http://node-lostheaven142.c9.io/')
        // socket.on('AllGamers', function(data){console.log(data)})
        // socket.on('CreateNewUser', function(data){console.log(data)})
        
    $('.post').on('click', function(){
        $('.comment').val()
        // console.log($('.comment').val())
        socket.emit('new message', {user:document.getElementById('name').value,message:$('.comment').val()})  //////////!!!!!!!!!!!!
        socket.on('message for all', function(createNewMessage){
            $('.content').html()+$('.content').append('<b>'+createNewMessage.user+'</b>: <p>'+createNewMessage.message+'</p><br><br>')
        })   ///////////!!!!!!!!!!
        // $('.content').html(document.getElementById('name').value+': '+$('.comment').val())
        $('.content').html()+$('.content').append('<b>'+document.getElementById('name').value+'</b>: <p>'+$('.comment').val()+'</p><br><br>')
        $('.comment').val('')
        console.log($('.comment').val())
    })
    $('.button').on('click', function(event){
        var myTextField = document.getElementById('name');
	       // myTextField.value
	       // console.log(myTextField.value);
	    socket.emit('New', myTextField.value)
	    
	   // socket.on('br', function(name){console.log('here broadcast')})
	   // socket.on('em', function(name){console.log('here emit')})
	    
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
    	       // if($('#'+name).length>0){return};
    	       // var div = document.createElement('div');
    	       // div.id = name;
    	       // div.className = "ghost"; 
    	       // div.innerText = "I'm a "+name;
    	       // $('body').append(div);
	    })
        // $('.ghost').html("I'm a "+myTextField.value)
        $('form').animate({opacity:0}, 500);
        $('.chat').animate({opacity:1, zIndex:10}, 500);
        $('.score').animate({opacity:1}, 500);
        // var divChat = document.createElement('div');
    	   //    divChat.className = "chat";
    	   //    $('body').append(divChat);
    	   
        // var div = document.createElement('div');
	       // div.id = myTextField.value;
	       // div.className = "ghost"; 
	       // div.innerText = "I'm a "+myTextField.value;
	       // $('body').append(div);
	   // $('form').remove();  
        socket.on('Coordinatess', function(coordinate){
            console.log('получаю чужие координаты');
            $('#'+coordinate.name).css('left',coordinate.left+'px').css('top',coordinate.top+'px');
        })
        socket.on('disco', function(evilMan){
            console.log(evilMan);
            $('.content').html()+$('.content').append('<b>' +evilMan+' is died</b><br><br>');
            $('#'+evilMan).remove();
            // $('#'+evilMan).css('opacity',0);
        })
        $(window).on('mousemove', function(e){
            var left = e.pageX+20;
            var top = e.pageY+20;
            // console.log(e.pageX, e.pageY);
            // $('body').append( $('.ghost'));
            // $('.ghost').animate({opacity:1, top:''+ event.pageX+'px', left:''+event.pageY+'px' }, 100);
            $('#'+myTextField.value).css('left',left+'px').css('top',top+'px');
            // $('.ghost').animate({opacity:0.6, queue:false}, 100);
            socket.emit('Coordinates',{left:left,top:top,name:myTextField.value});
            
        })
    })
    setInterval(function() {
	        socket.emit('Rand','lol')
    }, 5000);
	   setInterval(function() {
	    socket.on('All shadows', function(now){
            console.log(now)
            $('.box'+ now).addClass('elem'+(Math.floor((Math.random() * 2) + 1)) );
            $('.box'+ now).animate({opacity:1}, 500);
            // $('.man').on('click', function() {
            //     console.log('+1')
            // })
            // $('.cat').on('click', function() {
            //     // $('.cat').css('background-image','url(/images/catangry.png) no-repeat')
            //     $(this).addClass("catangry");  
            //     $(this).removeClass("cat"); 
            //     var audio = new Audio();
            //     audio.src = '/images/cat.mp3';
            //     audio.autoplay = true;
            //     console.log('-1')
            // });
            setTimeout(function() {
                setTimeout(function() {
                    $('.box'+ now).removeClass("elem1");
                    $('.box'+ now).removeClass("elem2");
                    $('.box'+ now).removeClass("elem3");
                }, 800);
                $('.box'+ now).animate({opacity:0}, 500);
            }, 2000);
        })
	}, 3000);
});