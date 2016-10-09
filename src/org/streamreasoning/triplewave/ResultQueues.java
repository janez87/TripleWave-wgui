package org.streamreasoning.triplewave;

import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

public class ResultQueues {
	private Map<String, Queue<String>> queues;
	
	public final static ResultQueues _INSTANCE =  new ResultQueues();
	
	private ResultQueues(){
		queues = new HashMap<String, Queue<String>>();
	}
	
	public void createQueue(String key){
		queues.put(key, new LinkedBlockingQueue<String>());
	}
	
	public void addResult(String key, String e){
		if(!queues.containsKey(e)){
			createQueue(key);
		}
		queues.get(e).add(e);
	}
	
	public String pull(String key){
		return queues.get(key).poll();
	}
}
