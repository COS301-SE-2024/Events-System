package com.back.demo.repository;

import com.back.demo.model.EventSeries;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSeriesRepository extends JpaRepository<EventSeries, Long> {
    List<EventSeries> findByHostId(Integer hostId);

}