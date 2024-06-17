package com.back.demo.controller;

import com.back.demo.model.SocialClub;
import com.back.demo.service.SocialClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/socialclubs")
public class SocialClubController {

    @Autowired
    private SocialClubService socialClubService;

    @GetMapping
    public List<SocialClub> getAllSocialClubs() {
        return socialClubService.getAllSocialClubs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocialClub> getSocialClubById(@PathVariable(value = "id") Long socialClubId) {
        Optional<SocialClub> socialClub = socialClubService.getSocialClubById(socialClubId);
        return socialClub.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public SocialClub createSocialClub(@RequestBody SocialClub socialClub) {
        return socialClubService.createSocialClub(socialClub);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SocialClub> updateSocialClub(@PathVariable(value = "id") Long socialClubId,
                                                       @RequestBody SocialClub socialClubDetails) {
        try {
            SocialClub updatedSocialClub = socialClubService.updateSocialClub(socialClubId, socialClubDetails);
            return ResponseEntity.ok(updatedSocialClub);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocialClub(@PathVariable(value = "id") Long socialClubId) {
        try {
            socialClubService.deleteSocialClub(socialClubId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
