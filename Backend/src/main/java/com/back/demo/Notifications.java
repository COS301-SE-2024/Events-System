package com.back.demo;

public class Notifications {
	private int count;
	private String message;

	public Notifications(int count, String message) {
		this.count = count;
		this.message = message;
	}

	public void increment() {
		this.count++;
	}

	public int getCount() {
		return count;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
