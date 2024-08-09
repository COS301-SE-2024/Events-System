package com.back.demo.servicebus;

import com.back.demo.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeServiceBus {
    List<Employee> getAllEmployees();
    Optional<Employee> getEmployeeById(Long employeeId);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long employeeId, Employee employeeDetails);
    Employee patchEmployee(Long employeeId, Employee employeeDetails);
    void deleteEmployee(Long employeeId);
}
