package com.sethu.billingsystem.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class ImageUpload {

    @Autowired
    @Qualifier("customCloudinary")
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String cloudinaryFolder) throws IOException {
        log.info("Image Multipart Details : {}",file);
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder",cloudinaryFolder));
        log.info("Image Upload Details : {}",uploadResult);
        return uploadResult.get("url").toString();
    }
}
