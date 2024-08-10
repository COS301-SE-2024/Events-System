package com.back.demo.servicebus;

import com.back.demo.model.Employee;
import com.back.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceBusImpl implements EmployeeServiceBus {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeServiceBusImpl(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @Override
    public Optional<Employee> getEmployeeById(Long employeeId) {
        return employeeService.getEmployeeById(employeeId);
    }

    @Override
    public Employee createEmployee(Employee employee) {
        Employee createdEmployee = employeeService.createEmployee(employee);
        return createdEmployee;
    }

    @Override
    public Employee updateEmployee(Long employeeId, Employee employeeDetails) {
        Employee updatedEmployee = employeeService.updateEmployee(employeeId, employeeDetails);
        return updatedEmployee;
    }

    @Override
    public Employee patchEmployee(Long employeeId, Employee employeeDetails) {
        Employee patchedEmployee = employeeService.patchEmployee(employeeId, employeeDetails);
        return patchedEmployee;
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        Optional<Employee> optionalEmployee = employeeService.getEmployeeById(employeeId);
        if (optionalEmployee.isPresent()) {
            employeeService.deleteEmployee(employeeId);
        } else {
            throw new RuntimeException("Employee not found with id " + employeeId);
        }
    }
}
