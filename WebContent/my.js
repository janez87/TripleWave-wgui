
var rspAddress = "http://localhost:8175/streams";
var queryAddress = "http://localhost:8175/queries";
var observeryAddress = "http://localhost:8175/observer";
var sgraphAddress = "http://131.175.141.249/TripleWave-transform/sgraph";
var observerCallback = "http://localhost:8080/triplewave-wgui/ResultWriter"
var resultUrl = "http://localhost:8080/triplewave-wgui/ResultReader"

var queries = {
		topUserWiki:"REGISTER QUERY topUserWiki AS " +
        "PREFIX prov:<http://www.w3.org/ns/prov#> " +
        "PREFIX sc:<https://schema.org/> " +
        "SELECT ?agent (COUNT(?t) AS ?c) " +
        "FROM STREAM <http://131.175.141.249/TripleWave-transform/sgraph> [RANGE 10s STEP 10s] " +
        "WHERE { " +
        "?t sc:agent ?agent " +
        "} " +
        "GROUP BY ?agent " +
        "ORDER BY desc(?c) " +
        "LIMIT 15",
        
		topPageWiki:"REGISTER QUERY topPageWiki AS " +
        "PREFIX prov:<http://www.w3.org/ns/prov#> " +
        "PREFIX sc:<https://schema.org/> " +
        "SELECT ?obj (COUNT(?t) AS ?c) " +
        "FROM STREAM <http://131.175.141.249/TripleWave-transform/sgraph> [RANGE 1m STEP 1m] " +
        "WHERE { " +
        "?t sc:object ?obj " +
        "FILTER (!contains(str(?obj), \"Special:Log\")) " +
        "} " +
        "GROUP BY ?obj " +
        "ORDER BY desc(?c) " +
        "LIMIT 15"
};

var load = function(query){
	
	var queryBody = queries[query]
	
	$("#query")[0].value=queryBody;
	console.log(queryBody)
	$("#queryName")[0].value = query;
	
}

var clearFields = function(){
	console.log("clearing")
	$("#query").html("")
	$("#queryName")[0].value = "";
}
var data = [];
var initStream = function () {

    var twAddress = $('#twUrl')[0].value;
    var ws = new ReconnectingWebSocket(twAddress);

    var $stream = $('#stream');
    ws.addEventListener('message', function (message) {

        if (data.length > 20) {
            var deleted = data.shift()
            var id = deleted["@id"].split("/")
            id = id[id.length-1]
            $stream.find("#"+id).remove()
        }
        
        var element = JSON.parse(message.data)
        var graphDiv = $('<div></div>')
        var id = element["@id"].split("/")
        id = id[id.length-1]
        graphDiv.attr("id",id)
        graphDiv.addClass("col-md-12")
        graphDiv.addClass("stream-element")
        graphDiv.text(message.data)
        data.push(element)
        $stream.append(graphDiv)
    })

    registerStream();
    $('#startStream')[0].disabled = true;

};


var registerStream = function () {

    $.ajax({
        url: rspAddress,
        method: 'PUT',
        headers: {
            "Cache": "no-cache",
        },
        data: {
            "streamIri": sgraphAddress
        }
    })
        .done(function (response) {
          
        })
        .fail(function (jqXHR, textStatus) {
            console.log(jqXHR)
            var error = "Error: " + jqXHR.responseText + "\nPlease raise you hand and wait for us";
            alert(error);

        })

    $('#response').html("Registering the stream..");

}


var createResultDiv = function(queryName){
	
	var div = $('<div class="row"><div class="col-md-10 response"><h3>'+queryName+'</h3><textarea id="'+queryName+'"></textarea></div></div>');
	
	var existingDiv = $('#'+queryName);
	
	if(existingDiv[0]==null){	
		$('#responseContainer').append(div);
	}
};

var registerQuery = function () {
    var queryName = $("#queryName")[0].value;

    //var queryContent =$('#query')[0].value.replace(/['"]+/g, '');
    var queryContent = queries[queryName]

    console.log(queryContent)
    console.log(queryName)
    $.ajax({
        url: queryAddress + '/' + queryName,
        method: 'PUT',
        headers: {
            "Cache": "no-cache"
        },
        data: queryContent
        })
        .done(function (response) {
            console.log(response)
            
            $.ajax({
            	url:response,
            	method:'POST',
            	headers: {
                    "Cache": "no-cache",
                    "content-type": "text/plain"
                },
                data:observerCallback+'/'+queryName
            })
            .done(function(response){
            	createResultDiv(queryName);
            	$('#'+queryName).html("Registering the query and waiting for results");
            
            	setInterval(getResults.bind(null,queryName),12000)
            })
            .fail(function (jqXHR, textStatus) {
            	createResultDiv(queryName);
            	$('#'+queryName).html("Registering the query and waiting for results");
            	
            	console.log(jqXHR)
	            var error = "Error: " + jqXHR.responseText + "\nPlease raise you hand and wait for a tutor";
	            $('#'+queryName).html(error);

            })    
        })
        .fail(function (jqXHR, textStatus) {
        	createResultDiv(queryName);
        	$('#'+queryName).html("Registering the query and waiting for results");
        	
        	console.log(jqXHR)
            var error = "Error: " + jqXHR.responseText + "\nPlease raise you hand and wait for a tutor";
            $('#'+queryName).html(error);


        })

}

/*var unregisterQuery = function(queryName){
	
	$.ajax({
		url:queryAddres+'/'+queryName,
		method:''
	})
}*/

var results = {};
var getResults = function(query){
	
	console.log(query)
	$.ajax({
		url:resultUrl+'?key='+query,
		method:'GET'
	})
	.done(function(response){
		if(!results[query]){
			results[query] = []
		}
		
		
		if(response && response!=="null"){		
			console.log(JSON.parse(response).results.bindings)
			results[query]=results[query].concat(JSON.parse(response).results.bindings);
		}
		
		console.log(results[query])
		$('#'+query).html(JSON.stringify(results[query]));
	})
	.fail(function (jqXHR, textStatus) {
            var error = "Error: " + textStatus + "\nPlease raise you hand and wait for a tutor";
            $('#response').html(error);

     })
}