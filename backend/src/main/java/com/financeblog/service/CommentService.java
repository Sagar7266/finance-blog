package com.financeblog.service;

import com.financeblog.dto.CommentDto;
import com.financeblog.entity.Comment;
import com.financeblog.entity.Post;
import com.financeblog.exception.ResourceNotFoundException;
import com.financeblog.repository.CommentRepository;
import com.financeblog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired CommentRepository commentRepository;
    @Autowired PostRepository postRepository;

    public CommentDto.Response addComment(Long postId, CommentDto.Request request) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthorName(request.getAuthorName());
        comment.setAuthorEmail(request.getAuthorEmail());
        comment.setPost(post);
        comment.setStatus(Comment.CommentStatus.PENDING);
        return toResponse(commentRepository.save(comment));
    }

    public List<CommentDto.Response> getApprovedByPost(Long postId) {
        return commentRepository.findByPostIdAndStatusOrderByCreatedAtDesc(postId, Comment.CommentStatus.APPROVED)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Page<CommentDto.AdminResponse> getAllAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return commentRepository.findAll(pageable).map(this::toAdminResponse);
    }

    public CommentDto.AdminResponse updateStatus(Long id, Comment.CommentStatus status) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        comment.setStatus(status);
        return toAdminResponse(commentRepository.save(comment));
    }

    public void delete(Long id) {
        if (!commentRepository.existsById(id)) throw new ResourceNotFoundException("Comment not found");
        commentRepository.deleteById(id);
    }

    private CommentDto.Response toResponse(Comment c) {
        CommentDto.Response r = new CommentDto.Response();
        r.setId(c.getId());
        r.setContent(c.getContent());
        r.setAuthorName(c.getAuthorName());
        r.setStatus(c.getStatus());
        r.setCreatedAt(c.getCreatedAt());
        return r;
    }

    private CommentDto.AdminResponse toAdminResponse(Comment c) {
        CommentDto.AdminResponse r = new CommentDto.AdminResponse();
        r.setId(c.getId());
        r.setContent(c.getContent());
        r.setAuthorName(c.getAuthorName());
        r.setAuthorEmail(c.getAuthorEmail());
        r.setStatus(c.getStatus());
        r.setCreatedAt(c.getCreatedAt());
        if (c.getPost() != null) {
            r.setPostId(c.getPost().getId());
            r.setPostTitle(c.getPost().getTitle());
        }
        return r;
    }
}
