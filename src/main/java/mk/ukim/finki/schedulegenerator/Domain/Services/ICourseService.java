package mk.ukim.finki.schedulegenerator.Domain.Services;

import java.util.List;

public interface ICourseService {

    void CreateCourses(String semester) throws InterruptedException;
    List<String> getGeneratedCoursesBySemester(String semester);

}
