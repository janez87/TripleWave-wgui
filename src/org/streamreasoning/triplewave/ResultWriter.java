package org.streamreasoning.triplewave;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebServlet("/ResultWriter/*")
public class ResultWriter extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(ResultWriter.class);
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String key = request.getPathInfo().substring(1);
		BufferedReader reader = request.getReader();
		StringBuilder value = new StringBuilder();
		String line;
		while((line  = reader.readLine()) != null)
			value.append(line);
		
		logger.debug("A new value for {} has to be inserted: {}", key, value);
		
		ResultQueues._INSTANCE.addResult(key, value.toString());
		doGet(request, response);
	}

}
