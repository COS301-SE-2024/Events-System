package com.back.demo.controller;

import com.back.demo.model.Employee;
import com.back.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId) {
        Optional<Employee> employee = employeeService.getEmployeeById(employeeId);
        return employee.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable(value = "id") Long employeeId,
                                                   @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(employeeId, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Employee> patchEmployee(@PathVariable(value = "id") Long employeeId,
                                                  @RequestBody Employee employeeDetails) {
        try {
            Employee patchedEmployee = employeeService.patchEmployee(employeeId, employeeDetails);
            return ResponseEntity.ok(patchedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable(value = "id") Long employeeId) {
        try {
            employeeService.deleteEmployee(employeeId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // New Endpoint with Null Handling
    @GetMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeeProfileById(@PathVariable(value = "id") Long employeeId) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeById(employeeId);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            Map<String, Object> profile = new HashMap<>();
            profile.put("firstName", employee.getFirstName());
            profile.put("lastName", employee.getLastName());
            profile.put("email", employee.getEmail());
            profile.put("employeeDescription", employee.getEmployeeDescription());
            profile.put("employeePictureLink", employee.getEmployeePictureLink());
            profile.put("twitter", employee.getTwitter());
            profile.put("github", employee.getGithub());
            profile.put("linkedin", employee.getLinkedin());

            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
