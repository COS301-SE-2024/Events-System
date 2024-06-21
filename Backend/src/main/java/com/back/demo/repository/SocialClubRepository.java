package com.back.demo.repository;

import com.back.demo.model.SocialClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialClubRepository extends JpaRepository<SocialClub, Long> {
}
