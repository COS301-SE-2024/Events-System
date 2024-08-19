package com.back.demo.repository;

import com.back.demo.model.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Integer> {
    Optional<Analytics> findByEmployeeId(Integer employeeId);
}
