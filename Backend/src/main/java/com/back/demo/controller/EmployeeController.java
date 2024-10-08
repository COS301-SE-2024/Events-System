package com.back.demo.controller;

import com.back.demo.model.Employee;
import com.back.demo.model.EventRSVP;
import com.back.demo.servicebus.EmployeeServiceBus;
import com.back.demo.servicebus.EventRSVPServiceBus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeServiceBus employeeServiceBus;

    @Autowired
    private EventRSVPServiceBus eventRSVPServiceBus;

    @Autowired
    public EmployeeController(EmployeeServiceBus employeeServiceBus) {
        this.employeeServiceBus = employeeServiceBus;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeServiceBus.getAllEmployees();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId) {
        Optional<Employee> employee = employeeServiceBus.getEmployeeById(employeeId);
        return employee.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeServiceBus.createEmployee(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable(value = "id") Long employeeId,
                                                   @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeServiceBus.updateEmployee(employeeId, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Employee> patchEmployee(@PathVariable(value = "id") Long employeeId,
                                                  @RequestBody Employee employeeDetails) {
        try {
            Employee patchedEmployee = employeeServiceBus.patchEmployee(employeeId, employeeDetails);
            return ResponseEntity.ok(patchedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable(value = "id") Long employeeId) {
        try {
            employeeServiceBus.deleteEmployee(employeeId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeeProfileById(@PathVariable(value = "id") Long employeeId) {
        Optional<Employee> employeeOptional = employeeServiceBus.getEmployeeById(employeeId);
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

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getEmployeesByEventId(@PathVariable Integer eventId) {
        // Fetch RSVPs for the event
        List<EventRSVP> rsvps = eventRSVPServiceBus.getEventRSVPsByEventId(eventId);

        // Check if there are RSVPs
        if (rsvps.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Extract and convert employee IDs
        List<Long> employeeIds = rsvps.stream()
                                    .map(rsvp -> (long) rsvp.getEmployeeId()) // Direct conversion
                                    .collect(Collectors.toList());

        //Remove duplicates
        employeeIds = employeeIds.stream().distinct().collect(Collectors.toList());

        // Fetch employees by IDs
        List<Employee> employees = employeeServiceBus.getEmployeesByEmployeeIdIn(employeeIds);

        // Create a map for quick lookup of employees by ID
        Map<Long, Employee> employeeMap = employees.stream()
                                                .collect(Collectors.toMap(Employee::getEmployeeId, employee -> employee));

        // Join RSVPs with Employee data
        List<Map<String, Object>> joinedResult = rsvps.stream()
            .map(rsvp -> {
                Employee employee = employeeMap.get((long) rsvp.getEmployeeId());
                if (employee != null) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("rsvp", rsvp);
                    result.put("employee", employee);
                    return result;
                }
                return null;
            })
            .filter(Objects::nonNull) // Remove null entries if any
            .collect(Collectors.toList());

        //If there are two distinct RSVPs for the same employee, remove the duplicate
        joinedResult = joinedResult.stream().distinct().collect(Collectors.toList());

        return ResponseEntity.ok(joinedResult);
    }


}
