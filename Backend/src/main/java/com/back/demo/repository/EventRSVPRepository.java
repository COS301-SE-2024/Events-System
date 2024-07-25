package com.back.demo.repository;

import com.back.demo.model.EventRSVP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRSVPRepository extends JpaRepository<EventRSVP, Long> {
    // Additional query methods can be defined here if needed
}
