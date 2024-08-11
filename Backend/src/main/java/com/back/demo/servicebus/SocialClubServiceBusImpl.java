package com.back.demo.servicebus;

import com.back.demo.model.SocialClub;
import com.back.demo.service.SocialClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SocialClubServiceBusImpl implements SocialClubServiceBus {

    @Autowired
    private SocialClubService socialClubService;

    @Override
    public List<SocialClub> getAllSocialClubs() {
        return socialClubService.getAllSocialClubs();
    }

    @Override
    public Optional<SocialClub> getSocialClubById(Long socialClubId) {
        return socialClubService.getSocialClubById(socialClubId);
    }

    @Override
    public SocialClub createSocialClub(SocialClub socialClub) {
        return socialClubService.createSocialClub(socialClub);
    }

    @Override
    public SocialClub updateSocialClub(Long socialClubId, SocialClub socialClubDetails) {
        return socialClubService.updateSocialClub(socialClubId, socialClubDetails);
    }

    @Override
    public SocialClub partialUpdateSocialClub(Long socialClubId, Map<String, Object> updates) {
        return socialClubService.partialUpdateSocialClub(socialClubId, updates);
    }

    @Override
    public void deleteSocialClub(Long socialClubId) {
        socialClubService.deleteSocialClub(socialClubId);
    }
}
