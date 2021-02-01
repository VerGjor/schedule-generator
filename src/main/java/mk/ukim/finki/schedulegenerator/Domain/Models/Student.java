package mk.ukim.finki.schedulegenerator.Domain.Models;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Occurrences;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

// CRUD
@Entity
@Table(name = "students")
public class Student {

    @Id
    @Column(name = "student_index")
    private String index;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Occurrences> subjectOccurrencesForStudent = new ArrayList<>();

    public Student(String index){
        this.index = index;
    }

    public Student() {}

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public List<Occurrences> getSubjectOccurrencesForStudent() {
        return subjectOccurrencesForStudent;
    }

    public void setSubjectOccurrencesForStudent(List<Occurrences> subjectOccurrencesForStudent) {
        this.subjectOccurrencesForStudent = subjectOccurrencesForStudent;
    }

}
