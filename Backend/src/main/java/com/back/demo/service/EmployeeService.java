package com.back.demo.service;

import com.back.demo.model.Employee;
import com.back.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Primary
@Service
public class EmployeeService implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Cacheable(value = "employee", key = "#employeeId")
    public Optional<Employee> getEmployeeById(Long employeeId) {
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        //Remove tokens from the response, as they are sensitive information
        //Also, they result in lazy loading exceptions when the response is serialized for caching

        employeeOpt.ifPresent(employee -> {
            employee.setTokens(null);
            employee.setPassword(null);
        });        

        return employeeOpt;
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long employeeId, Employee employeeDetails) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(employeeId);
        if (optionalEmployee.isPresent()) {
            Employee employee = optionalEmployee.get();
            employee.setFirstName(employeeDetails.getFirstName());
            employee.setLastName(employeeDetails.getLastName());
            employee.setEmail(employeeDetails.getEmail());
            employee.setPassword(employeeDetails.getPassword());
            employee.setDietaryRequirements(employeeDetails.getDietaryRequirements());
            employee.setEmployeeDescription(employeeDetails.getEmployeeDescription());
            employee.setEmployeePictureLink(employeeDetails.getEmployeePictureLink());
            employee.setTwitter(employeeDetails.getTwitter());
            employee.setGithub(employeeDetails.getGithub());
            employee.setLinkedin(employeeDetails.getLinkedin());
            return employeeRepository.save(employee);
        } else {
            throw new RuntimeException("Employee not found with id " + employeeId);
        }
    }

    public Employee patchEmployee(Long employeeId, Employee employeeDetails) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(employeeId);
        if (optionalEmployee.isPresent()) {
            Employee employee = optionalEmployee.get();

            if (employeeDetails.getFirstName() != null) {
                employee.setFirstName(employeeDetails.getFirstName());
            }
            if (employeeDetails.getLastName() != null) {
                employee.setLastName(employeeDetails.getLastName());
            }
            if (employeeDetails.getEmail() != null) {
                employee.setEmail(employeeDetails.getEmail());
            }
            if (employeeDetails.getPassword() != null) {
                employee.setPassword(employeeDetails.getPassword());
            }
            if (employeeDetails.getDietaryRequirements() != null) {
                employee.setDietaryRequirements(employeeDetails.getDietaryRequirements());
            }
            if (employeeDetails.getEmployeeDescription() != null) {
                employee.setEmployeeDescription(employeeDetails.getEmployeeDescription());
            }
            if (employeeDetails.getEmployeePictureLink() != null) {
                employee.setEmployeePictureLink(employeeDetails.getEmployeePictureLink());
            }
            if (employeeDetails.getTwitter() != null) {
                employee.setTwitter(employeeDetails.getTwitter());
            }
            if (employeeDetails.getGithub() != null) {
                employee.setGithub(employeeDetails.getGithub());
            }
            if (employeeDetails.getLinkedin() != null) {
                employee.setLinkedin(employeeDetails.getLinkedin());
            }

            return employeeRepository.save(employee);
        } else {
            throw new RuntimeException("Employee not found with id " + employeeId);
        }
    }

    public void deleteEmployee(Long employeeId) {
        employeeRepository.deleteById(employeeId);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return employeeRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    public List<Employee> getEmployeesByIds(List<Long> employeeIds) {
        return employeeRepository.findByEmployeeIdIn(employeeIds);
    }
}
