package com.back.demo.repository;

import java.util.List;
import java.util.Optional;
import com.back.demo.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Import Param annotation

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("""
    SELECT t FROM Token t 
    INNER JOIN Employee e ON t.user.id = e.id 
    WHERE e.id = :id AND (t.expired = false OR t.revoked = false)
    """)
    List<Token> findAllValidTokenByEmployeeId(@Param("id") Long employeeId); // Use @Param annotation to match the query parameter name

    Optional<Token> findByToken(String token);
}
