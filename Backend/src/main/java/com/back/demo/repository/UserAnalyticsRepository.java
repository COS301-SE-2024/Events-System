// Backend/src/main/java/com/back/demo/repository/UserAnalyticsRepository.java
package com.back.demo.repository;

import com.back.demo.model.UserAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAnalyticsRepository extends JpaRepository<UserAnalytics, Integer> {
}