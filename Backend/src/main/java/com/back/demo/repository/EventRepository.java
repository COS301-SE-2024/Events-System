package com.back.demo.repository;

import com.back.demo.model.Event;
import com.back.demo.model.Token;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query(value = """
      select e from Event e
      where e.hostId = :id
      """)
    List<Event> findAllHostEvents(@Param("id") Long employeeId);
}