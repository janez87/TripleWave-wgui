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
@WebServlet("/ResultReader")
public class ResultReader extends HttpServlet {
	private static final long serialVersionUID = 8371168544475096286L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String key = request.getParameter("key");
		String result = ResultQueues._INSTANCE.pull(key);
		response.getWriter().print(result);
	}

}
