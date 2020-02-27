
    var map = {
        width: 800,
        height: 600
    };

    var maxRtmRatio    = 0.75;
    var maxNumRooms    = 5;

    var numberOfRooms  = Math.floor(Math.random() * maxNumRooms) + 1;
    var maxUsableArea  = Math.floor(map.height * map.width * maxRtmRatio);
    
    console.log('numberOfRooms ' + numberOfRooms);
    console.log('maxUsableArea ' + maxUsableArea);

    var minRoomSize    = 36;
    var maxRoomSize    = Math.floor(Math.min(map.width, map.height) * maxRtmRatio);

    var rooms          = [];

    var canvas         = self.mapCanvas.getContext("2d");
    canvas.strokeStyle = "#009900";
    canvas.fillStyle   = "#556B2F";

    var roomImg = new Image();
    roomImg.src = "./assets/img/background.png"; 
    roomImg.onload = () => { createRooms(); };

    var connectionPointImg = new Image();
    connectionPointImg.src = "./assets/img/connectionPoint.png"; 
    
    function createRooms(){

        var timesInLoop = 0;

        while(rooms.length <= numberOfRooms && timesInLoop < 100) {
            timesInLoop++;

            var neoRoom = {};
            neoRoom.id         = Math.floor(Math.random() * Math.pow(2, 32)) + Math.pow(2, 32);
            neoRoom.width      = Math.floor(Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize;
            neoRoom.height     = Math.floor(Math.random() * (maxRoomSize - minRoomSize)) + minRoomSize;
            neoRoom.x1         = Math.floor(Math.random() * (map.width - neoRoom.width - 1));
            neoRoom.y1         = Math.floor(Math.random() * (map.height - neoRoom.height - 1));
            neoRoom.x2         = neoRoom.x1 + neoRoom.width;
            neoRoom.y2         = neoRoom.y1 + neoRoom.height;
            neoRoom.aspect     = Math.floor((Math.min(neoRoom.width, neoRoom.height) / Math.max(neoRoom.width, neoRoom.height)) * 1000) / 1000;
            neoRoom.centerX    = Math.floor((neoRoom.x1 + neoRoom.x2) / 2);
            neoRoom.centerY    = Math.floor((neoRoom.y1 + neoRoom.y2) / 2);
            neoRoom.hypotenuse = Math.floor((Math.sqrt((neoRoom.width * neoRoom.width) + (neoRoom.height * neoRoom.height))) * 1000) / 1000;
            neoRoom.connectionPoints = [];


            // Add connection points
            var cp_x = 0;
            var cp_y = 0;
            var cp_spacing = 24;

            // Top Border
            cp_y = 0;
            for(cp_x = 0; cp_x < neoRoom.width; cp_x += cp_spacing) {
                neoRoom.connectionPoints.push({x: cp_x, y: cp_y});
            }

            // Left Side
            cp_x = 0;
            for(cp_y = 0; cp_y < neoRoom.height; cp_y += cp_spacing) {
                neoRoom.connectionPoints.push({x: cp_x, y: cp_y});
            }

            // Bottom Border
            cp_y = neoRoom.height;
            for(cp_x = 0; cp_x < neoRoom.width; cp_x += cp_spacing) {
                neoRoom.connectionPoints.push({x: cp_x, y: cp_y});
            }

            // Right Side
            cp_x = neoRoom.width;
            for(cp_y = 0; cp_y < neoRoom.height; cp_y += cp_spacing) {
                neoRoom.connectionPoints.push({x: cp_x, y: cp_y});
            }



            // no intersects
            var doesNotIntersect = true;
            rooms.forEach(
                (room, index) => {
                    var adx = Math.abs(neoRoom.centerX - room.centerX);
                    var ady = Math.abs(neoRoom.centerY - room.centerY);
                    var mdx = (neoRoom.width / 2)  + (room.width / 2)  + 20;
                    var mdy = (neoRoom.height / 2) + (room.height / 2) + 20;
                    if(adx <= mdx && ady <= mdy){
                        doesNotIntersect = false;
                    }
                }
            );

            // TODO check for too close to border

            // no too wide or too narrow rooms
            var doesNotMalform = (neoRoom.aspect > 0.2);


            if(doesNotIntersect && doesNotMalform){
                var previousRoom = null;
                if(rooms.length > 0){
                    previousRoom = rooms[rooms.length -1];
                }
                rooms.push(neoRoom);
                canvas.fillRect(neoRoom.x1, neoRoom.y1, neoRoom.width, neoRoom.height);
                canvas.stroke();
                console.log('room added', neoRoom);

                // make cooridors
                var horCoorFunc = function (xa, xb, y){
                    canvas.beginPath();
                    canvas.strokeStyle = "#556B2F";
                    canvas.lineWidth = 12;
                    canvas.moveTo(Math.min(xa, xb) - 6, y);
                    canvas.lineTo(Math.max(xa, xb) + 6, y);
                    canvas.stroke();						
                }
                var verCoorFunc = function (ya, yb, x){
                    canvas.beginPath();
                    canvas.strokeStyle = "#556B2F";
                    canvas.lineWidth = 12;
                    canvas.moveTo(x, Math.min(ya, yb) - 6);
                    canvas.lineTo(x, Math.max(ya, yb) + 6);
                    canvas.stroke();	
                }

                if(previousRoom){
                    if(Math.round(Math.random())) {
                        // horizontal first
                        horCoorFunc(previousRoom.centerX, neoRoom.centerX, previousRoom.centerY);
                        verCoorFunc(previousRoom.centerY, neoRoom.centerY, neoRoom.centerX);

                        console.log('hor', previousRoom.centerX, neoRoom.centerX, previousRoom.centerY);
                        console.log('ver', previousRoom.centerY, neoRoom.centerY, previousRoom.centerX);
                    }
                    else {
                        // vertical first
                        verCoorFunc(previousRoom.centerY, neoRoom.centerY, neoRoom.centerX);
                        horCoorFunc(previousRoom.centerX, neoRoom.centerX, previousRoom.centerY);

                        console.log('ver', previousRoom.centerY, neoRoom.centerY, previousRoom.centerX);
                        console.log('hor', previousRoom.centerX, neoRoom.centerX, previousRoom.centerY);
                    }
                }
            }
        }

        rooms.forEach(
            (room, index) => {
                var mx = 40;
                var my = 30;
                canvas.drawImage(roomImg, (index * mx), (index * my), room.width, room.height, room.x1, room.y1, room.width, room.height);

                room.connectionPoints.forEach(connectionPoint => {
                    canvas.drawImage(connectionPointImg, connectionPoint.x + room.x1 - 3, connectionPoint.y + room.y1 - 3);
                });
            }
        );			
    }
    

    

