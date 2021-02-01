package mk.ukim.finki.schedulegenerator.Domain.Models;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.SchoolYear;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private int id;

    @Column(name = "school_year")
    private SchoolYear schoolYear;

    @OneToOne
    @JoinTable(name = "course_from_subject",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id"))
    private Subject subject;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "first_time_listeners",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private List<Student> firstTimeStudents;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "course_repeaters",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private List<Student> repeatingStudents;

    public SchoolYear getSchoolYear() {
        return schoolYear;
    }

    public void setSchoolYear(SchoolYear schoolYear) {
        this.schoolYear = schoolYear;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public List<Student> getFirstTimeStudents() {
        return firstTimeStudents;
    }

    public void setFirstTimeStudents(List<Student> firstTimeStudents) {
        this.firstTimeStudents = firstTimeStudents;
    }

    public List<Student> getRepeatingStudents() {
        return repeatingStudents;
    }

    public void setRepeatingStudents(List<Student> repeatingStudents) {
        this.repeatingStudents = repeatingStudents;
    }

}
