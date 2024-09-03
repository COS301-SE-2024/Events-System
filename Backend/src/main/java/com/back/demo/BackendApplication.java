package com.back.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties.Jedis;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Controller
@SpringBootApplication
@RestController
public class BackendApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @RequestMapping("/")
    public String home() {
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


    @RequestMapping("/tables")
    @ResponseBody
    public List<String> getTableNames() {
        String query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
        return jdbcTemplate.query(query, (rs, rowNum) -> rs.getString("table_name"));
    }

    @RequestMapping("/test-redis-connection")
    public String testRedisConnection() {
        try {
            // Test Redis connection by setting and getting a value
            redisTemplate.opsForValue().set("testKey", "testValue");
            String value = redisTemplate.opsForValue().get("testKey");

            if ("testValue".equals(value)) {
                return "Redis connection is OK!";
            } else {
                return "Redis connection failed: Value mismatch";
            }
        } catch (Exception e) {
            return "Redis connection failed: " + e.getMessage();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    
}
