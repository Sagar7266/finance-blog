package com.financeblog.controller;

import com.financeblog.dto.CommentDto;
import com.financeblog.entity.Comment;
import com.financeblog.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class CommentController {

    @Autowired CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto.Response> addComment(
        @PathVariable Long postId, @RequestBody CommentDto.Request request) {
        return ResponseEntity.ok(commentService.addComment(postId, request));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentDto.Response>> getByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getApprovedByPost(postId));
    }

    @GetMapping("/admin/comments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<CommentDto.AdminResponse>> getAllAdmin(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getAllAdmin(page, size));
    }

    @PatchMapping("/admin/comments/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDto.AdminResponse> updateStatus(
        @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(commentService.updateStatus(id, Comment.CommentStatus.valueOf(status)));
    }

    @DeleteMapping("/admin/comments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.ok("Comment deleted");
    }
}
