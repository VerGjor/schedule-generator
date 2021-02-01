package mk.ukim.finki.schedulegenerator.Domain.Models;

import mk.ukim.finki.schedulegenerator.Domain.Models.Enums.GroupType;

import javax.persistence.*;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private int id;

    @Enumerated(EnumType.STRING)
    private GroupType type;

    @Column(name = "group_capacity")
    private int capacity;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "course_group",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Course course;

    @ManyToOne
    private Professor professor;

    public Group(){}

    public Group(String type, int capacity, Course course, Professor professor) {
        this.capacity = capacity;
        this.course = course;
        this.professor = professor;
        setType(type);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getType() {
        return type.getType();
    }

    private void setType(String type) {
        switch(type){
            case "Lecture": this.type = GroupType.LECTURE; break;
            case "Exercises": this.type = GroupType.EXERCISES; break;
            case "Laboratory": this.type = GroupType.LABORATORY; break;
            default: break;
        }
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }
}
