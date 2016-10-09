
var rspAddress = "http://localhost:8175/streams";
var queryAddress = "http://localhost:8175/queries";
var sgraphAddress = "http://131.175.141.249/TripleWave-transform/sgraph";

var initStream = function () {
    var data = [];

    var twAddress = $('#twUrl')[0].value;
    var ws = new WebSocket(twAddress);

    var $stream = $('#stream');
    ws.addEventListener('message', function (message) {

        if (data.length > 20) {
            data.shift();
        }

        data.push(message.data)
        $stream[0].value = data.join('\n');
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
            $('#response').html(response);
        })
        .fail(function (jqXHR, textStatus) {
            console.log(jqXHR)
            var error = "Error: " + jqXHR.responseText + "\nPlease raise you hand and wait for us";
            $('#response').html(error);

        })

    $('#response').html("Registering the stream..");

}


var registerQuery = function () {
    var queryName = "topUserWiki";

    var queryContent = "REGISTER QUERY topUserWiki AS " +
        "PREFIX prov:<http://www.w3.org/ns/prov#> " +
        "PREFIX sc:<https://schema.org/> " +
        "SELECT ?agent (COUNT(?t) AS ?c) " +
        "FROM STREAM <http://131.175.141.249/TripleWave-transform/sgraph> [RANGE 1m STEP 1m] " +
        "WHERE { " +
        "?t sc:agent ?agent " +
        "} " +
        "GROUP BY ?agent " +
        "ORDER BY desc(?c) " +
        "LIMIT 15";


    $.ajax({
        url: queryAddress + '/' + queryName,
        method: 'PUT',
        headers: {
            "Cache": "no-cache"
        },
        data: queryContent
        })
        .done(function (response) {
            $('#response').html(response);
        })
        .fail(function (jqXHR, textStatus) {
            var error = "Error: " + textStatus + "\nPlease raise you hand and wait for a tutor";
            $('#response').html(error);

        })
    $('#query').html(queryContent);

}