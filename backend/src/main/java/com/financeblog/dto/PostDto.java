package com.financeblog.dto;

import com.financeblog.entity.Post;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

public class PostDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String title;
        private String content;
        private String excerpt;
        private String featuredImage;
        private String metaTitle;
        private String metaDescription;
        private String metaKeywords;
        private Post.PostStatus status;
        private Boolean featured;
        private Integer readTime;
        private Long categoryId;
        private String tags;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String slug;
        private String content;
        private String excerpt;
        private String featuredImage;
        private String metaTitle;
        private String metaDescription;
        private String metaKeywords;
        private Post.PostStatus status;
        private Boolean featured;
        private Integer viewCount;
        private Integer readTime;
        private String tags;
        private CategoryDto.Response category;
        private AuthorDto author;
        private Long commentCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime publishedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private Long id;
        private String title;
        private String slug;
        private String excerpt;
        private String featuredImage;
        private Post.PostStatus status;
        private Boolean featured;
        private Integer viewCount;
        private Integer readTime;
        private String tags;
        private CategoryDto.Response category;
        private AuthorDto author;
        private Long commentCount;
        private LocalDateTime createdAt;
        private LocalDateTime publishedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDto {
        private Long id;
        private String username;
        private String fullName;
        private String avatar;
        private String bio;
    }
}
