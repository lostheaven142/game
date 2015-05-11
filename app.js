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
        // socket.broadcast.emit("br", 'br');
        // socket.emit('em', 'em');
        
        //socket.broadcast.emit("CreateNewUser", data);
        gamers.push(infoNew);
        //socket.emit('AllGamers', gamers);
        //console.log(gamers);
        socket.emit("All users",gamers);
        socket.broadcast.emit("All users",[infoNew]);
        // if (gamers.length>0){
        //     for(var i=0;i<gamers.length;i++){
        //         console.log(1);
        //         var name = gamers[i].name;
        //         socket.emit("All users",name);
        //         socket.broadcast.emit("All users",name);
        //     }
        // }
        
    })
    setInterval(function() {
        socket.on('Rand', function(dat) {
            var ran = (Math.floor((Math.random() * 17) + 1));
            console.log(ran)
            socket.emit("All shadows",ran);
        })
    }, 3000);
    // socket.on("button_cliked", function(data){
    //     console.log("Button clicked on" + socket.id + "!!!");
    //     socket.broadcast.emit("incoming", data);
    //     console.log(util.inspect(data));
    // })
    socket.on('Coordinates', function(coordinate){
        socket.broadcast.emit('Coordinatess', coordinate);
    })
    socket.on('disconnect', function() {
        console.log(gamers);
        //console.log(socket.id);
        if(socket.id==undefined){
            console.log('игрок выходит');
            gamers=[];
        }
        for(var i=0;i<gamers.length;i++){
            if(gamers[i].id==socket.id){
                socket.broadcast.emit('disco',gamers[i].name);
                // delete gamers[i]
                console.log(gamers);
            }
        }
        // socket.broadcast.emit('disco','bye');
    })
    
    socket.on('new message', function(createNewMessage) {
        console.log("получил сообщение");
        socket.broadcast.emit('message for all', createNewMessage);
        console.log("отправил сообщение");
    })
})

server.listen(process.env.PORT, process.env.HOST);

console.log("server start http://node-lostheaven142.c9.io/");