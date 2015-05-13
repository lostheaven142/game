var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    util = require('util'),
    jade = require('jade'),
    routing  = require('./routing'),
    
    gamers = [];


app.set('views', './views');
// app.set('javascript', './javasctipt');
app.set('view engine', 'jade');
// открыли доступ к view, обработка файлов jade
app.use(express.static("assets"));
// открыли папку assets для доступа к картинкам, стилям и скриптам
app.get('/', function(req,res){
    res.render('index');
});

// выдача html




io.on("connection", function(socket){
    console.log(socket.id + "connected")
    
    socket.on('New', function(data) {
        var infoNew = {};
        infoNew.name = data;
        infoNew.id = socket.id;
        gamers.push(infoNew);
        socket.emit("All users",gamers);
        socket.broadcast.emit("All users",[infoNew]);
    })
    
    socket.on('Coordinates', function(coordinate){
        socket.broadcast.emit('Coordinatess', coordinate);
    })
    // socket.on('disconnect', function() {
    //     console.log(gamers);
    //     //console.log(socket.id);
    //     if(socket.id==undefined){
    //         console.log('игрок выходит');
    //         gamers=[];
    //     }
    //     for(var i=0;i<gamers.length;i++){
    //         if(gamers[i].id==socket.id){
    //             socket.broadcast.emit('disco',gamers[i].name);
    //             // delete gamers[i]
    //             console.log(gamers);
    //         }
    //     }
    //     // socket.broadcast.emit('disco','bye');
    // })
    
    socket.on('new message', function(createNewMessage) {
        // console.log("получил сообщение");
        socket.broadcast.emit('message for all', createNewMessage);
        // console.log("отправил сообщение");
    })
    socket.on('Click', function(del){
        // console.log(del);
        io.sockets.emit('Delete',del);
    })
    socket.on('Score', function(score){
        // console.log(score)
        socket.broadcast.emit('Score',score);
    })
    
    
    socket.on('disconnect', function() {
        console.log(gamers.indexOf(socket.id));
        console.log(gamers);
        for(var i=0;i<gamers.length;i++){
            if(gamers[i].id==socket.id){
                socket.broadcast.emit('disco',gamers[i].name);
                gamers.splice(gamers.indexOf(gamers[i]),1);
                // delete gamers[i]
                console.log(gamers);
            }
        }
    });
    
    
    
    
    
    
})

setInterval(function(){
        // console.log('send '+(new Date()));
        var ran = (Math.floor((Math.random() * 17) + 1));
        var ranOb = (Math.floor((Math.random() * 2) + 1));
        var randomOb = {};
        randomOb.forBox = ran;
        randomOb.forOb = ranOb;
        // console.log(ran);
        io.sockets.emit('smth',randomOb);
},3000);


server.listen(process.env.PORT, process.env.HOST);

console.log("server start http://node-lostheaven142.c9.io/");