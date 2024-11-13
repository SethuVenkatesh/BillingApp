package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class Customer {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @Column(name = "user_name",unique = true)
    private String userName;
    @Column(name = "password")
    private String password;
    @Column(name = "email_id",unique = true)
    private String email;
    @Column(name = "mobile_number")
    private String mobileNumber;
    @Column(name = "profile_url")
    private String profileUrl;
    @Column(name = "cloudinary_folder")
    private String cloudinaryFolder;
    @Column(name = "role")
    private String role="user";
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;


    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", profileUrl='" + profileUrl + '\'' +
                '}';
    }
}

