package com.back.demo.repository;

import java.util.List;
import java.util.Optional;
import com.back.demo.model.Token;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Import Param annotation

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query(value = """
      select t from Token t inner join Employee u\s
      on t.user.id = u.id\s
      where u.id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<Token> findAllValidTokenByEmployeeId(@Param("id") Long employeeId);

    Optional<Token> findByTokenIgnoreCase(String token);
    
    @Modifying
    @Transactional
    @Query("delete from Token t where t.user.id = :id and (t.expired = true or t.revoked = true)")
    void deleteAllRevokedAndExpiredTokens(@Param("id") Long employeeId);
}
