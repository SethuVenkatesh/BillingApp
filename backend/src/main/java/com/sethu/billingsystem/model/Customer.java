package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Data;

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
    @Column(name = "profile_url")
    private String profileUrl;
    @Column(name = "role")
    private String role;
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

