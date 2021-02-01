package mk.ukim.finki.schedulegenerator.Domain.Services.Comparators;

import mk.ukim.finki.schedulegenerator.Domain.Models.Course;

import java.util.Comparator;

public class CourseComparator implements Comparator<Course> {
    @Override
    public int compare(Course course, Course t1) {
        if ((course.getFirstTimeStudents().size() + course.getRepeatingStudents().size()) < (t1.getFirstTimeStudents().size() + t1.getRepeatingStudents().size()))
            return course.getSubject().getName().compareTo(t1.getSubject().getName());
        return (course.getFirstTimeStudents().size() + course.getRepeatingStudents().size()) < (t1.getFirstTimeStudents().size() + t1.getRepeatingStudents().size()) ? -1 : 1;
    }
}
