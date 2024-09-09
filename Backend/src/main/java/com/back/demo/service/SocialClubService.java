package com.back.demo.service;

import com.back.demo.model.SocialClub;
import com.back.demo.repository.SocialClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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

    @CacheEvict(value = "socialclubs", key = "'getAllSocialClubs'")
    public SocialClub createSocialClub(SocialClub socialClub) {
        return socialClubRepository.save(socialClub);
    }

    @CacheEvict(value = "socialclubs", key = "'getAllSocialClubs'")
    public SocialClub updateSocialClub(Long socialClubId, SocialClub socialClubDetails) {
        Optional<SocialClub> optionalSocialClub = socialClubRepository.findById(socialClubId);
        if (optionalSocialClub.isPresent()) {
            SocialClub socialClub = optionalSocialClub.get();
            socialClub.setOwnerID(socialClubDetails.getOwnerID());
            socialClub.setName(socialClubDetails.getName());
            socialClub.setDescription(socialClubDetails.getDescription());
            socialClub.setPictureLink(socialClubDetails.getPictureLink());
            socialClub.setSummaryDescription(socialClubDetails.getSummaryDescription());
            socialClub.setCategories(socialClubDetails.getCategories());
            return socialClubRepository.save(socialClub);
        } else {
            throw new RuntimeException("Social Club not found with id " + socialClubId);
        }
    }

    @CacheEvict(value = "socialclubs", key = "'getAllSocialClubs'")
    public SocialClub partialUpdateSocialClub(Long socialClubId, Map<String, Object> updates) {
        Optional<SocialClub> optionalSocialClub = socialClubRepository.findById(socialClubId);
        if (optionalSocialClub.isPresent()) {
            SocialClub socialClub = optionalSocialClub.get();
            updates.forEach((key, value) -> {
                switch (key) {
                    case "name":
                        socialClub.setName((String) value);
                        break;
                    case "ownerID":
                        socialClub.setOwnerID((Long) value);
                        break;
                    case "description":
                        socialClub.setDescription((String) value);
                        break;
                    case "pictureLink":
                        socialClub.setPictureLink((String) value);
                        break;
                    case "summaryDescription":
                        socialClub.setSummaryDescription((String) value);
                        break;
                    case "categories":
                        socialClub.setCategories(convertToStringArray(value));
                        break;
                    default:
                        throw new IllegalArgumentException("Invalid attribute: " + key);
                }
            });
            return socialClubRepository.save(socialClub);
        } else {
            throw new RuntimeException("Social Club not found with id " + socialClubId);
        }
    }

    private String[] convertToStringArray(Object value) {
        if (value instanceof List) {
            List<?> list = (List<?>) value;
            return list.toArray(new String[0]);
        } else if (value instanceof String[]) {
            return (String[]) value;
        } else {
            throw new IllegalArgumentException("Expected value to be a list or array of strings");
        }
    }

    @CacheEvict(value = "socialclubs", key = "'getAllSocialClubs'")
    public void deleteSocialClub(Long socialClubId) {
        socialClubRepository.deleteById(socialClubId);
    }
}
