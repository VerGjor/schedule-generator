package mk.ukim.finki.schedulegenerator.Domain.Services.Helpers;

import mk.ukim.finki.schedulegenerator.Domain.Models.Course;
import mk.ukim.finki.schedulegenerator.Domain.Models.Group;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import mk.ukim.finki.schedulegenerator.Domain.Services.Comparators.ProfessorAssignmentComparator;
import mk.ukim.finki.schedulegenerator.Domain.Services.Comparators.ProfessorComparator;
import mk.ukim.finki.schedulegenerator.Domain.Services.Impl.ProfessorService;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;
import java.util.stream.Collectors;


public class ProfessorHelper {

    static String getProfessorPosition(String type){
        String position;
        switch (type) {
            case "Lecture": position = "professor"; break;
            case "Exercises": position = "assistant"; break;
            case "Laboratory": position = "demonstrator"; break;
            default: position = "";
        }
        return position;
    }

    public static List<Professor> getProfessorCouldTeachSubject(String type, int subjectID){
        return ProfessorService.professors.values()
                .stream()
                .filter(professor -> professor.getPosition().equals(type))
                .filter(professor -> professor.get_teachesSubjects().stream().anyMatch(subject -> subject.getId() == subjectID))
                .collect(Collectors.toList());
    }


    public static Professor assignProfessorToCourseGroup(Vector<Group> groups, Course course, String type, boolean haveAllBeenAssigned) {

        String finalProfessorFilter = getProfessorPosition(type);
        List<Professor> professorList;
        Professor professor = null;

        if(!haveAllBeenAssigned) {
            // Fetch all the professors that could teach the subject and that hasn't been assigned to the current subject
            professorList = getProfessorCouldTeachSubject(finalProfessorFilter, course.getSubject().getId()).stream()
                    .filter(p -> course.getSubject().getProfessors().stream()
                            .noneMatch(professor1 -> professor1.getId() == p.getId()))
                    .filter(p -> groups.stream().filter(group -> group.getProfessor() != null
                            && group.getCourse().getSchoolYear() == course.getSchoolYear()).count() < 5)
                    .sorted(new ProfessorComparator()).collect(Collectors.toCollection(LinkedList::new));
        }
        else {
            // If all the professors that could teach this subject have been assigned, then use one of them twice
            // else assign the professor that could teach the least number of subjects and hasn't been assigned
            // to this subject
            professorList = new ArrayList<>(getProfessorCouldTeachSubject(finalProfessorFilter, course.getSubject().getId()));
            if (professorList.size() > 0) professorList.sort(new ProfessorAssignmentComparator(groups));
        }

        if(professorList.size() > 0) professor = professorList.get(0);

        return professor;
    }

}
