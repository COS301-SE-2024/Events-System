package com.back.demo;

import com.back.demo.model.Employee;
import com.back.demo.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import com.back.demo.service.*;
import com.back.demo.repository.*;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    public void testGetAllEmployees() {
        Employee employee1 = new Employee();
        employee1.setEmployeeId(1L);
        employee1.setFirstName("John");
        employee1.setLastName("Doe");
        employee1.setEmail("john.doe@example.com");
        employee1.setPassword("password1");
        employee1.setDietaryRequirements("Vegetarian");
        employee1.setEmployeeDescription("Senior Developer");
        employee1.setEmployeePictureLink("link_to_picture");
        employee1.setTwitter("john_doe");
        employee1.setGithub("john_doe");
        employee1.setLinkedin("john_doe");
    
        Employee employee2 = new Employee();
        employee2.setEmployeeId(2L);
        employee2.setFirstName("Jane");
        employee2.setLastName("Doe");
        employee2.setEmail("jane.doe@example.com");
        employee2.setPassword("password2");
        employee2.setDietaryRequirements("Vegan");
        employee2.setEmployeeDescription("Project Manager");
        employee2.setEmployeePictureLink("link_to_picture");
        employee2.setTwitter("jane_doe");
        employee2.setGithub("jane_doe");
        employee2.setLinkedin("jane_doe");
    
        List<Employee> expectedEmployees = Arrays.asList(employee1, employee2);
    
        when(employeeRepository.findAll()).thenReturn(expectedEmployees);
    
        List<Employee> actualEmployees = employeeService.getAllEmployees();
    
        assertEquals(expectedEmployees, actualEmployees);
    }
    
    @Test
    public void testGetEmployeeById() {
        Employee employee1 = new Employee();
        employee1.setEmployeeId(1L);
        employee1.setFirstName("John");
        employee1.setLastName("Doe");
        employee1.setEmail("john.doe@example.com");
        employee1.setPassword("password1");
        employee1.setDietaryRequirements("Vegetarian");
        employee1.setEmployeeDescription("Senior Developer");
        employee1.setEmployeePictureLink("link_to_picture");
        employee1.setTwitter("john_doe");
        employee1.setGithub("john_doe");
        employee1.setLinkedin("john_doe");
    
        Employee employee2 = new Employee();
        employee2.setEmployeeId(2L);
        employee2.setFirstName("Jane");
        employee2.setLastName("Doe");
        employee2.setEmail("jane.doe@example.com");
        employee2.setPassword("password2");
        employee2.setDietaryRequirements("Vegan");
        employee2.setEmployeeDescription("Project Manager");
        employee2.setEmployeePictureLink("link_to_picture");
        employee2.setTwitter("jane_doe");
        employee2.setGithub("jane_doe");
        employee2.setLinkedin("jane_doe");
        
        Long employeeId = 1L;
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee1));
    
        Optional<Employee> actualEmployee = employeeService.getEmployeeById(employeeId);
    
        assertEquals(Optional.of(employee1), actualEmployee);
    }
}