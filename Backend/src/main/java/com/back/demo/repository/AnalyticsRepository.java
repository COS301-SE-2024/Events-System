package com.back.demo.repository;

import com.back.demo.model.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Integer> {

}
