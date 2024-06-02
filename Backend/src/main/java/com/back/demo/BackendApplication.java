package com.back.demo;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Controller
@SpringBootApplication
public class BackendApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @RequestMapping("/")
    @ResponseBody
    String home() {
        return "Hello World!";
    }

    @RequestMapping("/test-db-connection")
    @ResponseBody
    public String testDbConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return "Database connection is OK!";
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }


    /*With this setup, you can run your Spring Boot application and navigate to http://localhost:8080/tables to get a list of all table names from your PostgreSQL database. */
    @RequestMapping("/tables")
    @ResponseBody
    public List<String> getTableNames() {
        String query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
        return jdbcTemplate.query(query, (rs, rowNum) -> rs.getString("table_name"));
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
