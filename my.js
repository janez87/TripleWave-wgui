
var rspAddress = "http://localhost:8175/streams";
var queryAddress = "";
var sgraphAddress = "http://131.175.141.249/TripleWave-transform/sgraph";

var initStream = function () {
    var data = [];


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
    
    registerStream();
    
};


var registerStream = function(){

    /*$.ajax({
        url:rspAddress,
        method:'PUT',
        headers:{
            "Cache":"no-cache",
            "Access-Control-Allow-Origin":"*"
        },
        data:{
            "streamIri":sgraphAddress
        }
    })
    .done(function(response){
        $('#response').html(response);
    })
    .fail(function( jqXHR, textStatus){
        var error = "Error: " +textStatus+"\nPlease raise you hand and wait for a tutor";
        $('#response').html(error);

    })*/

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', rspAddress, true);
    xhr.setRequestHeader( "Cache", "no-cache" );
    xhr.send({ streamIri: sgraphAddress });

    xhr.onreadystatechange = function(){
         if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { 
             console.log(xhr.responseText); 
              $('#response').html(xhr.responseText);
        }else if(xhr.status !== 200){
            var error = "Error: " +xhr.responseText +','+ xhr.status +"\nPlease raise you hand and wait for a tutor";
            $('#response').html(error);


        }
    };
}


var registerQuery = function(){
    var queryName = "";
    
    $.ajax({
        url:queryAddress,
        method:'PUT',
        headers:{
            "Cache":"no-cache"
        },
        data:{
            "queryName":queryName
        }
    })
    .done(function(response){
        $('#response').html(response);
    })
    .fail(function( jqXHR, textStatus){
        var error = "Error: " +textStatus+"\nPlease raise you hand and wait for a tutor";
        $('#response').html(error);

    })
}