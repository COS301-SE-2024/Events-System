package com.back.demo.servicebus;

import com.back.demo.model.SocialClub;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface SocialClubServiceBus {
    List<SocialClub> getAllSocialClubs();
    Optional<SocialClub> getSocialClubById(Long socialClubId);
    SocialClub createSocialClub(SocialClub socialClub);
    SocialClub updateSocialClub(Long socialClubId, SocialClub socialClubDetails);
    SocialClub partialUpdateSocialClub(Long socialClubId, Map<String, Object> updates);
    void deleteSocialClub(Long socialClubId);
} 
     