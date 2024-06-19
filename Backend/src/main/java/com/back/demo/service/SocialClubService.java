package com.back.demo.service;

import com.back.demo.model.SocialClub;
import com.back.demo.repository.SocialClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SocialClubService {

    @Autowired
    private SocialClubRepository socialClubRepository;

    public List<SocialClub> getAllSocialClubs() {
        return socialClubRepository.findAll();
    }

    public Optional<SocialClub> getSocialClubById(Long socialClubId) {
        return socialClubRepository.findById(socialClubId);
    }

    public SocialClub createSocialClub(SocialClub socialClub) {
        return socialClubRepository.save(socialClub);
    }

    public SocialClub updateSocialClub(Long socialClubId, SocialClub socialClubDetails) {
        Optional<SocialClub> optionalSocialClub = socialClubRepository.findById(socialClubId);
        if (optionalSocialClub.isPresent()) {
            SocialClub socialClub = optionalSocialClub.get();
            socialClub.setName(socialClubDetails.getName());
            socialClub.setDescription(socialClubDetails.getDescription());
            socialClub.setPictureLink(socialClubDetails.getPictureLink());
            socialClub.setSummaryDescription(socialClubDetails.getSummaryDescription());
            return socialClubRepository.save(socialClub);
        } else {
            throw new RuntimeException("SocialClub not found with id " + socialClubId);
        }
    }

    public void deleteSocialClub(Long socialClubId) {
        socialClubRepository.deleteById(socialClubId);
    }
}
