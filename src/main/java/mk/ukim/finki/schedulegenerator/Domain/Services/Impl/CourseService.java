package mk.ukim.finki.schedulegenerator.Domain.Services.Impl;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.SchoolYear;
import mk.ukim.finki.schedulegenerator.Domain.Models.Course;
import mk.ukim.finki.schedulegenerator.Domain.Services.ICourseService;
import mk.ukim.finki.schedulegenerator.Domain.Models.Student;
import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;

@Service
public class CourseService implements ICourseService {

    private final ICourseRepositoryJPA _courseRepository;
    private final IGroupRepositoryJPA groupRepositoryJPA;

    @Autowired
    public CourseService(ICourseRepositoryJPA courseRepository, IGroupRepositoryJPA groupRepositoryJPA){
        this._courseRepository = courseRepository;
        this.groupRepositoryJPA = groupRepositoryJPA;
    }

    @PostConstruct
    public void init(){
        groupRepositoryJPA.deleteAll();
        _courseRepository.deleteAll();
    }

    // Takes all subjects from that semester and for each one checks
    // if there are 10(can be changed) or more students and creates a course for that subject
    // if there are less it ignores it and no course is created
    public void CreateCourses(String which_semester) {

        Vector<Subject> allSubjects = new Vector<>();

        String semester;
        if(which_semester.contains(",")) semester = which_semester.replace(",", "");
        else semester = which_semester;

        SubjectService.subjectsDictionary.forEach((s, subject) -> {
            if(subject.getSemester().equals(semester)) {
                allSubjects.add(subject);
            }
        });

        boolean isWinterSemester = semester.equals("Winter");

        // The school year is generated from the system's date
        String schoolYear =
                isWinterSemester ?
                        LocalDate.now().getYear() + "/" + (LocalDate.now().getYear() + 1)
                        :
                        (LocalDate.now().getYear() - 1) + "/" + LocalDate.now().getYear();

        SchoolYear year = new SchoolYear(isWinterSemester, schoolYear);


        for(Subject subject: allSubjects){
            List<Student> studentsForSubject = new LinkedList<>();

            StudentService.students.forEach(student -> {
                if(student.getSubjectOccurrencesForStudent().stream().anyMatch(occurrences ->
                        occurrences.getSubject().equals(subject.getName().toUpperCase()))) {
                    studentsForSubject.add(student);
                }
            });

            boolean hasPossibleTeachers = ProfessorService.professors.values().stream().anyMatch(professor -> professor.hasSubject(subject));
            if(studentsForSubject.size() >= 10 && hasPossibleTeachers){
                Course course = new Course();
                course.setSubject(subject);
                course.setSchoolYear(year);

                // Filters the students according to the number of times the student has listened to a subject
                List<Student> firstTimeStudents = new ArrayList<>();
                studentsForSubject.forEach(student -> {
                    if(student.getSubjectOccurrencesForStudent().stream().anyMatch(occurrences ->
                            occurrences.getSubject().equals(subject.getName().toUpperCase()) && occurrences.getOccurrences() == 1)) {
                        firstTimeStudents.add(student);
                    }
                });
                course.setFirstTimeStudents(firstTimeStudents);

                List<Student> courseRepeaters = new ArrayList<>();
                studentsForSubject.forEach(student -> {
                    if(student.getSubjectOccurrencesForStudent().stream().anyMatch(occurrences ->
                            occurrences.getSubject().equals(subject.getName().toUpperCase()) && occurrences.getOccurrences() > 1)) {
                        courseRepeaters.add(student);
                    }
                });
                course.setRepeatingStudents(courseRepeaters);
                _courseRepository.save(course);
            }
        }
    }

    @Override
    public List<String> getGeneratedCoursesBySemester(String semester) {
        boolean isWinter = semester.equals("Winter");
        List<String> courses = new ArrayList<>();
        _courseRepository.findAll().stream()
                .filter(course -> course.getSchoolYear().isWinterSemester() == isWinter)
                .forEach(course -> {
                    int numberOfStudents = course.getFirstTimeStudents().size() + course.getRepeatingStudents().size();
                    courses.add(course.getSubject().getName()+" - "+numberOfStudents);
                });
        return courses;
    }
}
