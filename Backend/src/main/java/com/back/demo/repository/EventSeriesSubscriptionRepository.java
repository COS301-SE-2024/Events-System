package com.back.demo.repository;

import com.back.demo.model.EventSeriesSubscription;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSeriesSubscriptionRepository extends JpaRepository<EventSeriesSubscription, Long> {
    List<EventSeriesSubscription> findBySeriesId(Long seriesId);

}