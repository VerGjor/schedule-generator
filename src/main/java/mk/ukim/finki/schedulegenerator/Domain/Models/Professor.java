package mk.ukim.finki.schedulegenerator.Domain.Models;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Availability;

import java.util.List;
import javax.persistence.*;

// CRUD
@Entity
@Table(name = "professors")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "professor_id")
    private int id;

    @Column(name="first_name")
    private String firstName;

    @Column(name="title")
    private String title;

    @Column(name="last_name")
    private String lastName;

    @Column(name="faculty_position")
    private String position;

    // Subjects that the professor could teach
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "professor_subjects",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id"))
    private List<Subject> teachesSubjects;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(name = "professor_is_available_at",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "availability_id"))
    private List<Availability> availableAt;

    public int getId() {
        return id;
    }

    public boolean hasSubject(Subject subject){
        return teachesSubjects.stream().anyMatch(s -> s.getId() == subject.getId());
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<Subject> get_teachesSubjects() {
        return teachesSubjects;
    }

    public void set_teachesSubjects(List<Subject> _teachesSubjects) {
        this.teachesSubjects = _teachesSubjects;
    }

    public List<Availability> get_availableAt() {
        return availableAt;
    }

    public void set_availableAt(List<Availability> _availableAt) {
        this.availableAt = _availableAt;
    }

    public Availability getAvailabilityByDay(String day) throws Exception {
        return get_availableAt().stream().filter((a) -> a.getDay().name().equals(day.toUpperCase())).findFirst().orElseThrow(Exception::new);
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}

