package org.streamreasoning.triplewave;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CSPARQLObserver
 */
@WebServlet("/ResultWriter/*")
public class ResultWriter extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String key = request.getPathInfo().substring(1);
		String value = request.getQueryString();
		
		ResultQueues._INSTANCE.addResult(key, value);
		doGet(request, response);
	}

}
