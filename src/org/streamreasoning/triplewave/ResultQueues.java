package org.streamreasoning.triplewave;

import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResultQueues {
	private Map<String, Queue<String>> queues;
	private static final Logger logger = LoggerFactory.getLogger(ResultQueues.class); 
	
	private static ResultQueues _INSTANCE;
	
	
	private ResultQueues(){
		queues = new HashMap<String, Queue<String>>();
	}
	
	public static ResultQueues getInstance(){
		if(_INSTANCE==null){
			_INSTANCE = new ResultQueues();
		}
		return _INSTANCE;
	}
	
	public void createQueue(String key){
		queues.put(key, new LinkedBlockingQueue<String>());
	}
	
	public void addResult(String key, String e){
		if(!queues.containsKey(e)){
			logger.debug("It is the first invocation for {}, creating the new queue");
			createQueue(key);
		}
		queues.get(key).add(e);
	}
	
	public String pull(String key){
		logger.debug("New element requested for the queue with querId {}", key);
		return queues.get(key).poll();
	}
}
