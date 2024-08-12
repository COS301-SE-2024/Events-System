package com.back.demo.service;

import com.back.demo.model.Employee;
import com.back.demo.model.PasswordResetToken;
import com.back.demo.repository.PasswordResetTokenRepository;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;

import com.back.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import java.util.Date;

@Service
public class PasswordResetService {
    @Autowired
    private EmployeeRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

public void createPasswordResetTokenForUser(Employee user, String token) {
    PasswordResetToken myToken = new PasswordResetToken();
    myToken.setToken(token);
    myToken.setEmployeeId(user.getEmployeeId());
    
    LocalDateTime expiryDateTime = LocalDateTime.now().plus(30, ChronoUnit.MINUTES);
    Date expiryDate = Date.from(expiryDateTime.atZone(ZoneId.systemDefault()).toInstant());
    
    myToken.setExpiryDate(expiryDate);
    tokenRepository.save(myToken);
}

    public void sendPasswordResetEmail(String email, String token)  throws MessagingException{
    MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

    String htmlMsg = "<html>"
    + "<body>"
    + "<h1>Password reset</h1>"
    + "<p>Hi There,</p><br/>"
    + "<p>We received a request to reset your password for your SynC account.</p>"
    + "<p>Click the link below to reset your password:</p>"
    + "<a href='https://events-system.org/reset-password/token=" + token + "' style='text-decoration: none;'>"
    + "<button style='padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;'>Reset Password</button>"
    + "</a>"
    + "<p>If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.</p>"
    + "<p>Best regards,</p>"
    + "<p>SynC Team</p>"
    + "</body>"
    + "</html>";

        helper.setTo(email);
        helper.setSubject("Password Reset Request");
        helper.setText(htmlMsg, true); // Set to true to indicate HTML content
        helper.setFrom("Bieber.capstone@gmail.com"); // Ensure this is a valid email address

        mailSender.send(mimeMessage);
    }

    public Long validatePasswordResetToken(String token) {
        PasswordResetToken passToken = tokenRepository.findByTokenIgnoreCase(token);
        if (passToken == null) {
            return null;
        }
        return passToken.getEmployeeId();
    }

    public void changeUserPassword(Optional<Employee> user, String newPassword, String token) {
        if (user.isPresent()) {
            Employee employee = user.get();
            employee.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(employee);
            deletePasswordResetToken(token);
        } else {
            // Handle the case where the user is not present
            throw new IllegalArgumentException("User not found");
        }
    }
    public void deletePasswordResetToken(String token) {
        PasswordResetToken passToken = tokenRepository.findByTokenIgnoreCase(token);
        if (passToken != null) {
            tokenRepository.delete(passToken);
        }
    }

}