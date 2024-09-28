package com.back.demo.controller;

import com.back.demo.service.DialogflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.io.IOException;
import java.io.StringReader;

@RestController
@RequestMapping("/api/dialogflow")
public class DialogflowController {
    @Autowired
    private DialogflowService dialogflowService;

    @PostMapping("/detectIntent")
    public String detectIntent(@RequestBody Map<String, String> payload) throws IOException {
        String text = payload.get("text");
        String sessionId = payload.get("sessionId");
        int userID = Integer.parseInt(payload.get("userID"));
        String intentResponse = dialogflowService.detectIntentTexts(text, sessionId, userID);
        return intentResponse;
    }

    @PostMapping("/localdetectIntent")
    public String localdetectIntent(@RequestBody Map<String, String> payload) throws IOException {
        String text = payload.get("text");
        String sessionId = payload.get("sessionId");
        int userID = Integer.parseInt(payload.get("userID"));
        Double latitude = Double.parseDouble(payload.get("latitude"));
        System.out.println(latitude);
        Double longitude = Double.parseDouble(payload.get("longitude"));
        System.out.println(longitude);
        String intentResponse = dialogflowService.localdetectIntentTexts(text, sessionId, userID, latitude, longitude);
        return intentResponse;
    }
}