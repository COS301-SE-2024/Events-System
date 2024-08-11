package com.back.demo.repository;

import com.back.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmailIgnoreCase(String email);
    Optional<Employee> findByEmployeeId(Long employeeId);
    List<Employee> findAll();
    List<Employee> findByEmployeeIdIn(List<Long> employeeIds);
}
