var rspAddress = "http://localhost:8175/streams";
var queryAddress = "http://localhost:8175/queries";
var observeryAddress = "http://localhost:8175/observer";
var sgraphAddress = "http://192.168.1.199:4000/sgraph";
var observerCallback = "http://localhost:8080/triplewave-wgui/ResultWriter"
var resultUrl = "http://localhost:8080/triplewave-wgui/ResultReader"

var correctQueries = {
	query1 : "REGISTER QUERY query1 AS PREFIX ldbc:<http://www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/> SELECT DISTINCT ?p FROM STREAM <http://192.168.1.199:4000/sgraph> [RANGE 30s STEP 30s] WHERE {?p a ldbc:Person }",

	query2 : "REGISTER QUERY query2 AS PREFIX ldbc:<http://www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/> SELECT DISTINCT ?p (COUNT(*) AS ?f) FROM STREAM <http://192.168.1.199:4000/sgraph> [ RANGE 60s STEP 10s] WHERE { ?a ldbc:follows ?p} GROUP BY ?p ORDER BY DESC(?f)  LIMIT 5",

	query3 : "REGISTER QUERY query3 AS PREFIX ldbc:<http://www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/> SELECT ?t (COUNT(*) as ?total) FROM STREAM <http://192.168.1.199:4000/sgraph> [RANGE 60s STEP 10s] WHERE { { ?c ldbc:hasTag ?t } UNION { ?f ldbc:hasInterest ?t}} GROUP BY ?t ORDER BY DESC(?total) LIMIT 5",

};

var queries = {
	query1 : "PREFIX ldbc:<http://www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/> SELECT DISTINCT ?p FROM STREAM <http://192.168.1.199:4000/sgraph> [RANGE 30s STEP 30s] WHERE {?p a ldbc:Person }",
	query2 : "REGISTER QUERY query2 AS PREFIX ldbc:<http://www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/> SELECT DISTINCT ?p (COUNT(*) AS ?f) FROM STREAM <http://192.168.1.199:4000/sgraph> WHERE { ?a ldbc:follows ?p} GROUP BY ?p ORDER BY DESC(?f)  LIMIT 5",
	query3 : "REGISTER QUERY query3 AS PREFIX ldbc:<http://www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/> SELECT ?t (COUNT(*) as ?total) FROM STREAM <http://192.168.1.199:4000/sgraph> [RANGE 60s STEP 10s] WHERE { { ?c ldbc:hasTag ?t } UNION { ?f ldbc:hasInterest ?t}} ORDER BY DESC(?total) LIMIT 5",
}

var load = function(query) {

	var queryBody = queries[query]

	$("#query")[0].value = queryBody;
	console.log(queryBody)
	$("#queryName")[0].value = query;

}

var clearFields = function() {
	console.log("clearing")
	$("#query").html("")
	$("#queryName")[0].value = "";
}
var initStream = function() {
	var data = [];

	var twAddress = $('#twUrl')[0].value;
	var ws = new WebSocket(twAddress);

	var $stream = $('#stream');
	ws.addEventListener('message', function(message) {

		if (data.length > 20) {
			data.shift();
		}

		data.push(message.data)
		$stream[0].value = data.join('\n');
	})

	registerStream();
	$('#startStream')[0].disabled = true;

};

var registerStream = function() {

	$.ajax({
		url : rspAddress,
		method : 'PUT',
		headers : {
			"Cache" : "no-cache",
		},
		data : {
			"streamIri" : sgraphAddress
		}
	}).done(function(response) {

	}).fail(
			function(jqXHR, textStatus) {
				console.log(jqXHR)
				var error = "Error: " + jqXHR.responseText
						+ "\nPlease raise you hand and wait for us";
				$('#response').html(error);

			})

	$('#response').html("Registering the stream..");

}

var createResultDiv = function(queryName) {

	var div = $('<div class="row"><div class="col-md-10 response"><h3>'
			+ queryName + '</h3><textarea id="' + queryName
			+ '"></textarea></div></div>');

	var existingDiv = $('#' + queryName);

	if (existingDiv[0] == null) {
		$('#responseContainer').append(div);
	}
};

var registerQuery = function() {
	var queryName = $("#queryName")[0].value;

	var queryContent = $('#query')[0].value.replace(/['"]+/g, '');
	// var queryContent = queries[queryName]

	console.log(queryContent)
	console.log(queryName)
	$
			.ajax({
				url : queryAddress + '/' + queryName,
				method : 'PUT',
				headers : {
					"Cache" : "no-cache"
				},
				data : queryContent
			})
			.done(
					function(response) {
						console.log(response)

						$
								.ajax({
									url : response,
									method : 'POST',
									headers : {
										"Cache" : "no-cache",
										"content-type" : "text/plain"
									},
									data : observerCallback + '/' + queryName
								})
								.done(
										function(response) {
											createResultDiv(queryName);
											$('#'+queryName).html("Registering tje query and waiting for results");
											
											setInterval(getResults.bind(null,
													queryName), 12000)
										})
								.fail(
										function(jqXHR, textStatus) {
											createResultDiv(queryName);
											
											console.log(jqXHR)
											var error = "Error: "
													+ jqXHR.responseText
													+ "\nPlease raise you hand and wait for a tutor";
											$('#' + queryName).html(error);

										})
					})
			.fail(
					function(jqXHR, textStatus) {
						createResultDiv(queryName);

						console.log(jqXHR)
						var error = "Error: "
								+ jqXHR.responseText
								+ "\nPlease raise you hand and wait for a tutor";
						$('#' + queryName).html(error);

					})
	;

}

var results = {};
var getResults = function(query) {

	console.log("Getting the results for query: " + query)
	$.ajax({
		url : resultUrl + '?key=' + query,
		method : 'GET'
	}).done(
			function(response) {
				if (!results[query]) {
					results[query] = []
				}

				if (response && response !== "null") {
					results[query] = results[query]
							.concat(JSON.parse(response).results.bindings);
				}
				$('#' + query).html(JSON.stringify(results[query]));
			}).fail(
			function(jqXHR, textStatus) {
				var error = "Error: " + textStatus
						+ "\nPlease raise you hand and wait for a tutor";
				$('#response').html(error);

			})
}