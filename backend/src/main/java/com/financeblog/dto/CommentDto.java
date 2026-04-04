package com.financeblog.dto;

import com.financeblog.entity.Comment;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

public class CommentDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String content;
        private String authorName;
        private String authorEmail;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String content;
        private String authorName;
        private Comment.CommentStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminResponse {
        private Long id;
        private String content;
        private String authorName;
        private String authorEmail;
        private Comment.CommentStatus status;
        private Long postId;
        private String postTitle;
        private LocalDateTime createdAt;
    }
}
