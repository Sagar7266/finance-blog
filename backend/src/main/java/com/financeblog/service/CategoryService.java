package com.financeblog.service;

import com.financeblog.dto.CategoryDto;
import com.financeblog.entity.Category;
import com.financeblog.exception.BadRequestException;
import com.financeblog.exception.ResourceNotFoundException;
import com.financeblog.repository.CategoryRepository;
import com.financeblog.repository.PostRepository;
import com.financeblog.entity.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired CategoryRepository categoryRepository;
    @Autowired PostRepository postRepository;

    public List<CategoryDto.Response> getAll() {
        return categoryRepository.findAll().stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public CategoryDto.Response getBySlug(String slug) {
        Category cat = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + slug));
        return toResponse(cat);
    }

    public CategoryDto.Response getById(Long id) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        return toResponse(cat);
    }

    public CategoryDto.Response create(CategoryDto.Request request) {
        if (categoryRepository.existsByName(request.getName()))
            throw new BadRequestException("Category name already exists");
        Category cat = new Category();
        mapRequest(request, cat);
        cat.setSlug(generateSlug(request.getName()));
        return toResponse(categoryRepository.save(cat));
    }

    public CategoryDto.Response update(Long id, CategoryDto.Request request) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        mapRequest(request, cat);
        return toResponse(categoryRepository.save(cat));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) throw new ResourceNotFoundException("Category not found");
        categoryRepository.deleteById(id);
    }

    private void mapRequest(CategoryDto.Request req, Category cat) {
        cat.setName(req.getName());
        cat.setDescription(req.getDescription());
        cat.setIcon(req.getIcon());
        cat.setColor(req.getColor());
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-");
    }

    private CategoryDto.Response toResponse(Category c) {
        CategoryDto.Response r = new CategoryDto.Response();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setSlug(c.getSlug());
        r.setDescription(c.getDescription());
        r.setIcon(c.getIcon());
        r.setColor(c.getColor());
        r.setCreatedAt(c.getCreatedAt());
        r.setPostCount(postRepository.countByCategoryId(c.getId()));
        return r;
    }
}
