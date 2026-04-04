package com.financeblog.controller;

import com.financeblog.dto.PostDto;
import com.financeblog.entity.User;
import com.financeblog.service.AuthService;
import com.financeblog.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired PostService postService;
    @Autowired AuthService authService;

    @GetMapping
    public ResponseEntity<Page<PostDto.Summary>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size,
        @RequestParam(defaultValue = "latest") String sort) {
        return ResponseEntity.ok(postService.getAllPublished(page, size, sort));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<PostDto.Summary>> getFeatured(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(postService.getFeatured(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDto.Summary>> search(
        @RequestParam String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size) {
        return ResponseEntity.ok(postService.search(q, page, size));
    }

    @GetMapping("/category/{slug}")
    public ResponseEntity<Page<PostDto.Summary>> getByCategory(
        @PathVariable String slug,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "9") int size) {
        return ResponseEntity.ok(postService.getByCategory(slug, page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PostDto.Response> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getBySlug(slug));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<PostDto.Summary>> getRelated(
        @PathVariable Long id,
        @RequestParam Long categoryId) {
        return ResponseEntity.ok(postService.getRelated(id, categoryId));
    }

    // ---- Admin endpoints ----

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN','AUTHOR')")
    public ResponseEntity<Page<PostDto.Summary>> getAllAdmin(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllAdmin(page, size));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','AUTHOR')")
    public ResponseEntity<PostDto.Response> create(@RequestBody PostDto.Request request) {
        User author = authService.getCurrentUser();
        return ResponseEntity.ok(postService.create(request, author));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','AUTHOR')")
    public ResponseEntity<PostDto.Response> update(
        @PathVariable Long id, @RequestBody PostDto.Request request) {
        return ResponseEntity.ok(postService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.ok("Post deleted");
    }
}
