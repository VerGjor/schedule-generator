package mk.ukim.finki.schedulegenerator.Domain.Models;

import javax.persistence.*;
import java.util.*;

// CRUD
@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "subject_id")
    private int id;

    @Column(name = "subject_name")
    private String name;

    // Winter / Summer
    @Column(name = "subject_enrollment_semester")
    private String semester;

    @Column(name = "has_laboratory_exercises")
    private boolean hasLaboratoryExercises;

    // The current professors that are teaching the subject [initially empty]
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "subject_professors",
            joinColumns = @JoinColumn(name = "subject_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id"))
    private List<Professor> professors;

    public void setId(int id) {
        this.id = id;
    }


    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public List<Professor> getProfessors() {
        return professors;
    }

    public void setProfessors(List<Professor> professors) {
        this.professors = professors;
    }

    public boolean isHasLaboratoryExercises() {
        return hasLaboratoryExercises;
    }

    public void setHasLaboratoryExercises(boolean hasLaboratoryExercises) {
        this.hasLaboratoryExercises = hasLaboratoryExercises;
    }
}
