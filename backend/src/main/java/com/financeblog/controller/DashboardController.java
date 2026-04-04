package com.financeblog.controller;

import com.financeblog.entity.Post;
import com.financeblog.entity.Comment;
import com.financeblog.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasAnyRole('ADMIN','AUTHOR')")
public class DashboardController {

    @Autowired PostRepository postRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired CommentRepository commentRepository;
    @Autowired UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", postRepository.count());
        stats.put("publishedPosts", postRepository.countByStatus(Post.PostStatus.PUBLISHED));
        stats.put("draftPosts", postRepository.countByStatus(Post.PostStatus.DRAFT));
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalComments", commentRepository.count());
        stats.put("pendingComments", commentRepository.countByStatus(Comment.CommentStatus.PENDING));
        stats.put("totalUsers", userRepository.count());
        return ResponseEntity.ok(stats);
    }
}
