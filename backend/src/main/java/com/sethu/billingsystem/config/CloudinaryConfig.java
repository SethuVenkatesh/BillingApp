package com.sethu.billingsystem.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Configuration
public class CloudinaryConfig {
    @Bean(name = "customCloudinary")
    public Cloudinary cloudinaryConfig() {
        Cloudinary cloudinary = null;
        Map config = new HashMap();
        config.put("cloud_name", "dkjcfh7oj");
        config.put("api_key", "848555886754846");
        config.put("api_secret", "rwoeKAYdOrk4JCC4Kln97wkFc4o");
        cloudinary = new Cloudinary(config);
        return cloudinary;
    }
}
