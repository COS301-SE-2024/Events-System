package com.back.demo.repository;

import com.back.demo.model.EventRSVP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRSVPRepository extends JpaRepository<EventRSVP, Long> {
    List<EventRSVP> findByEmployeeIdAndStatus(Long employeeId, String status);
    List<EventRSVP> findByEventId(Integer eventId);
    Optional<EventRSVP> findByEmployeeIdAndEventId(Integer employeeId, Integer eventId);
}
