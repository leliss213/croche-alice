package com.leandro.crochemanager.service;

import com.leandro.crochemanager.entity.Project;
import com.leandro.crochemanager.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    public Project save(Project project) {
        if (project.getProjectMaterials() != null) {
            project.getProjectMaterials().forEach(pm -> pm.setProject(project));
        }
        return projectRepository.save(project);
    }

    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }

    public Project update(Long id, Project project) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setTitle(project.getTitle());
                    existingProject.setDescription(project.getDescription());
                    existingProject.setStatus(project.getStatus());
                    existingProject.setTotalPrice(project.getTotalPrice());
                    existingProject.setHoursWorked(project.getHoursWorked());
                    // Note: ProjectMaterials handling might be more complex depending on requirements,
                    // but for now we update the basic fields.
                    return projectRepository.save(existingProject);
                })
                .orElse(null);
    }
}
