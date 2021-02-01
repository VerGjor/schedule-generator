package mk.ukim.finki.schedulegenerator.Domain.Services.Helpers;

import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import java.util.ArrayList;
import java.util.List;

public class CoursesSubjectsHelper {

    private Subject subject;
    private List<Professor> professors;

    public CoursesSubjectsHelper(Subject subject, List<Professor> professors){
        this.subject = subject;
        this.professors = new ArrayList<>(professors);
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public List<Professor> getProfessors() {
        return professors;
    }

    public void setProfessors(List<Professor> professors) {
        this.professors = professors;
    }
}
