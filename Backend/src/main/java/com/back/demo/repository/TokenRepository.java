package com.back.demo.repository;

import java.util.List;
import java.util.Optional;
import com.back.demo.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
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

    @Query(value = """
      select case when count(t) > 0 then true else false end 
      from Token t inner join Employee u
      on t.user.id = u.id
      where u.id = :id and t.tokenType = 'GOOGLE'
      """)
    boolean hasGoogleToken(@Param("id") Long employeeId);

    @Query("select t from Token t where t.user.id = :userId and t.tokenType = :tokenType")
    Optional<Token> findByUserIdAndTokenType(@Param("userId") Long userId, @Param("tokenType") String tokenType);
}
