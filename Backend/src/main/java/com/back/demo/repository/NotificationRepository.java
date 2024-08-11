package com.back.demo.repository;

import com.back.demo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEmployeeId(Integer employeeID);
    int countByEmployeeId(int employeeId);

}
