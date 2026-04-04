package com.financeblog.service;

import com.financeblog.dto.PostDto;
import com.financeblog.dto.CategoryDto;
import com.financeblog.entity.Category;
import com.financeblog.entity.Post;
import com.financeblog.entity.User;
import com.financeblog.exception.BadRequestException;
import com.financeblog.exception.ResourceNotFoundException;
import com.financeblog.repository.CategoryRepository;
import com.financeblog.repository.CommentRepository;
import com.financeblog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired PostRepository postRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired CommentRepository commentRepository;

    public Page<PostDto.Summary> getAllPublished(int page, int size, String sort) {
        Sort sortObj = sort.equals("popular")
            ? Sort.by("viewCount").descending()
            : Sort.by("publishedAt").descending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return postRepository.findByStatus(Post.PostStatus.PUBLISHED, pageable)
            .map(this::toSummary);
    }

    public Page<PostDto.Summary> getByCategory(String categorySlug, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return postRepository.findByCategorySlugAndStatus(categorySlug, Post.PostStatus.PUBLISHED, pageable)
            .map(this::toSummary);
    }

    public Page<PostDto.Summary> getFeatured(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return postRepository.findByFeaturedTrueAndStatus(Post.PostStatus.PUBLISHED, pageable)
            .map(this::toSummary);
    }

    public Page<PostDto.Summary> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return postRepository.searchPosts(query, pageable).map(this::toSummary);
    }

    @Transactional
    public PostDto.Response getBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + slug));
        postRepository.incrementViewCount(post.getId());
        post.setViewCount(post.getViewCount() + 1);
        return toResponse(post);
    }

    public PostDto.Response getById(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
        return toResponse(post);
    }

    public PostDto.Response create(PostDto.Request request, User author) {
        Post post = new Post();
        mapRequestToPost(request, post);
        post.setAuthor(author);
        post.setSlug(generateSlug(request.getTitle()));
        if (request.getStatus() == Post.PostStatus.PUBLISHED) {
            post.setPublishedAt(LocalDateTime.now());
        }
        return toResponse(postRepository.save(post));
    }

    public PostDto.Response update(Long id, PostDto.Request request) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
        mapRequestToPost(request, post);
        if (request.getStatus() == Post.PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        return toResponse(postRepository.save(post));
    }

    public void delete(Long id) {
        if (!postRepository.existsById(id)) throw new ResourceNotFoundException("Post not found: " + id);
        postRepository.deleteById(id);
    }

    public List<PostDto.Summary> getRelated(Long postId, Long categoryId) {
        return postRepository.findTop5ByCategoryIdAndStatusAndIdNotOrderByCreatedAtDesc(
            categoryId, Post.PostStatus.PUBLISHED, postId)
            .stream().map(this::toSummary).collect(Collectors.toList());
    }

    public Page<PostDto.Summary> getAllAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findAll(pageable).map(this::toSummary);
    }

    // ---- Helpers ----

    private void mapRequestToPost(PostDto.Request req, Post post) {
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());
        post.setExcerpt(req.getExcerpt());
        post.setFeaturedImage(req.getFeaturedImage());
        post.setMetaTitle(req.getMetaTitle() != null ? req.getMetaTitle() : req.getTitle());
        post.setMetaDescription(req.getMetaDescription() != null ? req.getMetaDescription() : req.getExcerpt());
        post.setMetaKeywords(req.getMetaKeywords());
        post.setStatus(req.getStatus() != null ? req.getStatus() : Post.PostStatus.DRAFT);
        post.setFeatured(req.getFeatured() != null ? req.getFeatured() : false);
        post.setReadTime(req.getReadTime() != null ? req.getReadTime() : estimateReadTime(req.getContent()));
        post.setTags(req.getTags());
        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            post.setCategory(cat);
        }
    }

    private int estimateReadTime(String content) {
        if (content == null) return 5;
        int words = content.split("\\s+").length;
        return Math.max(1, words / 200);
    }

    private String generateSlug(String title) {
        String base = title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
        String slug = base;
        int counter = 1;
        while (postRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    public PostDto.Summary toSummary(Post post) {
        PostDto.Summary s = new PostDto.Summary();
        s.setId(post.getId());
        s.setTitle(post.getTitle());
        s.setSlug(post.getSlug());
        s.setExcerpt(post.getExcerpt());
        s.setFeaturedImage(post.getFeaturedImage());
        s.setStatus(post.getStatus());
        s.setFeatured(post.getFeatured());
        s.setViewCount(post.getViewCount());
        s.setReadTime(post.getReadTime());
        s.setTags(post.getTags());
        s.setCreatedAt(post.getCreatedAt());
        s.setPublishedAt(post.getPublishedAt());
        if (post.getCategory() != null) s.setCategory(toCategoryResponse(post.getCategory()));
        if (post.getAuthor() != null) s.setAuthor(toAuthorDto(post.getAuthor()));
        s.setCommentCount(commentRepository.countByPostId(post.getId()));
        return s;
    }

    public PostDto.Response toResponse(Post post) {
        PostDto.Response r = new PostDto.Response();
        r.setId(post.getId());
        r.setTitle(post.getTitle());
        r.setSlug(post.getSlug());
        r.setContent(post.getContent());
        r.setExcerpt(post.getExcerpt());
        r.setFeaturedImage(post.getFeaturedImage());
        r.setMetaTitle(post.getMetaTitle());
        r.setMetaDescription(post.getMetaDescription());
        r.setMetaKeywords(post.getMetaKeywords());
        r.setStatus(post.getStatus());
        r.setFeatured(post.getFeatured());
        r.setViewCount(post.getViewCount());
        r.setReadTime(post.getReadTime());
        r.setTags(post.getTags());
        r.setCreatedAt(post.getCreatedAt());
        r.setUpdatedAt(post.getUpdatedAt());
        r.setPublishedAt(post.getPublishedAt());
        if (post.getCategory() != null) r.setCategory(toCategoryResponse(post.getCategory()));
        if (post.getAuthor() != null) r.setAuthor(toAuthorDto(post.getAuthor()));
        r.setCommentCount(commentRepository.countByPostId(post.getId()));
        return r;
    }

    private CategoryDto.Response toCategoryResponse(Category c) {
        CategoryDto.Response r = new CategoryDto.Response();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setSlug(c.getSlug());
        r.setDescription(c.getDescription());
        r.setIcon(c.getIcon());
        r.setColor(c.getColor());
        return r;
    }

    private PostDto.AuthorDto toAuthorDto(User u) {
        PostDto.AuthorDto a = new PostDto.AuthorDto();
        a.setId(u.getId());
        a.setUsername(u.getUsername());
        a.setFullName(u.getFullName());
        a.setAvatar(u.getAvatar());
        a.setBio(u.getBio());
        return a;
    }
}
