
var data = [];
var initStream = function () {


    //var twAddress = "ws://131.175.141.249/TripleWave-transform/ws/stream";
    //var twAddress = "ws://131.175.141.249/TripleWave-new/primus";

    var twAddress = $('#twUrl')[0].value;
    var ws = new WebSocket(twAddress);

    var $stream = $('#stream');
    ws.addEventListener('message',function(message){
        
        if(data.length>20){
            data.pop();
        }

        data.push(message.data)
        $stream[0].value=data.join('\n');
    })

    
};

