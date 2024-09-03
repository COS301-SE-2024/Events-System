package com.back.demo.controller;

import com.back.demo.model.SocialClub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.back.demo.servicebus.SocialClubServiceBus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/socialclubs")
public class SocialClubController {

    @Autowired
    private SocialClubServiceBus socialClubServiceBus;

    @GetMapping
    @Cacheable(value = "socialclubs", key = "#root.methodName")
    public List<SocialClub> getAllSocialClubs() {
        return socialClubServiceBus.getAllSocialClubs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocialClub> getSocialClubById(@PathVariable(value = "id") Long socialClubId) {
        Optional<SocialClub> socialClub = socialClubServiceBus.getSocialClubById(socialClubId);
        return socialClub.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public SocialClub createSocialClub(@RequestBody SocialClub socialClub) {
        return socialClubServiceBus.createSocialClub(socialClub);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocialClub> updateSocialClub(@PathVariable(value = "id") Long socialClubId,
                                                       @RequestBody SocialClub socialClubDetails) {
        try {
            SocialClub updatedSocialClub = socialClubServiceBus.updateSocialClub(socialClubId, socialClubDetails);
            return ResponseEntity.ok(updatedSocialClub);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SocialClub> partialUpdateSocialClub(@PathVariable(value = "id") Long socialClubId,
                                                              @RequestBody Map<String, Object> updates) {
        try {
            SocialClub updatedSocialClub = socialClubServiceBus.partialUpdateSocialClub(socialClubId, updates);
            return ResponseEntity.ok(updatedSocialClub);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocialClub(@PathVariable(value = "id") Long socialClubId) {
        try {
            socialClubServiceBus.deleteSocialClub(socialClubId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
